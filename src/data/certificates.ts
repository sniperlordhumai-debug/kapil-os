// =============================================================
// CERTIFICATES.DATA — the Certificate Vault
// Every entry below maps to a real certificate page extracted from
// the provided achievement PDF. Do not invent certificates.
// =============================================================

export type CertificateCategory =
  | "AI / ML"
  | "Software Engineering"
  | "Web Development"
  | "Cloud"
  | "Cybersecurity"
  | "Data Analytics"
  | "Leadership"
  | "Hackathon";

export interface Certificate {
  id: string;
  title: string;
  organization: string;
  issuer: string;
  date: string; // display date
  dateISO: string; // sortable
  year: number;
  category: CertificateCategory;
  description: string;
  skills: string[];
  image: string;
  verificationUrl?: string;
  verificationNote?: string;
}

export const certificateCategories: CertificateCategory[] = [
  "AI / ML",
  "Software Engineering",
  "Web Development",
  "Cloud",
  "Cybersecurity",
  "Data Analytics",
  "Leadership",
  "Hackathon",
];

export const certificates: Certificate[] = [
  {
    id: "google-ai-fundamentals",
    title: "AI Fundamentals",
    organization: "Google",
    issuer: "Google · Coursera",
    date: "April 2026",
    dateISO: "2026-04-16",
    year: 2026,
    category: "AI / ML",
    description:
      "An authorized Google course covering the core concepts of artificial intelligence, delivered on Coursera.",
    skills: ["AI Fundamentals", "Artificial Intelligence"],
    image: "/certificates/google-ai-fundamentals.jpg",
    verificationUrl: "https://coursera.org/verify/OB4EQQRIB5E4",
  },
  {
    id: "meta-frontend",
    title: "Introduction to Front-End Development",
    organization: "Meta",
    issuer: "Meta · Coursera",
    date: "April 2026",
    dateISO: "2026-04-17",
    year: 2026,
    category: "Web Development",
    description:
      "Meta's introduction to front-end development covering the foundations of building for the web.",
    skills: ["HTML", "CSS", "Front-End Development"],
    image: "/certificates/meta-frontend.jpg",
    verificationUrl: "https://coursera.org/verify/TDEP51XRUKTY",
  },
  {
    id: "microsoft-intro-computers",
    title: "Introduction to Computers",
    organization: "Microsoft",
    issuer: "Microsoft · Coursera",
    date: "April 2026",
    dateISO: "2026-04-19",
    year: 2026,
    category: "Software Engineering",
    description:
      "A Microsoft course on core computer concepts — hardware, software and how systems work.",
    skills: ["Computer Fundamentals", "Computing"],
    image: "/certificates/microsoft-intro-computers.jpg",
    verificationUrl: "https://coursera.org/verify/VWSU86CD4M98",
  },
  {
    id: "nvidia-jetson-nano",
    title: "Getting Started with AI on Jetson Nano",
    organization: "NVIDIA",
    issuer: "NVIDIA",
    date: "August 2025",
    dateISO: "2025-08-18",
    year: 2025,
    category: "AI / ML",
    description:
      "Certificate of competency covering applied AI on NVIDIA's edge computing platform, Jetson Nano.",
    skills: ["Edge AI", "NVIDIA Jetson Nano", "AI Fundamentals"],
    image: "/certificates/nvidia-jetson-nano.jpg",
    verificationUrl:
      "https://learn.nvidia.com/certificates?id=q1YGFpi_Tyq6xK8LFM4J1Q",
    verificationNote: "Certification ID q1YGFpi_Tyq6xK8LFM4J1Q",
  },
  {
    id: "forage-solutions-architecture",
    title: "Solutions Architecture Job Simulation",
    organization: "Forage",
    issuer: "Forage",
    date: "September 2025",
    dateISO: "2025-09-18",
    year: 2025,
    category: "Cloud",
    description:
      "Completed practical tasks designing a simple, scalable hosting architecture.",
    skills: ["Solutions Architecture", "Cloud Architecture", "Hosting"],
    image: "/certificates/forage-solutions-architecture.jpg",
  },
  {
    id: "forage-software-engineering",
    title: "Software Engineering Job Simulation",
    organization: "Forage",
    issuer: "Forage",
    date: "September 2025",
    dateISO: "2025-09-10",
    year: 2025,
    category: "Software Engineering",
    description:
      "Hands-on simulation covering project setup, Kafka integration, H2 integration and REST API controllers.",
    skills: ["Project Setup", "Kafka Integration", "H2 Integration", "REST APIs"],
    image: "/certificates/forage-software-engineering.jpg",
  },
  {
    id: "forage-cyber",
    title: "Cyber Job Simulation",
    organization: "Deloitte",
    issuer: "Deloitte · Forage",
    date: "September 2025",
    dateISO: "2025-09-15",
    year: 2025,
    category: "Cybersecurity",
    description:
      "A Deloitte-hosted simulation applying foundational cybersecurity practices to practical tasks.",
    skills: ["Cybersecurity Fundamentals", "Security"],
    image: "/certificates/forage-cyber.jpg",
  },
  {
    id: "forage-dash-data",
    title: "Software Engineering Job Simulation (Dash)",
    organization: "Forage",
    issuer: "Forage",
    date: "February 2026",
    dateISO: "2026-02-05",
    year: 2026,
    category: "Data Analytics",
    description:
      "Built and tested a Dash application end-to-end, from local environment setup to data processing and automated testing.",
    skills: ["Dash", "Data Processing", "Data Apps", "Testing"],
    image: "/certificates/forage-dash-data.jpg",
  },
  {
    id: "forage-genai",
    title: "GenAI Job Simulation",
    organization: "Forage",
    issuer: "Forage",
    date: "September 2025",
    dateISO: "2025-09-25",
    year: 2025,
    category: "AI / ML",
    description:
      "Data extraction, initial analysis and development of an AI-powered financial chatbot.",
    skills: ["Generative AI", "AI Chatbot", "Data Analysis"],
    image: "/certificates/forage-genai.jpg",
  },
  {
    id: "forage-strategy-consulting",
    title: "Strategy Consulting Job Simulation",
    organization: "Accenture",
    issuer: "Accenture · Forage",
    date: "September 2025",
    dateISO: "2025-09-18",
    year: 2025,
    category: "Leadership",
    description:
      "Practical strategy work: profitability analysis, market research, customer journey redesign and data analysis.",
    skills: ["Strategy", "Market Research", "Data Analysis"],
    image: "/certificates/forage-strategy-consulting.jpg",
  },
  {
    id: "hack2026",
    title: "AI Skill Event: Hackathon (Hack2026)",
    organization: "Parul University",
    issuer: "Juno Hub · Kanan.co · Parul University",
    date: "March 2026",
    dateISO: "2026-03-16",
    year: 2026,
    category: "Hackathon",
    description:
      "Active participation in Hack2026 held at Parul University — a 3.5 hour competitive build demonstrating technical proficiency.",
    skills: ["Problem Solving", "Rapid Development", "Teamwork"],
    image: "/certificates/hack2026.jpg",
  },
  {
    id: "aws-cloud-computing",
    title: "Describe Cloud Computing",
    organization: "AWS",
    issuer: "AWS Academy",
    date: "August 2025",
    dateISO: "2025-08-21",
    year: 2025,
    category: "Cloud",
    description:
      "AWS Academy course covering cloud computing fundamentals and core concepts.",
    skills: ["Cloud Computing", "AWS Fundamentals"],
    image: "/certificates/aws-cloud-computing.jpg",
  },
  {
    id: "hp-life-leadership",
    title: "Effective Leadership",
    organization: "HP LIFE",
    issuer: "HP Foundation",
    date: "July 2025",
    dateISO: "2025-07-18",
    year: 2025,
    category: "Leadership",
    description:
      "HP LIFE online course on effective leadership, leadership strategies and the role of ethics.",
    skills: ["Leadership", "Ethics", "Communication"],
    image: "/certificates/hp-life-leadership.jpg",
  },
  {
    id: "aws-genai",
    title: "Chalk Talks: Generative AI on AWS",
    organization: "AWS",
    issuer: "AWS Training & Certification",
    date: "August 2025",
    dateISO: "2025-08-19",
    year: 2025,
    category: "AI / ML",
    description:
      "AWS chalk talk on Generative AI and how it runs on AWS services.",
    skills: ["Generative AI", "AWS", "Cloud"],
    image: "/certificates/aws-genai.jpg",
  },
  {
    id: "simplilearn-ai-agents",
    title: "AI Agents for Beginners",
    organization: "Simplilearn SkillUp",
    issuer: "Simplilearn",
    date: "August 2025",
    dateISO: "2025-08-17",
    year: 2025,
    category: "AI / ML",
    description:
      "Introductory course on building and understanding AI agents.",
    skills: ["AI Agents", "Generative AI"],
    image: "/certificates/simplilearn-ai-agents.jpg",
    verificationNote: "Certificate code 8804827",
  },
  {
    id: "forage-tata-data-analytics",
    title: "GenAI Powered Data Analytics Job Simulation",
    organization: "Tata",
    issuer: "Tata · Forage",
    date: "September 2025",
    dateISO: "2025-09-10",
    year: 2025,
    category: "Data Analytics",
    description:
      "Exploratory data analysis, risk profiling, AI-driven delinquency prediction and collections strategy.",
    skills: ["Data Analytics", "EDA", "Generative AI", "Risk Profiling"],
    image: "/certificates/forage-tata-data-analytics.jpg",
  },
];

export const certificateStats = {
  total: certificates.length,
  organizations: new Set(certificates.map((c) => c.organization)).size,
  years: new Set(certificates.map((c) => c.year)).size,
  categories: certificateCategories.length,
};
