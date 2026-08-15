import { NextRequest, NextResponse } from "next/server";
import {
  LIMITS,
  validateContact,
  rateLimit,
  getClientIp,
  isSameOrigin,
  verifyTurnstile,
  sendViaTelegram,
  sendVoiceViaTelegram,
  sendVideoViaTelegram,
  buildTelegramMessage,
} from "@/lib/security";

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

  // --- Request size limit (raised to allow voice/video messages) ---
  const contentLength = Number(request.headers.get("content-length") || 0);
  const MAX_BODY = 25 * 1024 * 1024; // 25 MB — covers a ~60s video note
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
  let voice: { filename: string; content: string } | null = null;
  if (body.audioData) {
    const audioData = typeof body.audioData === "string" ? body.audioData : "";
    if (audioData) {
      const approxBytes = Math.floor((audioData.length * 3) / 4);
      if (approxBytes > 5 * 1024 * 1024) {
        return NextResponse.json({ error: "Voice message is too large." }, { status: 413 });
      }
      const audioName = typeof body.audioName === "string" ? body.audioName : "voice-note.webm";
      const cleanName = audioName.replace(/[^a-zA-Z0-9._-]/g, "").slice(0, 60) || "voice-note.webm";
      voice = { filename: cleanName, content: audioData };
    }
  }

  // --- Optional video attachment (base64) -----------------------------
  let video: { filename: string; content: string } | null = null;
  if (body.videoData) {
    const videoData = typeof body.videoData === "string" ? body.videoData : "";
    if (videoData) {
      const approxBytes = Math.floor((videoData.length * 3) / 4);
      if (approxBytes > 20 * 1024 * 1024) {
        return NextResponse.json({ error: "Video message is too large." }, { status: 413 });
      }
      const videoName = typeof body.videoName === "string" ? body.videoName : "video-message.mp4";
      const cleanName = videoName.replace(/[^a-zA-Z0-9._-]/g, "").slice(0, 60) || "video-message.mp4";
      video = { filename: cleanName, content: videoData };
    }
  }

  // --- Deliver to Telegram (server-side, no client exposure) ---------
  const tgToken = process.env.TELEGRAM_BOT_TOKEN;
  const tgChat = process.env.TELEGRAM_CHAT_ID;

  if (tgToken && tgChat) {
    // 1. Send the voice note (if present).
    if (voice && voice.content.length > 0) {
      const caption = `Voice message from ${validated.name} (${validated.email})`;
      const sent = await sendVoiceViaTelegram(tgToken, tgChat, voice.content, caption);
      if (!sent) {
        return NextResponse.json({ error: "Could not deliver the voice message." }, { status: 502 });
      }
    }

    // 2. Send the video (if present).
    if (video && video.content.length > 0) {
      const caption = `Video message from ${validated.name} (${validated.email})`;
      const sent = await sendVideoViaTelegram(tgToken, tgChat, video.content, caption);
      if (!sent) {
        return NextResponse.json({ error: "Could not deliver the video message." }, { status: 502 });
      }
    }

    // 3. Send the text details (name, email, message).
    const text = buildTelegramMessage(
      validated.name,
      validated.email,
      validated.message,
      !!(voice && voice.content.length > 0),
      !!(video && video.content.length > 0)
    );
    const sent = await sendViaTelegram(tgToken, tgChat, text);
    if (sent) {
      return NextResponse.json({ ok: true, message: "Message sent. Thank you!" });
    }
    return NextResponse.json({ error: "Could not deliver the message right now." }, { status: 502 });
  }

  // Delivery not configured: respond clearly (never fake success).
  return NextResponse.json(
    { error: "Contact delivery is not configured yet. Please try emailing me directly." },
    { status: 503 }
  );
}
