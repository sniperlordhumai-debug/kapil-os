// =============================================================
// PROJECTS.DATA — the Project Lab
// Links are only populated when a real URL exists. Leave '' to hide
// the button. No URLs are fabricated.
// =============================================================

export type ProjectStatus = "Building" | "Experimental" | "Concept";

export interface ProjectCaseStudy {
  problem?: string;
  idea?: string;
  solution?: string;
  architecture?: string; // key -> diagram type
  contribution?: string;
  challenges?: string;
  future?: string;
}

export interface Project {
  id: string;
  number: string;
  title: string;
  oneLiner: string;
  description: string;
  category: string;
  technologies: string[];
  status: ProjectStatus;
  github: string; // '' hides the button
  demo: string; // '' hides the button
  featured: boolean;
  caseStudy: ProjectCaseStudy;
  accent: string;
}

export const projects: Project[] = [
  {
    id: "reels-hub",
    number: "01",
    title: "Reels Hub",
    oneLiner: "Short-form video platform concept.",
    description:
      "A short-form video platform concept with separate user/admin workflows, content management and monetization-oriented functionality.",
    category: "Web / Product",
    technologies: ["Web Development", "TypeScript", "Frontend", "Backend architecture"],
    status: "Building",
    github: "",
    demo: "",
    featured: true,
    accent: "#22d3ee",
    caseStudy: {
      problem:
        "Short-form platforms grow quickly but are complex to run — moderation, monetization and separate user/admin experiences need a clear structure.",
      idea:
        "Design a short-form video platform concept with two distinct worlds: a creator/user side and an admin side, with content management and monetization-oriented features at the core.",
      solution:
        "A product concept mapping the frontend experience, API layer and backend architecture so that content flows from upload to moderation to monetization in a clean pipeline.",
      architecture: "web",
      contribution:
        "Product concept, feature scoping, frontend/backend architecture planning. This is an ongoing build, not a released product.",
      challenges:
        "Balancing content moderation with monetization features and keeping the user/admin workflows cleanly separated.",
      future:
        "Prototype the frontend and API, add a working video pipeline and integrate an admin dashboard.",
    },
  },
  {
    id: "nexus-mirror",
    number: "02",
    title: "Nexus Mirror",
    oneLiner: "Windows mobile-mirroring concept.",
    description:
      "A Windows-based mobile mirroring concept focused on connecting a mobile device to a PC for screen interaction and control.",
    category: "Desktop / Mobile / System",
    technologies: ["Desktop", "Mobile", "System", "Windows"],
    status: "Experimental",
    github: "",
    demo: "",
    featured: false,
    accent: "#3b82f6",
    caseStudy: {
      problem:
        "Mirroring and controlling a phone from a PC often relies on heavyweight or platform-locked tools.",
      idea:
        "A Windows-based mirroring concept that connects a mobile device to a PC for live screen interaction and control.",
      solution:
        "Design a connection + streaming pipeline between the mobile device and a Windows host, focusing on screen interaction and control.",
      architecture: "system",
      contribution:
        "Concept and system design for the connection and interaction flow. Early-stage exploration.",
      challenges:
        "Low-latency streaming and input injection across platforms are the hardest engineering problems.",
      future:
        "Validate latency, prototype a minimal stream loop and add input control.",
    },
  },
  {
    id: "jarvis",
    number: "03",
    title: "Jarvis Personal Assistant",
    oneLiner: "Python voice + desktop automation assistant.",
    description:
      "A Python-based personal assistant concept combining voice interaction, speech processing and desktop automation.",
    category: "AI / Automation / Python",
    technologies: ["Python", "AI", "Automation", "Speech Processing"],
    status: "Building",
    github: "",
    demo: "",
    featured: true,
    accent: "#4ade80",
    caseStudy: {
      idea:
        "A Python assistant that listens, understands intent and acts — combining voice input/output with desktop automation.",
      solution:
        "Pipe audio → speech processing → command interpretation → desktop action, with spoken feedback returned to the user.",
      architecture: "ai",
      contribution:
        "Concept and core voice-interaction + automation loop built in Python.",
      challenges:
        "Reliable speech recognition and keeping responses fast enough to feel like a real assistant.",
      future:
        "Expand command coverage, integrate AI agents for open-ended tasks and harden the desktop automation layer.",
    },
  },
  {
    id: "fedhealthguard",
    number: "04",
    title: "FedHealthGuard",
    oneLiner: "Privacy-preserving federated learning concept.",
    description:
      "An AI/ML concept exploring privacy-preserving federated learning for healthcare-oriented multimodal data.",
    category: "AI / ML / Federated Learning",
    technologies: ["AI", "ML", "Federated Learning", "Healthcare"],
    status: "Concept",
    github: "",
    demo: "",
    featured: false,
    accent: "#a78bfa",
    caseStudy: {
      problem:
        "Healthcare data is sensitive — centralizing it to train models raises privacy and regulatory concerns.",
      idea:
        "Use federated learning so models are trained across distributed devices/hospitals without moving raw, sensitive data to a central server.",
      solution:
        "An AI/ML concept applying privacy-preserving federated learning to multimodal healthcare data, keeping training local and sharing only model updates.",
      architecture: "ai",
      contribution:
        "Research-oriented concept exploring federated learning applied to multimodal healthcare data.",
      challenges:
        "Heterogeneous devices, non-IID data distributions and ensuring privacy guarantees hold in practice.",
      future:
        "Prototype a federated training loop on a small dataset and benchmark against centralized baselines.",
    },
  },
];

export const projectCategories = ["All", "Web / Product", "Desktop / Mobile / System", "AI / Automation / Python", "AI / ML / Federated Learning"];
