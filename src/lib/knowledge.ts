// =============================================================
// KNOWLEDGE ENGINE — powers the "ask me anything" assistant.
// Pure data-driven retrieval over Kapil's REAL portfolio data.
// No LLM, no API key, no external calls. Works entirely server-side
// (and is safe to reason about). All facts come from src/data/*.
// =============================================================

import { site } from "@/data/site";
import { skills, skillsIndex } from "@/data/skills-export";
import { certificates } from "@/data/certificates";
import { projects } from "@/data/projects";
import { milestones } from "@/data/timeline";

export interface AssistantReply {
  reply: string;
  nav?: string;
  suggestions?: string[];
}

const STOPWORDS = new Set([
  "the", "and", "are", "for", "you", "your", "his", "her", "can", "could",
  "what", "who", "how", "why", "where", "when", "tell", "about", "with",
  "from", "that", "this", "have", "has", "did", "does", "do", "is", "am",
  "please", "would", "will", "want", "need", "know", "into", "them",
]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 1 && !STOPWORDS.has(w));
}

const QUERY = (q: string) => tokenize(q);

// ------------------------------------------------------------------
// Specific lookups (skill / project / certificate) — highest priority
// ------------------------------------------------------------------
function buildSkillReply(s: (typeof skillsIndex)[number]): AssistantReply {
  const relProjects = s.projects.map((id) => projects.find((p) => p.id === id)?.title).filter(Boolean);
  const relCerts = s.certificates
    .map((id) => certificates.find((c) => c.id === id))
    .filter(Boolean)
    .map((c) => `${c!.organization}: ${c!.title}`);
  let reply = `**${s.name}** — ${s.description}`;
  if (relProjects.length) reply += `\n\nUsed in: ${relProjects.join(", ")}.`;
  if (relCerts.length) reply += `\n\nProven by: ${relCerts.join("; ")}.`;
  reply += `\n\nIt sits in the **${s.category}** category of the Skill Vault.`;
  return { reply, nav: "skills" };
}

function skillMatch(query: string, tokens: string[]): AssistantReply | null {
  // 1. Exact word match — prefer the most specific skill name.
  let exact: (typeof skillsIndex)[number] | null = null;
  for (const s of skillsIndex) {
    const name = s.name.toLowerCase();
    if (new RegExp(`\\b${escapeRegExp(name)}\\b`).test(query) && (!exact || name.length > exact.name.length)) {
      exact = s;
    }
  }
  if (exact) return buildSkillReply(exact);
  // 2. Fallback: substring / token match.
  for (const s of skillsIndex) {
    const name = s.name.toLowerCase();
    if (query.includes(name) || tokens.includes(name)) {
      return buildSkillReply(s);
    }
  }
  return null;
}

function projectMatch(query: string, tokens: string[]): AssistantReply | null {
  for (const p of projects) {
    const title = p.title.toLowerCase();
    if (query.includes(title) || tokens.includes(title.split(" ")[0])) {
      let reply = `**${p.title}** (${p.status}) — ${p.description}`;
      reply += `\n\nCategory: ${p.category}.`;
      if (p.technologies.length) reply += `\nTechnologies: ${p.technologies.join(", ")}.`;
      reply += `\n\nYou can open its full case study (problem, idea, solution, architecture) in the Project Lab.`;
      return { reply, nav: "projects" };
    }
  }
  return null;
}

