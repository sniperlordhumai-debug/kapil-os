# 🚀 KAPIL OS — Complete Deployment Guide (From Scratch)

Everything you need to put your portfolio live on the internet with your own domain.
Works on **Windows (PowerShell)** or **macOS/Linux**.

> **What you're deploying:** a single Next.js app. It contains the **frontend** (all pages)
> AND the **backend** (3 serverless API routes: `/api/contact`, `/api/chat`, `/api/github`)
> plus email via **Resend**. Host it on **Vercel** — it handles frontend + API + HTTPS + domain.

---

## STEP 0 — Prerequisites

- [ ] A **GitHub** account (free) — github.com
- [ ] A **Vercel** account (free) — vercel.com (sign in with GitHub)
- [ ] (Optional but recommended) Your own **domain** name
- [ ] Your project folder with the app code (the `app/` folder)

---

## STEP 1 — Create a GitHub repository

1. Go to **github.com** → sign in.
2. Click **+** (top-right) → **New repository**.
3. Name it: `kapil-os` → choose **Public** or **Private**.
4. Click **Create repository** (do NOT tick "add README" — we have our own).

---

## STEP 2 — Push your code to GitHub

Open **PowerShell** (Windows) or **Terminal** (Mac/Linux) in your project folder (`...\app`).

```powershell
# 1. Make sure you're in the project folder (where package.json is)
cd D:\workspace-01a000f9-7adf-7f7e-b919-63fac8a1683a\app

# 2. Init git
git init

# 3. Add & commit all files
git add -A
git commit -m "KAPIL OS portfolio"

# 4. Set the branch name to main
git branch -M main

# 5. Link to your GitHub repo (use YOUR GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/kapil-os.git

# 6. Push (GitHub will ask you to log in)
git push -u origin main
```

✅ After this, your code is on GitHub. `.env.local`, `node_modules`, `/.next` are **not** pushed
(the `.gitignore` already excludes them → **your API key never reaches GitHub**).

---

## STEP 3 — Deploy to Vercel

1. Go to **vercel.com** → sign in with **GitHub**.
2. Click **Add New… → Project**.
3. Vercel shows your GitHub repos → select **kapil-os** → **Import**.
4. Vercel **auto-detects Next.js** — leave the defaults:
   - Framework Preset: **Next.js**
   - Build Command: `next build`
   - Output: `next start`
5. Click **Deploy**.
6. Wait ~1 minute. You'll get a URL like **`https://kapil-os-xxxx.vercel.app`**.

✅ Your site is now LIVE on the internet. All 3 API routes and the contact form work.

---

## STEP 4 — Add environment variables (backend secrets)

In Vercel → your project → **Settings → Environment Variables**, add these and click Save:

| Name | Value | Purpose |
|---|---|---|
| `RESEND_API_KEY` | `re_...` (your Resend key) | Send contact emails |
| `CONTACT_FROM_EMAIL` | `Kapil OS <onboarding@resend.dev>` | Email sender |
| `CONTACT_TO_EMAIL` | `kapilkumar.ai.dev@gmail.com` | Where messages arrive |
| `GITHUB_TOKEN` | *(optional)* `ghp_...` | Avoid GitHub rate limits |
| `TURNSTILE_SECRET_KEY` | *(optional)* | Bot protection |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | *(optional)* | Bot protection (public) |

Then trigger a redeploy: **Deployments** tab → ⋯ → **Redeploy**.

---

## STEP 5 — Connect your custom domain (optional but recommended)

1. In Vercel → project → **Settings → Domains**.
2. Type your domain (e.g. `kapil.io` or `www.kapil.io`) → **Add**.
3. Vercel shows DNS records. Go to your **domain registrar's DNS settings** and add:
   - **A record:** `76.76.21.21`
   - **CNAME:** `cname.vercel-dns.com` (for `www`)
4. Wait for propagation (minutes to ~1 hour).
5. Vercel automatically provisions **free SSL/HTTPS**.
6. Set the domain as **primary** so `www` redirects to the apex (or vice versa).

---

## STEP 6 — Update the canonical URL (important)

The site's SEO metadata points to a placeholder. After you know your real URL:

1. Edit **`src/app/layout.tsx`**
2. Change: `const url = "https://kapil-os.vercel.app"`
3. To your real domain, e.g. `const url = "https://kapil.io"`
4. Commit & push → Vercel auto-redeploys.

---

## STEP 7 — Test everything on the live site

- **Open your URL** → boot screen plays ~2.6s → portfolio loads (auto-dismiss guaranteed).
- **Contact form** → fill it → message emails to `CONTACT_TO_EMAIL`.
- **AI assistant** (`/api/chat`) → works out of the box.
- **GitHub build activity** (`/api/github`) → works out of the box.

---

## ⚠️ CRITICAL SECURITY — before/after going live

1. **Rotate your Resend API key.** You shared it in this chat. In Resend → API Keys → revoke it, create a new one, and put the **new** value in Vercel. Never commit it.
2. **Resend test-mode limit:** Resend's free **test mode only delivers to your account-owner email**. To actually receive messages at `kapilkumar.ai.dev@gmail.com`, verify a domain in Resend (Settings → Domains → Add Domain → add the 3 DNS records), then update `CONTACT_FROM_EMAIL` to that domain.
3. **Never put secrets in code.** Keep `RESEND_API_KEY`, `GITHUB_TOKEN`, etc. only in Vercel's env store.

---

## Updating the site later

Any time you change the code:

```powershell
git add -A
git commit -m "describe your change"
git push
```

Vercel auto-redeploys. That's it — no manual steps.

---

## Quick reference (commands)

```powershell
# Local dev
npm install
npm run dev        # http://localhost:3000

# Production build locally
npm run build
npm start

# Deploy (after the one-time GitHub setup above)
git add -A && git commit -m "update" && git push
```
