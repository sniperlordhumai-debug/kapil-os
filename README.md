# KAPIL OS — Personal Portfolio

A premium, interactive digital-experience portfolio for **Kapil Kumar**, built as a personal
"operating system". Visitors explore modules of a professional identity instead of scrolling a
resume — futuristic but professional, recruiter-friendly, fast and accessible.

Built with **Next.js 14 (App Router) + React + TypeScript + Tailwind CSS + Framer Motion + Lucide**.

---

## Getting Started

```bash
npm install
npm run dev      # start dev server at http://localhost:3000
npm run build    # production build
npm start        # serve production build
```

> Requires Node 18.17+.

---

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout: fonts, SEO metadata, nav/footer/boot shell
│   ├── page.tsx            # Assembles all sections in order
│   ├── globals.css         # Design tokens, glass/grid utilities, reduced-motion
│   ├── icon.svg            # Favicon
│   └── robots.ts / sitemap.ts / manifest.ts
├── components/
│   ├── layout/
│   │   ├── BootScreen.tsx      # "INITIALIZING KAPIL OS..." (skippable, ≤2s)
│   │   ├── ClientShell.tsx     # mounts/removes BootScreen
│   │   ├── BackgroundFX.tsx    # cursor glow, fine grid, noise
│   │   ├── Navbar.tsx          # sticky nav, mobile menu, command-palette trigger
│   │   ├── CommandPalette.tsx  # Ctrl+K command palette (exported scrollToId)
│   │   ├── Footer.tsx
│   │   └── EasterEggs.tsx      # "sudo" + Konami easter eggs (subtle)
│   ├── sections/
│   │   ├── Hero.tsx            # headline + profile card + terminal status
│   │   ├── About.tsx           # bio + System Profile panel
│   │   ├── SkillVault.tsx      # interactive skill categories + detail panel
│   │   ├── ProjectLab.tsx      # project cards + case-study modal + diagrams
│   │   ├── CertificateVault.tsx# search/filter + card grid
│   │   ├── CertificateViewer.tsx# full-screen certificate viewer
│   │   ├── BuildActivity.tsx   # live GitHub API + static fallback
│   │   ├── Journey.tsx         # timeline
│   │   ├── Resume.tsx          # resume preview + download
│   │   ├── Contact.tsx
│   │   └── AiAssistant.tsx     # floating "ask me anything" chat widget
│   └── ui/                     # Reveal, Section, MagneticButton, StatusPill
├── lib/
│   ├── cn.ts                   # className helper
│   ├── security.ts             # validation, sanitization, rate limiting, turnstile, email
│   ├── knowledge.ts            # AI assistant retrieval engine (real data)
│   └── github.ts               # server-side GitHub fetch + cache
└── data/                       # ← ALL content lives here (edit, don't touch UI)
    ├── site.ts                 # name, email, phone, GitHub, LinkedIn, resume path
    ├── certificates.ts         # Certificate Vault entries
    ├── projects.ts             # Project Lab entries + case studies
    ├── skills.ts               # Skill Vault categories/skills
    ├── skills-export.ts        # flattened skill index for the assistant
    ├── timeline.ts             # Journey milestones
    └── github.ts               # static fallback repos + language colors
```

## How to Update Content

Everything is data-driven — **edit the files in `src/data/`, never the components**.

| To change…          | Edit…               | Notes |
|---------------------|---------------------|-------|
| Name, email, socials, resume path | `data/site.ts` | Single source of truth |
| A certificate       | `data/certificates.ts` | `id`, title, org, date, category, skills, `image`, `verificationUrl` |
| A project           | `data/projects.ts`  | leave `github`/`demo` as `""` to hide those buttons |
| Skills & their links | `data/skills.ts`    | `projects`/`certificates` reference ids in the other files |
| Timeline            | `data/timeline.ts`  | |
| GitHub fallback     | `data/github.ts`    | static repos used when the API is unreachable |

### Adding a certificate
1. Drop the certificate image into `public/certificates/`.
2. Add an entry to `data/certificates.ts` pointing `image` at it.
3. The Vault, filters and stats update automatically.

### Replacing the photo / resume
- Photo: replace `public/images/portrait.jpg`.
- Resume: replace `public/resume/Kapil_Kumar_Resume.pdf` (the "Download Resume" button points here).

## Feature Notes

- **AI assistant (ask me anything)**: a floating chat widget powered by `src/lib/knowledge.ts` —
  a no-key retrieval engine over Kapil's real data. It answers questions about his background,
  skills, projects, certificates, GitHub, resume and contact, with suggestions and "jump to
  section" links. It runs through `/api/chat` (server-side, rate-limited, sanitized). No LLM, no
  API key, no cost.
- **Contact form**: the form posts to `/api/contact`, which validates input, checks a honeypot,
  enforces an origin check, rate-limits per IP, and delivers via Resend (server-side only — no
  credentials in the browser). Set `RESEND_API_KEY`, `CONTACT_FROM_EMAIL` and `CONTACT_TO_EMAIL`
  in `.env.local` (dev) and in your platform's env store (prod). Until a domain is verified in
  Resend, delivery only works to the account owner's email (test mode).
- **Live GitHub data**: `BuildActivity` fetches public repos through the server-side proxy
  `/api/github` (cached + rate-limited) and falls back to `data/github.ts` if the API is unavailable.
  No private credentials are used.
- **Command palette**: press `Ctrl`/`Cmd` + `K` anywhere, or tap the `⌘K` button in the nav.
- **Easter eggs**: typing `sudo` shows a subtle, professional toast; the Konami code
  (↑↑↓↓←→←→BA) triggers another.
- **Accessibility**: semantic HTML, ARIA labels on interactive elements, visible focus states,
  and full `prefers-reduced-motion` support.
- **SEO**: title, description, canonical, Open Graph, Twitter cards, `robots.txt`, `sitemap.xml`,
  manifest and favicon are all configured. Update the canonical domain in `src/app/layout.tsx`
  before deploying.

## Honesty rule

All content is derived from Kapil's real resume, achievements PDF and provided files. Nothing is
fabricated: no fake metrics, fake links, fake employers or invented GitHub stats. Project
GitHub/demo buttons are hidden until real URLs are provided.

---
