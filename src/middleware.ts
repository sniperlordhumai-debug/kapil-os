import { NextRequest, NextResponse } from "next/server";

// =============================================================
// SECURITY HEADERS — applied to every page & API response.
// CSP rationale: Next.js App Router emits nonce-less inline
// bootstrap scripts (RSC payload) that change each build, and
// Framer Motion sets inline style attributes at runtime. Both
// require 'unsafe-inline' for script/style; we keep 'unsafe-eval'
// OFF and lock down every other directive. See SECURITY.md.
// =============================================================

const CSP = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'self'",
  "form-action 'self'",
  "frame-src 'self' https://challenges.cloudflare.com",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "media-src 'self'",
  "worker-src 'self' blob:",
  "manifest-src 'self'",
  "connect-src 'self' https://api.github.com https://challenges.cloudflare.com",
  "script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com",
  "style-src 'self' 'unsafe-inline'",
  "upgrade-insecure-requests",
].join("; ");

const SECURITY_HEADERS: Record<string, string> = {
  "Content-Security-Policy": CSP,
  "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "SAMEORIGIN",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy":
    "camera=(self), microphone=(self), geolocation=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=(), interest-cohort=()",
  "Cross-Origin-Opener-Policy": "same-origin",
  "Cross-Origin-Resource-Policy": "same-origin",
  "X-DNS-Prefetch-Control": "on",
};

// Run on all routes except static asset files (images, fonts, pdf) to
// keep edge overhead minimal.
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico|pdf|woff2?|ttf|otf|json)$).*)",
  ],
};

/**
 * Paths that should never be served — dotfiles, env/config files,
 * source files, build internals, VCS metadata, and common web-server
 * configs. Requests to these return 404 so we don't reveal existence.
 */
const BLOCKED = /(^|\/)(\.env.*|\.git.*|\.gitignore|\.htaccess|\.DS_Store|package\.json|package-lock\.json|yarn\.lock|next\.config\..*|tsconfig\.json|tailwind\.config\.ts|postcss\.config\.mjs|src\/.*|\.next\/.*|node_modules\/.*|\.map$|\.log$|\.sql$|\.pem$|\.key$|\.p12$|README\.md|SECURITY\.md|DEPLOY.*\.md|supabase\/.*)(\?.*)?$/i;

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // --- Block sensitive / dotfile / internal-file access -------------
  if (BLOCKED.test(pathname)) {
    return new NextResponse("Not Found", {
      status: 404,
      headers: {
        "Content-Type": "text/plain",
        "X-Content-Type-Options": "nosniff",
      },
    });
  }

  const response = NextResponse.next();
  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    response.headers.set(key, value);
  }
  return response;
}
