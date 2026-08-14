import { NextRequest, NextResponse } from "next/server";
import { rateLimit, getClientIp, sanitizeText } from "@/lib/security";
import { generateAnswer } from "@/lib/knowledge";

export const dynamic = "force-dynamic";

const MAX_QUERY_LEN = 500;
const MAX_PER_WINDOW = 40; // assistant messages per IP per minute

export async function POST(request: NextRequest) {
  // --- Rate limit ---------------------------------------------------
  const ip = getClientIp(request.headers.get("x-forwarded-for"), request.headers.get("x-real-ip"));
  const limit = rateLimit(`chat:${ip}`, { windowMs: 60_000, max: MAX_PER_WINDOW });
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Too many messages. Please slow down and try again in a moment." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSec) } }
    );
  }

  // --- Parse + sanitize body ----------------------------------------
  let body: { message?: unknown };
  try {
    body = (await request.json()) as { message?: unknown };
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const raw = typeof body.message === "string" ? body.message : "";
  const message = sanitizeText(raw, MAX_QUERY_LEN);
  if (!message) {
    return NextResponse.json({ error: "Please type a message." }, { status: 422 });
  }

  // --- Generate answer (pure retrieval over real data) ---------------
  const result = generateAnswer(message);
  return NextResponse.json({
    reply: result.reply,
    nav: result.nav ?? null,
    suggestions: result.suggestions ?? [],
  });
}
