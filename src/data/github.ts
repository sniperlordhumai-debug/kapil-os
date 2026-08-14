// =============================================================
// GITHUB.DATA — Build Activity
// The GitHub section tries the live public GitHub API first and
// falls back to this static list. Only publicly-known repository
// names are used — no invented stats.
// =============================================================

export interface RepoEntry {
  name: string;
  description: string;
  language: string;
  url: string;
}

// Static fallback using the user's currently visible public repositories.
export const staticRepos: RepoEntry[] = [
  {
    name: "reel",
    description: "Short-form video platform build (Reels Hub).",
    language: "TypeScript",
    url: "https://github.com/sniperlordhumai-debug/reel",
  },
  {
    name: "HACATHON-PROJECT",
    description: "Hack2026 hackathon project.",
    language: "",
    url: "https://github.com/sniperlordhumai-debug/HACATHON-PROJECT",
  },
  {
    name: "AD",
    description: "Additional experiments and builds.",
    language: "",
    url: "https://github.com/sniperlordhumai-debug/AD",
  },
];

export const githubProfileUrl = "https://github.com/sniperlordhumai-debug";

// Accent color per language (fallback palette for the language bar).
export const languageColors: Record<string, string> = {
  Python: "#3572A5",
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  "C++": "#f34b7d",
  Java: "#b07219",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Jupyter: "#DA5B0B",
  Shell: "#89e051",
};