function certificateMatch(query: string): AssistantReply | null {
  const orgs = ["google", "meta", "microsoft", "nvidia", "aws", "forage", "simplilearn", "hp life", "tata", "deloitte", "accenture", "parul"];
  const ql = query.toLowerCase();
  const matchedOrg = orgs.find((o) => ql.includes(o));
  if (matchedOrg) {
    const found = certificates.filter((c) => c.organization.toLowerCase().includes(matchedOrg));
    if (found.length) {
      const lines = found.map((c) => `• ${c.title} (${c.category}, ${c.year})`);
      let reply = `Here are Kapil's certificates from **${found[0].organization}**:\n${lines.join("\n")}`;
      if (found[0].verificationUrl) reply += `\n\nVerification available for the top one.`;
      return { reply, nav: "certificates" };
    }
  }
  if (/\b(certif|cert|credential|course|coursework)\b/.test(ql)) {
    const count = certificates.length;
    const orgsList = Array.from(new Set(certificates.map((c) => c.organization))).join(", ");
    return {
      reply: `Kapil holds **${count} certifications/credentials** from organizations including ${orgsList}.\n\nHighlights: Google AI Fundamentals, Meta Front-End Development, NVIDIA Jetson Nano, AWS Generative AI, Forage job simulations (Software Engineering, Cyber, GenAI, Solutions Architecture, Data Analytics) and Hack2026 participation.\n\nBrowse all of them in the Certificate Vault.`,
      nav: "certificates",
      suggestions: ["What are his AI certificates?", "Show Cloud certifications", "Tell me about Hack2026"],
    };
  }
  return null;
}

// ------------------------------------------------------------------
// Intent detection
// ------------------------------------------------------------------
type Intent = { id: string; keys: string[]; nav?: string };

const INTENTS: Intent[] = [
  { id: "greeting", keys: ["hi", "hello", "hey", "yo", "namaste", "hola", "good morning", "good evening", "greetings", "hi there", "hello there"] },
  { id: "who", keys: ["who", "kapil", "introduce", "yourself", "you are", "background", "profile", "tell", "about kapil"] , nav: "about" },
  { id: "help", keys: ["help", "what can", "can you", "do for", "assist", "guide"] },
  { id: "education", keys: ["education", "college", "university", "degree", "btech", "b.tech", "study", "studying", "course", "cse", "parul", "school"], nav: "about" },
  { id: "cgpa", keys: ["cgpa", "gpa", "grade", "marks", "score", "academic"], nav: "about" },
  { id: "skills", keys: ["skills", "skill", "technolog", "know", "stack", "program", "language", "tools", "tech", "able to"], nav: "skills" },
  { id: "projects", keys: ["projects", "project", "built", "build", "product", "portfolio", "works", "things", "projects built"], nav: "projects" },
  { id: "certificates", keys: ["certificates", "certifications", "certification", "certs", "certif", "credential", "award", "badge", "accomplish", "certificate"], nav: "certificates" },
  { id: "experience", keys: ["experience", "journey", "timeline", "history", "milestone", "achievement", "hackathon", "hack", "activities"], nav: "journey" },
  { id: "github", keys: ["github", "code", "repo", "repos", "repository", "source", "open source", "contribut"], nav: "github" },
  { id: "resume", keys: ["resume", "cv", "download", "hire", "apply", "interview"], nav: "resume" },
  { id: "contact", keys: ["contact", "email", "reach", "message", "phone", "call", "talk", "connect", "touch", "linkedin", "get in touch", "contact him"], nav: "contact" },
  { id: "location", keys: ["location", "where", "city", "vadodara", "india", "live", "address", "based"] },
  { id: "thanks", keys: ["thank", "thanks", "thx", "appreciate"] },
  { id: "bye", keys: ["bye", "goodbye", "see you", "gtg"] },
];

function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Word-boundary match for single-word keys; substring/contains for phrases.
// Avoids false positives like "hi" matching inside "him"/"his".
function matchesKey(raw: string, key: string): boolean {
  if (/\s/.test(key)) return raw.includes(key);
  return new RegExp(`\\b${escapeRegExp(key)}\\b`).test(raw);
}

function detectIntent(tokens: string[], raw: string): Intent | null {
  let best: Intent | null = null;
  let bestScore = 0;
  for (const intent of INTENTS) {
    let score = 0;
    for (const key of intent.keys) {
      const kt = key.toLowerCase();
      if (matchesKey(raw, kt)) score += 2;
      else if (tokens.includes(kt.replace(/[^a-z0-9]/g, ""))) score += 1;
    }
    if (score > bestScore) {
      bestScore = score;
      best = intent;
    }
  }
  return bestScore > 0 ? best : null;
}

