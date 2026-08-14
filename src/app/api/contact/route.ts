import { NextRequest, NextResponse } from "next/server";
import {
  LIMITS,
  validateContact,
  rateLimit,
  getClientIp,
  isSameOrigin,
  verifyTurnstile,
  sendViaResend,
  buildMessageBody,
  buildAutoReplyBody,
} from "@/lib/security";
import { site } from "@/data/site";

export const dynamic = "force-dynamic";
export const runtime = "nodejs"; // fetch-based email + crypto; node runtime avoids edge limits

const MAX_PER_WINDOW = 5; // contact submissions per IP per 10 minutes

export async function POST(request: NextRequest) {
  // --- Origin check (CSRF mitigation) -------------------------------
  const host = request.headers.get("host") || "";
  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");
  if (!isSameOrigin(origin, referer, host)) {
    return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  }

  // --- Rate limiting ------------------------------------------------
  const ip = getClientIp(request.headers.get("x-forwarded-for"), request.headers.get("x-real-ip"));
  const limit = rateLimit(`contact:${ip}`, { windowMs: 10 * 60_000, max: MAX_PER_WINDOW });
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Too many messages. Please try again later." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSec) } }
    );
  }

  // --- Request size limit (raised to allow an audio voice message) ---
  const contentLength = Number(request.headers.get("content-length") || 0);
  const MAX_BODY = 7 * 1024 * 1024; // 7 MB — covers base64 of a ~60s voice note
  if (contentLength > MAX_BODY) {
    return NextResponse.json({ error: "Request too large." }, { status: 413 });
  }

  // --- Parse + validate body ----------------------------------------
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const validated = validateContact({
    name: body.name,
    email: body.email,
    message: body.message,
    honeypot: body.website, // invisible field — bots fill it, humans don't
  });
  if (!validated.ok) {
    return NextResponse.json({ error: validated.error }, { status: validated.status });
  }

  // --- Optional Cloudflare Turnstile ---------------------------------
  const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;
  if (turnstileSecret) {
    const token = typeof body.turnstileToken === "string" ? body.turnstileToken : "";
    const pass = await verifyTurnstile(token, turnstileSecret);
    if (!pass) {
      return NextResponse.json({ error: "Bot check failed. Please retry." }, { status: 403 });
    }
  }

  // --- Optional voice attachment (base64) -----------------------------
  let attachment: { filename: string; content: string } | null = null;
  if (body.audioData) {
    const audioData = typeof body.audioData === "string" ? body.audioData : "";
    const audioName = typeof body.audioName === "string" ? body.audioName : "voice-note.webm";
    if (audioData) {
      // validate it's base64-ish and cap decoded size
      const approxBytes = Math.floor((audioData.length * 3) / 4);
      if (approxBytes > 5 * 1024 * 1024) {
        return NextResponse.json({ error: "Voice message is too large." }, { status: 413 });
      }
      // safe filename
      const cleanName = audioName.replace(/[^a-zA-Z0-9._-]/g, "").slice(0, 60) || "voice-note.webm";
      attachment = { filename: cleanName, content: audioData };
    }
  }

  // --- Deliver (server-side, no client exposure) ----------------------
  const resendKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL;
  const to = process.env.CONTACT_TO_EMAIL || site.email;

  if (resendKey && from) {
    // 1. Deliver the visitor's message + optional voice note to Kapil.
    let text = buildMessageBody(validated.name, validated.email, validated.message);
    if (attachment) text += `\n\n[Voice message attached: ${attachment.filename}]`;
    const sent = await sendViaResend(
      resendKey,
      from,
      to,
      `Portfolio message from ${validated.name}`,
      text,
      attachment ? [attachment] : undefined
    );

    // 2. Send the visitor an automatic confirmation reply.
    const autoReplied = await sendViaResend(
      resendKey,
      from,
      validated.email,
      "Thanks for reaching out — Kapil OS",
      buildAutoReplyBody(validated.name)
    );

    if (sent) {
      return NextResponse.json({ ok: true, message: "Message sent. Thank you!" });
    }
    return NextResponse.json({ error: "Could not deliver the message right now." }, { status: 502 });
  }

  // Email delivery not configured: respond clearly (never fake success).
  return NextResponse.json(
    { error: "Contact delivery is not configured yet. Please email me directly." },
    { status: 503 }
  );
}
