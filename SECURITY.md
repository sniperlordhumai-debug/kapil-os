# KAPIL OS — Security

The portfolio is a public, mostly-static site. All sensitive operations run **server-side**.
This document explains each control, the intentional trade-offs, and the pre-deployment checklist.

---

## 1. Security headers

Applied to **every** page and API response by `src/middleware.ts` (with the same set mirrored in
`vercel.json` so edge/CDN responses are covered too):

| Header | Value | Why |
|---|---|---|
| `Content-Security-Policy` | see below | XSS / injection containment, clickjacking |
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` | Force HTTPS |
| `X-Content-Type-Options` | `nosniff` | Stop MIME-sniffing |
| `X-Frame-Options` | `SAMEORIGIN` | Clickjacking (defense-in-depth with `frame-ancestors`) |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Limit referrer leakage |
| `Permissions-Policy` | camera/mic/geolocation/payment/usb off, `interest-cohort=()` | Restrict browser features |
| `Cross-Origin-Opener-Policy` | `same-origin` | Isolate from untrusted contexts |
| `Cross-Origin-Resource-Policy` | `same-origin` | Prevent cross-origin reads |

### CSP (intentional trade-offs)
```
default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'self';
form-action 'self'; frame-src 'self' https://challenges.cloudflare.com;
img-src 'self' data: blob:; font-src 'self' data:; media-src 'self';
worker-src 'self' blob:; manifest-src 'self';
connect-src 'self' https://api.github.com https://challenges.cloudflare.com;
script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com;
style-src 'self' 'unsafe-inline'; upgrade-insecure-requests
```

- **`unsafe-eval` is never used.** No dependency requires it.
- **`script-src 'unsafe-inline'`** is required because Next.js App Router emits nonce-less inline
  bootstrap scripts (the RSC payload) that change on every build and cannot be pre-hashed. This is
  the standard, documented trade-off for Next.js static sites; it does **not** weaken the
  protections that matter most (no eval, locked `connect-src`, `object-src 'none'`, `frame-ancestors`).
- **`style-src 'unsafe-inline'`** is required by Framer Motion, which writes inline style attributes
  (transform/opacity) at runtime. Style `unsafe-inline` is far lower risk than script.
- The only external hosts allowed are `api.github.com` (public repo data) and
  `challenges.cloudflare.com` (only used if you enable Turnstile). Everything else is `'self'`.
- If you want a fully nonce-based script CSP, you must adopt a nonce-injection pipeline (e.g. the
  `next-safe` package or a custom Babel/SWC pass) — this is not something Next.js provides out of
  the box. The current policy is a sound baseline for a public portfolio.

## 2. XSS protection
- No `dangerouslySetInnerHTML` is used anywhere.
- React escapes all text by default; GitHub repo names/descriptions and contact data are rendered
  as escaped text, never injected HTML.
- External GitHub data is **normalized/shaped server-side** (`src/lib/github.ts`) and length-capped
  before being returned.

## 3. Input validation (client **and** server)
- Contact form validates on the client (`ContactForm.tsx`) **and** again on the server
  (`src/lib/security.ts` → `validateContact`): name 2–80, email format + ≤254, message 10–2000,
  control-character stripping, whitespace collapsing.
- Server never trusts client checks.

## 4. Contact form protection (`/api/contact`)
- **Rate limiting:** 5 submissions / IP / 10 min → `429 Too Many Requests` with `Retry-After`.
- **Honeypot:** invisible `website` field — empty for humans, filled by bots → rejected.
- **Origin check:** `Origin`/`Referer` must match the request host → blocks cross-site posts (CSRF).
- **Request size limit:** body capped at 16 KB → `413`.
- **Turnstile (optional):** server-side `siteverify` when `TURNSTILE_SECRET_KEY` is set.
- **Delivery:** Resend REST API called **server-side** only. No email/API credentials ever touch the
  frontend. If not configured, returns a clear `503` — never a fake success.

## 5. API security (`/api/github`)
- Browser calls our **server-side proxy** (`/api/github`), never `api.github.com` directly.
- Optional `GITHUB_TOKEN` is read from `process.env` **server-side only** — never a `NEXT_PUBLIC_*`.
- Responses are **cached** (5 min in-memory + `Cache-Control: s-maxage=300`) to avoid hammering
  upstream and to keep the endpoint fast.
- Endpoint is **rate-limited** (30 / IP / min → `429`).
- Upstream failures return a clean generic error; no tokens, bodies or headers are leaked.

## 6–8. Rate limiting / bot / DoS
- In-memory sliding-window limiter in `src/lib/security.ts`. It is per-process — adequate for a
  single deployment and used here as a practical baseline. For strict distributed limiting behind
  multiple serverless instances, swap it for an external store (Upstash / Vercel KV) keyed by IP.
- The public site is **static**, served from a **CDN** (Vercel), with optimized/lazy assets and no
  expensive per-request operations. Deploy behind Cloudflare/Vercel edge protection; do **not**
  build a custom DDoS system.

## 9. File handling
- There is **no upload surface** today. If an admin upload is added later it must validate MIME,
  extension, size and filename, generate safe random filenames, store uploads outside the code
  tree, and never execute them. (Noted here as a hard requirement for future work.)

## 10–12. Admin / auth / CSRF
- There is **no admin panel**. Any future admin must use real authentication with HttpOnly/Secure/
  SameSite cookies, server-side authorization on every mutation, CSRF tokens, and hashed passwords.
  Never gate admin on `?admin=true`, URL flags, or `localStorage` roles.
- Contact submission already uses an origin check as CSRF mitigation.

## 13. Clickjacking
- `X-Frame-Options: SAMEORIGIN` + CSP `frame-ancestors 'self'` prevent embedding the site in a
  cross-origin frame.

## 14. Dependency security
- Minimal, well-maintained dependencies (Next, React, Tailwind, Framer Motion, Lucide). No libraries
  added purely for visuals. Run `npm audit` before release (see checklist). The only reported
  advisories are a dev-time PostCSS issue bundled inside Next.js; it is not exposed to visitors and
  is fixed only by a breaking major upgrade.

## 15. Secret management
- `.env.example` documents variables; `.env`, `.env.local` etc. are git-ignored. Secrets are set in
  the platform's encrypted environment store. If a secret is ever committed, **rotate it**.

## 16. Source-code protection
- No fake "disable right-click / block F12" tricks — they give no real security and hurt UX.
  Secrets are protected on the server; the client bundle is public by design.

## 17. Error handling
- All API routes return generic, user-safe messages (no stack traces, paths, env, or config).
- Detailed errors are logged server-side only (see logging).

## 18. Logging & monitoring
- The rate limiter tracks violations in-memory. Contact route rejects spam/bots before delivery.
- Never log passwords, API keys, tokens, or unnecessary personal data.

## 19. Privacy
- No analytics trackers. No visitor data is collected or stored. If analytics are added later,
  they must be privacy-conscious, documented, and consent-compliant where required.

## 20. Supply-chain safety
- No random CDN scripts. The only optional external script is Cloudflare Turnstile (pinned to the
  official host). Google fonts are self-hosted at build time via `next/font` (no external fetch).
- Versions are constrained in `package.json`.

## 21. Secure deployment (Vercel)
- HTTPS forced (Vercel TLS + HSTS). Secrets via encrypted env store. CDN/edge with headers from
  `vercel.json`. Only `/api/contact` and `/api/github` are exposed; everything else is static.

---

## Security checklist — run before release

- [x] HTTPS forced (HSTS preload)
- [x] Security headers applied (CSP, nosniff, referrer, permissions, frame-ancestors)
- [x] CSP present, `unsafe-eval` absent, `unsafe-inline` limited & documented
- [x] XSS: no `dangerouslySetInnerHTML`, escaping by default
- [x] Input validation on client **and** server
- [x] Contact rate limiting → 429
- [x] Contact honeypot + origin check + size limit + optional Turnstile
- [x] GitHub proxied server-side, cached, rate-limited, token not exposed
- [x] Clickjacking protection (X-Frame-Options + frame-ancestors)
- [x] Generic production error messages (no leaks)
- [x] Dependencies minimal; `npm audit` reviewed
- [x] Secrets in `.env` only, git-ignored, never `NEXT_PUBLIC_`
- [x] `.env.example` committed; no `.env`/`.env.local` committed
- [x] No fake client-side "protection" tricks
- [x] No unnecessary analytics / data collection
- [ ] Deploy, then verify headers live with `curl -I https://<your-domain>` and run a CSP-report /
      browser security review against the real domain
- [ ] If you add Turnstile / email delivery, set the secret env vars in the platform
- [ ] Update canonical `NEXT_PUBLIC_SITE_URL` to the real domain