// ------------------------------------------------------------------
// Answer builders per intent (all real data)
// ------------------------------------------------------------------
function answerFor(intent: string, nav?: string): { reply: string; nav?: string; suggestions?: string[] } {
  switch (intent) {
    case "greeting":
      return {
        reply: `Hey! I'm the **KAPIL OS** assistant — a live window into Kapil Kumar's work. Ask me about his background, skills, projects, certifications, or how to reach him.`,
        suggestions: ["Who is Kapil?", "What skills does he have?", "Show his projects", "How can I contact him?"],
      };
    case "who":
      return {
        reply: `Kapil Kumar is an **AI/ML & Software Developer** — a B.Tech CSE (Artificial Intelligence & Machine Learning) student at **Parul University, Vadodara**.\n\nHe builds practical AI, software and web projects while exploring Generative AI, AI agents, automation and data analytics. His positioning: *"AI & ML learner building practical software, intelligent tools and experimental products."*\n\nHe's currently focused on **AI + Software** and is actively building in the Project Lab.`,
        nav: nav || "about",
        suggestions: ["What are his skills?", "What projects has he built?", "His certifications?", "How to contact?"],
      };
    case "help":
      return {
        reply: `I can tell you about:\n\n• **Who Kapil is** (education, focus, background)\n• **His skills** — try "What does he know about Python?"\n• **His projects** — Reels Hub, Nexus Mirror, Jarvis, FedHealthGuard\n• **His certifications** — Google, Meta, NVIDIA, AWS, Forage & more\n• **His GitHub, resume and contact details**\n\nJust ask in plain language, or jump to a section from the nav.`,
        suggestions: ["Show his projects", "AI & ML skills", "Contact details"],
      };
    case "education":
      return {
        reply: `Kapil is pursuing a **B.Tech in Computer Science & Engineering (Artificial Intelligence & Machine Learning)** at **Parul University, Vadodara**.\n\nHis academic focus is AI + Software, and he backs it up with hands-on certifications and industry job simulations rather than just coursework.`,
        nav: "about",
        suggestions: ["What certifications prove this?", "His skills?"],
      };
    case "cgpa":
      return {
        reply: `Kapil focuses on practical skills, certifications and real projects rather than grades. His B.Tech CSE (AI & ML) at Parul University is backed by hands-on work you can explore across this portfolio.`,
        nav: "about",
        suggestions: ["What has he built?", "His certifications"],
      };
    case "skills": {
      const cats = skills.map((c) => `**${c.label}**: ${c.skills.map((s) => s.name).join(", ")}`);
      return {
        reply: `Kapil's **Skill Vault** is organized into categories:\n\n${cats.join("\n")}\n\nAsk me about any specific skill — for example "what about Python?" — and I'll tell you what he's built with it and which certificate proves it.`,
        nav: "skills",
        suggestions: ["Python", "Generative AI", "AWS", "Front-End"],
      };
    }
    case "projects": {
      const list = projects.map((p) => `• **${p.title}** (${p.status}) — ${p.oneLiner}`).join("\n");
      return {
        reply: `Kapil is building these in the **Project Lab**:\n\n${list}\n\nThey're experimental concepts treated like products. Ask me about any one for details.`,
        nav: "projects",
        suggestions: ["Tell me about Reels Hub", "What is FedHealthGuard?", "Nexus Mirror"],
      };
    }
    case "certificates": {
      const orgsList = Array.from(new Set(certificates.map((c) => c.organization))).join(", ");
      return {
        reply: `Kapil holds **${certificates.length} certifications & credentials** from ${orgsList}.\n\nHighlights:\n• **Google** — AI Fundamentals\n• **Meta** — Introduction to Front-End Development\n• **Microsoft** — Introduction to Computers\n• **NVIDIA** — Getting Started with AI on Jetson Nano\n• **AWS** — Generative AI on AWS + Cloud Computing\n• **Forage** — Software Engineering, GenAI, Cyber, Solutions Architecture, Data Analytics simulations\n• **Hack2026** — AI Skill Event Hackathon (Parul University)\n\nEvery one is verified in the **Certificate Vault** — searchable, filterable, with full previews.`,
        nav: "certificates",
        suggestions: ["Show his AI certificates", "Cloud certifications", "What is Hack2026?"],
      };
    }
    case "experience":
      return {
        reply: `Kapil's journey so far:\n\n• Started technical foundations in 2025\n• Earned early certifications (NVIDIA Jetson Nano, AWS, AI Agents)\n• Completed Forage industry job simulations (Software Engineering, Cyber, GenAI, Solutions Architecture, Data Analytics)\n• Participated in **Hack2026** (AI Skill Event Hackathon) at Parul University\n• Advanced credentials in 2026 (Google AI, Meta Front-End, Microsoft)\n• Currently building AI & software projects\n\nSee the full interactive timeline in the Journey section.`,
        nav: "journey",
        suggestions: ["Hack2026 details", "His certifications"],
      };
    case "github":
      return {
        reply: `Kapil's GitHub handle is **${site.githubHandle}** — view his public repositories and build activity.\n\nOpen his profile: ${site.github}\n\nRepos currently visible include **reel** (Reels Hub), **HACATHON-PROJECT**, and **AD**.`,
        nav: "github",
        suggestions: ["Show his projects", "Contact details"],
      };
    case "resume":
      return {
        reply: `Kapil's one-page resume summarizes his profile, education (B.Tech CSE AI & ML), technical skills, selected projects, certifications and Hack2026 participation.\n\nYou can **download the PDF** or view it from the Resume section.`,
        nav: "resume",
        suggestions: ["His skills", "His certifications"],
      };
    case "contact":
      return {
        reply: `You can reach Kapil here:\n\n• **Email:** ${site.email}\n• **Phone:** ${site.phone}\n• **GitHub:** ${site.githubHandle}\n• **LinkedIn:** linkedin.com/in/kapil-kumar-931330375\n\nOr use the **contact form** on this page to send a message directly — it's delivered straight to his inbox.`,
        nav: "contact",
        suggestions: ["Send a message", "Who is Kapil?"],
      };
    case "location":
      return {
        reply: `Kapil is based in **Vadodara, India**, where he studies at Parul University. He's open to remote opportunities and collaborations.`,
        suggestions: ["Contact him", "His background"],
      };
    case "thanks":
      return {
        reply: `Anytime! Glad I could help. If you'd like to know more, just ask — or reach out to Kapil through the contact section. 😊`,
        suggestions: ["Who is Kapil?", "Contact details"],
      };
    case "bye":
      return {
        reply: `Thanks for exploring **KAPIL OS**! If you're impressed, Kapil would love to hear from you — there's a contact form waiting. 👋`,
        suggestions: ["Contact Kapil"],
      };
    default:
      return {
        reply: `I didn't quite catch that, but here's a quick map of what I know:\n\n• **Background** — education, focus\n• **Skills** — tech stack, specific languages\n• **Projects** — Reels Hub, Jarvis, Nexus Mirror, FedHealthGuard\n• **Certifications** — Google, Meta, NVIDIA, AWS, Forage\n• **Contact / Resume / GitHub**\n\nTry asking differently, or use the navigation above.`,
        suggestions: ["Who is Kapil?", "His skills", "His certifications"],
      };
  }
}

// ------------------------------------------------------------------
// Main entry
// ------------------------------------------------------------------
export function generateAnswer(rawQuery: string): AssistantReply {
  const query = rawQuery.trim().slice(0, 500);
  if (!query) {
    return { reply: "Ask me anything about Kapil Kumar — his skills, projects, certifications, or how to reach him." };
  }

  const tokens = QUERY(query);
  const ql = query.toLowerCase();

  // 0. Profile-navigation overrides (before specific lookups):
  //    "show his github" / "view his repos" → his GitHub profile, not the skill.
  if (
    /\bgithub\b/.test(ql) &&
    /\b(show|view|profile|repos?|repo|repository|his|their|activity|follow|link|code|open source)\b/.test(ql)
  ) {
    return answerFor("github");
  }

  // 1. Specific lookups
  const skill = skillMatch(ql, tokens);
  if (skill) return skill;
  const project = projectMatch(ql, tokens);
  if (project) return project;
  const cert = certificateMatch(ql);
  if (cert) return cert;

  // 2. Intent
  const intent = detectIntent(tokens, ql);
  if (intent) {
    return answerFor(intent.id, intent.nav);
  }

  // 3. Fallback
  return answerFor("unknown");
}
