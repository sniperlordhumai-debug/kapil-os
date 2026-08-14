// =============================================================
// SKILLS.DATA — the Skill Vault
// Each skill links to real projects (projects.ts) and certificates
// (certificates.ts) so skills are proven, not just listed.
// =============================================================

export interface SkillItem {
  id: string;
  name: string;
  icon: string; // lucide icon key (mapped in UI)
  description: string;
  projects: string[]; // project ids
  certificates: string[]; // certificate ids
  tags: string[];
}

export interface SkillCategory {
  id: string;
  label: string;
  hint: string;
  skills: SkillItem[];
}

export const skillCategories: SkillCategory[] = [
  {
    id: "programming",
    label: "PROGRAMMING",
    hint: "Languages & core CS",
    skills: [
      {
        id: "python",
        name: "Python",
        icon: "code2",
        description:
          "Primary language for AI/ML experiments, automation and the Jarvis assistant.",
        projects: ["jarvis"],
        certificates: ["google-ai-fundamentals"],
        tags: ["AI", "Automation"],
      },
      {
        id: "cpp",
        name: "C++",
        icon: "braces",
        description: "Used for DSA practice and performance-oriented programming.",
        projects: [],
        certificates: [],
        tags: ["DSA"],
      },
      {
        id: "java",
        name: "Java",
        icon: "coffee",
        description: "Used for software engineering fundamentals and OOP.",
        projects: [],
        certificates: [],
        tags: ["OOP"],
      },
      {
        id: "typescript",
        name: "TypeScript",
        icon: "file-code",
        description: "Used in frontend work and the Reels Hub web concept.",
        projects: ["reels-hub"],
        certificates: ["meta-frontend"],
        tags: ["Web"],
      },
      {
        id: "javascript",
        name: "JavaScript",
        icon: "braces",
        description: "Core web language for front-end development.",
        projects: ["reels-hub"],
        certificates: ["meta-frontend"],
        tags: ["Web"],
      },
      {
        id: "html-css",
        name: "HTML / CSS",
        icon: "layout",
        description: "Structuring and styling the web — reinforced via Meta Front-End Development.",
        projects: ["reels-hub"],
        certificates: ["meta-frontend"],
        tags: ["Web"],
      },
      {
        id: "oop",
        name: "OOP",
        icon: "box",
        description: "Object-oriented programming principles across Java, C++ and Python.",
        projects: [],
        certificates: ["microsoft-intro-computers"],
        tags: ["Engineering"],
      },
      {
        id: "dsa",
        name: "DSA",
        icon: "git-branch",
        description: "Data structures and algorithms for efficient problem solving.",
        projects: [],
        certificates: [],
        tags: ["Engineering"],
      },
    ],
  },
  {
    id: "ai-ml",
    label: "AI / ML",
    hint: "Artificial intelligence & machine learning",
    skills: [
      {
        id: "ai",
        name: "Artificial Intelligence",
        icon: "cpu",
        description:
          "Core AI concepts validated by Google AI Fundamentals and the Jetson Nano course.",
        projects: ["fedhealthguard", "jarvis"],
        certificates: ["google-ai-fundamentals", "nvidia-jetson-nano"],
        tags: ["AI"],
      },
      {
        id: "genai",
        name: "Generative AI",
        icon: "sparkles",
        description:
          "Applied in the GenAI job simulation and AWS GenAI chalk talk.",
        projects: ["jarvis"],
        certificates: ["forage-genai", "aws-genai"],
        tags: ["GenAI"],
      },
      {
        id: "ai-agents",
        name: "AI Agents",
        icon: "bot",
        description: "Introduced through the AI Agents for Beginners course.",
        projects: ["jarvis"],
        certificates: ["simplilearn-ai-agents"],
        tags: ["Agents"],
      },
      {
        id: "edge-ai",
        name: "Edge AI / Jetson Nano",
        icon: "memory-stick",
        description: "Applied AI on NVIDIA Jetson Nano edge computing platform.",
        projects: [],
        certificates: ["nvidia-jetson-nano"],
        tags: ["Edge AI"],
      },
      {
        id: "data-analytics",
        name: "Data Analytics",
        icon: "bar-chart",
        description:
          "EDA, risk profiling and AI-driven analytics via the Tata and Dash simulations.",
        projects: [],
        certificates: ["forage-tata-data-analytics", "forage-dash-data"],
        tags: ["Data"],
      },
      {
        id: "federated-learning",
        name: "Federated Learning",
        icon: "network",
        description: "Explored in the FedHealthGuard privacy-preserving concept.",
        projects: ["fedhealthguard"],
        certificates: [],
        tags: ["ML"],
      },
    ],
  },
  {
    id: "web",
    label: "WEB DEVELOPMENT",
    hint: "Building for the browser",
    skills: [
      {
        id: "frontend",
        name: "Front-End Development",
        icon: "layout",
        description: "Validated by Meta's Introduction to Front-End Development.",
        projects: ["reels-hub"],
        certificates: ["meta-frontend"],
        tags: ["Frontend"],
      },
      {
        id: "rest-api",
        name: "REST APIs",
        icon: "plug",
        description:
          "Built REST API controllers and integration in the Forage software engineering simulation.",
        projects: ["reels-hub"],
        certificates: ["forage-software-engineering"],
        tags: ["API"],
      },
      {
        id: "dash",
        name: "Dash",
        icon: "gauge",
        description: "Built and tested a full Dash data application end-to-end.",
        projects: [],
        certificates: ["forage-dash-data"],
        tags: ["Data apps"],
      },
    ],
  },
  {
    id: "software",
    label: "SOFTWARE ENGINEERING",
    hint: "Engineering practice & process",
    skills: [
      {
        id: "se",
        name: "Software Engineering",
        icon: "workflow",
        description:
          "Project setup, integration and API controllers from the Forage simulation.",
        projects: ["reels-hub", "nexus-mirror"],
        certificates: ["forage-software-engineering"],
        tags: ["Engineering"],
      },
      {
        id: "testing",
        name: "Testing",
        icon: "shield-check",
        description: "Automated test suites built in the Dash data-app simulation.",
        projects: [],
        certificates: ["forage-dash-data"],
        tags: ["QA"],
      },
      {
        id: "cybersec",
        name: "Cybersecurity Fundamentals",
        icon: "lock",
        description: "Practical security tasks from the Deloitte Cyber simulation.",
        projects: ["fedhealthguard"],
        certificates: ["forage-cyber"],
        tags: ["Security"],
      },
    ],
  },
  {
    id: "cloud",
    label: "CLOUD",
    hint: "Infrastructure & platforms",
    skills: [
      {
        id: "aws",
        name: "AWS",
        icon: "cloud",
        description:
          "Cloud computing fundamentals and Generative AI on AWS chalk talks.",
        projects: [],
        certificates: ["aws-cloud-computing", "aws-genai", "forage-solutions-architecture"],
        tags: ["Cloud"],
      },
      {
        id: "cloud-arch",
        name: "Cloud Architecture",
        icon: "layers",
        description:
          "Designed a scalable hosting architecture in the Solutions Architecture simulation.",
        projects: ["reels-hub"],
        certificates: ["forage-solutions-architecture"],
        tags: ["Architecture"],
      },
    ],
  },
  {
    id: "tools",
    label: "TOOLS & PLATFORMS",
    hint: "The everyday toolkit",
    skills: [
      {
        id: "git",
        name: "Git",
        icon: "git-branch",
        description: "Version control for all projects.",
        projects: [],
        certificates: [],
        tags: ["Tools"],
      },
      {
        id: "github",
        name: "GitHub",
        icon: "github",
        description: "Hosting code and building in public.",
        projects: [],
        certificates: [],
        tags: ["Tools"],
      },
      {
        id: "nvidia-jetson",
        name: "NVIDIA Jetson Nano",
        icon: "microchip",
        description: "Edge AI hardware platform explored in the NVIDIA course.",
        projects: [],
        certificates: ["nvidia-jetson-nano"],
        tags: ["Hardware"],
      },
    ],
  },
];
