# KAPIL OS — Security Audit Report

**Date:** 2026-08-14
**Status:** Hardened. One build-time note + two action items below.

---

## ✅ PASS — Verified protections

### 1. Security headers (all present on `/` and API routes)
| Header | Value | Status |
|---|---|---|
| `Content-Security-Policy` | see below | ✅ |
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` | ✅ |
| `X-Content-Type-Options` | `nosniff` | ✅ |
| `X-Frame-Options` | `SAMEORIGIN` | ✅ |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | ✅ |
| `Permissions-Policy` | camera/mic/geo/payment/usb off, `interest-cohort=()` | ✅ |
| `Cross-Origin-Opener-Policy` | `same-origin` | ✅ |
| `Cross-Origin-Resource-Policy` | `same-origin` | ✅ |

### 2. Content Security Policy (CSP)
```
default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'self';
form-action 'self'; frame-src 'self' https://challenges.cloudflare.com;
img-src 'self' data: blob:; font-src 'self' data:; media-src 'self';
worker-src 'self' blob:; manifest-src 'self';
connect-src 'self' https://api.github.com https://challenges.cloudflare.com;
script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com;
style-src 'self' 'unsafe-inline'; upgrade-insecure-requests
```
- **No `unsafe-eval`** (verified served header — the only mention is in a code comment).
- `object-src 'none'` blocks plugin/embed attacks.
- `frame-ancestors 'self'` + `X-Frame-Options` block clickjacking.
- Only two external hosts allowed (GitHub API, Cloudflare Turnstile). Everything else `'self'`.
- `unsafe-inline` for script/style is required by Next.js App Router + Framer Motion; it does **not** weaken the eval/object/connect protections.

### 3. XSS / injection
- No `dangerouslySetInnerHTML` anywhere. ✅
- No `eval()` / `new Function`. ✅
- All user/API text rendered via React (escaped by default). ✅
- `/api/chat` script-injection test → treated as plain text, not executed. ✅

### 4. API input validation + abuse protection (all verified live)
| Test | Result |
|---|---|
| Invalid email on contact | 422 |
| Honeypot filled (bot) | 400 |
| Cross-origin POST (CSRF) | 403 |
| Oversized body | 413 |
| Contact rate limit (5/10min) | 429 |
| Chat rate limit (40/min) | 429 |
| Empty chat message | 422 |
| Error bodies | clean — no stack traces / keys / paths |

### 5. Secrets handling
- No real API keys in any source file (`src/`). ✅
- `.env.local` git-ignored. ✅
- `.env.example` contains placeholders only, no real secrets. ✅
- No Supabase / service-role remnants. ✅
- Admin routes fully removed (404). ✅

### 6. Dependency audit
- **`uuid` (moderate, via `@react-three/drei`)** → **FIXED** via `overrides: { "uuid": "^11.1.1" }`. Build verified.
- Remaining **2 high** are the **PostCSS** advisory bundled **inside Next.js**. These are **build-time only** (never served to visitors — PostCSS processes CSS at build). Fixing requires upgrading to Next 16, a **breaking** major change. Recommended: leave as-is for now; revisit only if you upgrade Next anyway.

---

## ⚠️ ACTION ITEMS (for you)

### 1. ROTATE the Resend API key (recommended, important)
The key `re_YDaxdh…` was **pasted in this chat transcript**. It is only in `.env.local` (not committed), but anyone with the transcript has it. **Per standard practice, treat it as exposed and rotate it:**
1. Resend → **API Keys** → revoke the current key
2. Create a new one
3. Update `.env.local` (and your deploy platform's env store)

### 2. Contact form delivery (functional, not security)
`CONTACT_TO_EMAIL` is `kapilkumar.ai.dev@gmail.com`, but Resend **test mode only delivers to the account owner's email** (previously `sniperlordhumai@gmail.com`). So valid submissions currently fail to deliver (the endpoint returns a clean error, no data leak). To fix:
- Verify a domain in Resend (free, 3 DNS records), **or**
- Set `CONTACT_TO_EMAIL` back to the account-owner email, **or**
- Confirm the new Gmail is set as the Resend account email.

---

## ✅ Recommendations satisfied
- Static, mostly-static public portfolio (no expensive per-request ops)
- All sensitive operations server-side
- Rate limiting, validation, honeypot, origin check on all endpoints
- Secure headers + CSP everywhere (pages and API)
- Generic production error messages (no leaks)
- No fake "disable right-click / block F12" tricks
- No analytics / visitor-data collection
