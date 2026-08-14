// =============================================================
// TIMELINE.DATA — the Journey
// Milestones are derived from real certificate dates and resume
// activity. Nothing is fabricated.
// =============================================================

export interface Milestone {
  id: string;
  year: string;
  dateLabel: string;
  title: string;
  detail: string;
  category: "Learning" | "Certification" | "Simulation" | "Build" | "Event";
  tag: string;
}

export const milestones: Milestone[] = [
  {
    id: "m-foundations",
    year: "2025",
    dateLabel: "2025",
    title: "Started building technical foundations",
    detail:
      "Began B.Tech CSE (AI & ML) at Parul University and started building on Python, C++ and Java fundamentals.",
    category: "Learning",
    tag: "Foundations",
  },
  {
    id: "m-early-certs",
    year: "2025",
    dateLabel: "Jul 2025",
    title: "First certifications",
    detail:
      "Earned early credentials — HP LIFE Effective Leadership and, in August, AI Agents (Simplilearn), NVIDIA Jetson Nano, AWS GenAI and AWS Cloud.",
    category: "Certification",
    tag: "Certification",
  },
  {
    id: "m-forage",
    year: "2025",
    dateLabel: "Sep 2025",
    title: "Industry job simulations",
    detail:
      "Completed Forage job simulations across Software Engineering, Cybersecurity (Deloitte), GenAI, Solutions Architecture, Strategy Consulting (Accenture) and GenAI-powered Data Analytics (Tata).",
    category: "Simulation",
    tag: "Simulation",
  },
  {
    id: "m-dash",
    year: "2026",
    dateLabel: "Oct 2025 – Feb 2026",
    title: "Data app engineering simulation",
    detail:
      "Built, tested and automated a Dash data application from local setup through data processing to automated testing.",
    category: "Build",
    tag: "Build",
  },
  {
    id: "m-hack",
    year: "2026",
    dateLabel: "Mar 2026",
    title: "Hack2026 participation",
    detail:
      "Competed in the AI Skill Event: Hackathon at Parul University — a 3.5-hour competitive build.",
    category: "Event",
    tag: "Event",
  },
  {
    id: "m-2026-certs",
    year: "2026",
    dateLabel: "Apr 2026",
    title: "Advanced AI & web credentials",
    detail:
      "Completed Google AI Fundamentals, Meta Introduction to Front-End Development and Microsoft Introduction to Computers.",
    category: "Certification",
    tag: "Certification",
  },
  {
    id: "m-projects",
    year: "2026",
    dateLabel: "2026",
    title: "Building AI & software projects",
    detail:
      "Working on the Project Lab — Reels Hub, Jarvis Personal Assistant, Nexus Mirror and FedHealthGuard.",
    category: "Build",
    tag: "Building",
  },
];
