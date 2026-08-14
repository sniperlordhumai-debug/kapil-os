import { NextRequest, NextResponse } from "next/server";
import { rateLimit, getClientIp } from "@/lib/security";
import { fetchUserRepos } from "@/lib/github";
import { site } from "@/data/site";

// Public repos data — safe to cache on the CDN for a short window.
export const dynamic = "force-dynamic";

const MAX_PER_WINDOW = 30; // requests per IP per minute

export async function GET(request: NextRequest) {
  const ip = getClientIp(request.headers.get("x-forwarded-for"), request.headers.get("x-real-ip"));
  const limit = rateLimit(`github:${ip}`, { windowMs: 60_000, max: MAX_PER_WINDOW });

  if (!limit.ok) {
    return NextResponse.json(
      { error: "Too many requests. Please try again shortly." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSec) } }
    );
  }

  try {
    const { repos, cached, upstreamStatus } = await fetchUserRepos(site.githubHandle);

    if (upstreamStatus !== 200) {
      return NextResponse.json(
        { error: "Unable to reach GitHub right now." },
        { status: 502 }
      );
    }

    return NextResponse.json(
      { repos, source: cached ? "cache" : "live" },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=300",
          "X-Cached": cached ? "hit" : "miss",
        },
      }
    );
  } catch {
    // Clean generic error; no stack traces, paths or config leaked.
    return NextResponse.json({ error: "Unable to load repository data." }, { status: 500 });
  }
}
