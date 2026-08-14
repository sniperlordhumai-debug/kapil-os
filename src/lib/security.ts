// =============================================================
// SECURITY HELPERS — server-only utilities for rate limiting,
// input validation, sanitization and origin checks.
// These must ONLY be imported from Server Components / API Routes
// (never from client components) so secrets and logic stay server-side.
// =============================================================

// ------------------------------------------------------------------
// Input constraints (shared between client validation and server
// validation — never trust client checks alone).
// ------------------------------------------------------------------
export const LIMITS = {
  name: { min: 2, max: 80 },
  email: { max: 254 },
  message: { min: 10, max: 2000 },
  bodyBytes: 16 * 1024, // 16 KB cap on request body
} as const;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Basic email format check. Returns true when valid. */
export function isValidEmail(value: string): boolean {
  if (!value || value.length > LIMITS.email.max) return false;
  return EMAIL_RE.test(value);
}

/**
 * Sanitize free-text input: strip control characters and surrounding
 * whitespace, collapse excessive whitespace, enforce max length.
 * Output is treated as plain text (React escapes it on render).
 */
export function sanitizeText(value: string, max: number): string {
  // eslint-disable-next-line no-control-regex
  const cleaned = value.replace(/[\u0000-\u001f\u007f]/g, " ").replace(/\s{3,}/g, " ").trim();
  return cleaned.slice(0, max);
}

/** Validate a contact payload. Returns { ok: true } or { ok: false, error } */
export function validateContact(payload: {
  name?: unknown;
  email?: unknown;
  message?: unknown;
  honeypot?: unknown;
}):
  | { ok: true; name: string; email: string; message: string }
  | { ok: false; error: string; status: number } {
  if (typeof payload !== "object" || payload === null) {
    return { ok: false, error: "Invalid request.", status: 400 };
  }
  // Honeypot must be empty for non-bots.
  if (typeof payload.honeypot === "string" && payload.honeypot.length > 0) {
    return { ok: false, error: "Request rejected.", status: 400 };
  }

  const name = sanitizeText(typeof payload.name === "string" ? payload.name : "", LIMITS.name.max);
  const emailRaw = sanitizeText(typeof payload.email === "string" ? payload.email : "", LIMITS.email.max);
  const message = sanitizeText(typeof payload.message === "string" ? payload.message : "", LIMITS.message.max);

  if (name.length < LIMITS.name.min) {
    return { ok: false, error: "Please provide your name (2+ characters).", status: 422 };
  }
  if (!isValidEmail(emailRaw)) {
    return { ok: false, error: "Please provide a valid email address.", status: 422 };
  }
  if (message.length < LIMITS.message.min) {
    return { ok: false, error: "Please write a message (at least 10 characters).", status: 422 };
  }
  return { ok: true, name, email: emailRaw.toLowerCase(), message };
}

// ------------------------------------------------------------------
// In-memory sliding-window rate limiter.
//
// NOTE: This is per-process. On a horizontally-scaled platform (Vercel
// serverless) each instance tracks its own window, so it is a practical
// baseline defense, not a hard global guarantee. For strict distributed
// limiting, replace with an external store (Upstash/Vercel KV) — see SECURITY.md.
// ------------------------------------------------------------------
type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();
// Cap the map size so an attacker cannot exhaust memory via many IPs.
const MAX_BUCKETS = 5000;

export interface RateLimitOpts {
  windowMs?: number;
  max?: number;
}

export function rateLimit(key: string, { windowMs = 60000, max = 30 }: RateLimitOpts = {}): {
  ok: boolean;
  remaining: number;
  retryAfterSec: number;
} {
  const now = Date.now();
  let bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    bucket = { count: 0, resetAt: now + windowMs };
    if (buckets.size >= MAX_BUCKETS) {
      // Evict oldest entries to stay bounded.
      let oldest: string | null = null;
      let oldestReset = Infinity;
      for (const [k, b] of buckets) {
        if (b.resetAt < oldestReset) {
          oldestReset = b.resetAt;
          oldest = k;
        }
      }
      if (oldest) buckets.delete(oldest);
    }
    buckets.set(key, bucket);
  }
  bucket.count += 1;
  const remaining = Math.max(0, max - bucket.count);
  const retryAfterSec = Math.max(1, Math.ceil((bucket.resetAt - now) / 1000));
  if (bucket.count > max) {
    return { ok: false, remaining: 0, retryAfterSec };
  }
  return { ok: true, remaining, retryAfterSec };
}

/** Best-effort client IP from request headers (works behind Vercel/Cloudflare). */
export function getClientIp(xff: string | null, xRealIp: string | null): string {
  if (xff) return xff.split(",")[0].trim().slice(0, 64) || "unknown";
  if (xRealIp) return xRealIp.trim().slice(0, 64) || "unknown";
  return "unknown";
}

/**
 * Origin/Referer check to mitigate cross-site request forgery for
 * state-changing endpoints. Rejects requests from foreign origins.
 */
export function isSameOrigin(origin: string | null, referer: string | null, expectedHost: string): boolean {
  const candidate = origin ?? referer;
  if (!candidate) return false; // no origin → reject (API keys/scripts send no origin)
  try {
    const url = new URL(candidate);
    return url.host === expectedHost;
  } catch {
    return false;
  }
}

/** Optional Cloudflare Turnstile verification (server-side). */
export async function verifyTurnstile(token: string, secret: string): Promise<boolean> {
  if (!token || !secret) return false;
  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: token }),
    });
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch {
    return false;
  }
}

/**
 * Build a professional auto-reply confirmation email sent to the visitor.
 */
export function buildAutoReplyBody(name: string): string {
  return (
    `Hi ${name},\n\n` +
    `Thank you for reaching out through KAPIL OS! I've received your message and will get back to you as soon as possible — usually within 24–48 hours.\n\n` +
    `In the meantime, feel free to explore my portfolio or connect with me on GitHub / LinkedIn.\n\n` +
    `Best regards,\n` +
    `Kapil Kumar\n` +
    `AI/ML & Software Developer`
  );
}

/** Send a message via Resend REST API. Returns true on 2xx. */
export async function sendViaResend(
  apiKey: string,
  from: string,
  to: string,
  subject: string,
  text: string,
  attachments?: { filename: string; content: string }[] // base64 content
): Promise<boolean> {
  try {
    const payload: Record<string, unknown> = { from, to, subject, text };
    if (attachments && attachments.length > 0) {
      payload.attachments = attachments;
    }
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    return res.ok;
  } catch {
    return false;
  }
}

/**
 * Build a minimal plain-text email body. Plain text (never HTML) avoids
 * HTML injection in email clients. No secrets are logged.
 */
export function buildMessageBody(name: string, email: string, message: string): string {
  return `New message via KAPIL OS contact form.\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}\n`;
}
