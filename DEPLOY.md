# KAPIL OS — Deployment Guide (Vercel + Custom Domain)

## Architecture (what you're deploying)
- **Frontend:** Next.js 14 (all pages of the KAPIL OS portfolio)
- **Backend:** 3 serverless API routes inside the same app — `/api/contact`, `/api/chat`, `/api/github` — plus **email via Resend**
- **Database:** none (content is in code/data files)
- Because it's a single Next.js app, **you deploy once** — frontend + API together on **Vercel**.

---

## Part A — Push to GitHub
1. github.com → **New repository** → `kapil-os` → Create.
2. From the project folder:
```bash
cd /home/user/app
git init
git add -A
git commit -m "KAPIL OS portfolio"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/kapil-os.git
git push -u origin main
```
> `.env.local`, `node_modules`, `/.next` are git-ignored → your secrets never get pushed.

## Part B — Deploy on Vercel
1. vercel.com → sign in with GitHub → **Add New → Project**.
2. Import `kapil-os` → Vercel auto-detects Next.js → **Deploy**.
3. Get a live URL like `https://kapil-os-xxxx.vercel.app`.

## Part C — Environment variables (the backend secrets)
Vercel → project → **Settings → Environment Variables**:

| Name | Value |
|---|---|
| `RESEND_API_KEY` | `re_...` |
| `CONTACT_FROM_EMAIL` | `Kapil OS <onboarding@resend.dev>` |
| `CONTACT_TO_EMAIL` | `kapilkumar.ai.dev@gmail.com` |
| `GITHUB_TOKEN` | optional `ghp_...` |
| `TURNSTILE_SECRET_KEY` | optional |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | optional |

Then **Redeploy**.

## Part D — Connect a custom domain
1. Vercel → project → **Settings → Domains** → add your domain.
2. At your registrar's DNS, add:
   - **A** → `76.76.21.21`
   - **CNAME** → `cname.vercel-dns.com` (for `www`)
3. Wait for propagation; Vercel provisions **free HTTPS**.

## Part E — Update the canonical URL
- `src/app/layout.tsx`: change `const url = "https://kapil-os.vercel.app"` to your real domain.
- Redeploy.

## Verify
- Contact form → emails `CONTACT_TO_EMAIL`
- AI assistant (`/api/chat`) and GitHub (`/api/github`) → work out of the box

## Security before going live
1. **Rotate the Resend API key** (it was shared in chat).
2. Keep real secrets only in Vercel; never commit `.env.local`.

## Resend test-mode note
Resend test mode delivers **only to the account-owner email**. To receive at `kapilkumar.ai.dev@gmail.com`, verify a domain in Resend and use it as `CONTACT_FROM_EMAIL`.
