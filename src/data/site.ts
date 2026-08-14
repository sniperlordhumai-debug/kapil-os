// =============================================================
// SITE.CONFIG — global identity and contact information
// Central place to update identity, socials and links.
// All content in /data lives separate from UI components.
// =============================================================

export const site = {
  name: "Kapil Kumar",
  firstName: "Kapil",
  role: "AI/ML & Software Developer",
  tagline: "BUILDING INTELLIGENT SOFTWARE.",
  subhead: "AI/ML Student • Software Developer • Builder",
  shortBio:
    "I build practical AI, software and web projects while continuously exploring new technologies.",
  location: "Vadodara, India",
  university: "Parul University",
  course: "B.Tech CSE (Artificial Intelligence & Machine Learning)",
  status: "BUILDING",
  focus: "AI + Software",
  email: "kapilkumar.ai.dev@gmail.com",
  phone: "+91 6350050794",
  github: "https://github.com/sniperlordhumai-debug",
  githubHandle: "sniperlordhumai-debug",
  linkedin: "https://in.linkedin.com/in/kapil-kumar-931330375",
  resumePath: "/resume/Kapil_Kumar_Resume.pdf",
  portraitPath: "/images/portrait.jpg",
  copyrightYear: 2026,
} as const;

export const navItems = [
  { id: "home", label: "HOME" },
  { id: "about", label: "ABOUT" },
  { id: "skills", label: "SKILLS" },
  { id: "projects", label: "PROJECTS" },
  { id: "certificates", label: "CERTIFICATES" },
  { id: "journey", label: "JOURNEY" },
  { id: "github", label: "GITHUB" },
  { id: "contact", label: "CONTACT" },
] as const;
