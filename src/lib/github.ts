// =============================================================
// SERVER-SIDE GITHUB HELPER
// Called only from the /api/github route. Keeps any token out of
// the browser, validates + normalizes the upstream response, and
// caches results. No secrets are ever exposed to the client.
// =============================================================

export interface SafeRepo {
  name: string;
  description: string | null;
  language: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  updated_at: string | null;
}

interface RawRepo {
  name?: unknown;
  description?: unknown;
  language?: unknown;
  html_url?: unknown;
  stargazers_count?: unknown;
  forks_count?: unknown;
  updated_at?: unknown;
}

/** Sanitize + shape upstream data; drop anything malformed. */
function normalize(raw: RawRepo[]): SafeRepo[] {
  if (!Array.isArray(raw)) return [];
  const out: SafeRepo[] = [];
  for (const r of raw) {
    if (!r || typeof r.name !== "string") continue;
    out.push({
      name: r.name.slice(0, 120),
      description: typeof r.description === "string" ? r.description.slice(0, 300) : null,
      language: typeof r.language === "string" ? r.language.slice(0, 40) : null,
      html_url: typeof r.html_url === "string" ? r.html_url : `https://github.com`,
      stargazers_count: Number(r.stargazers_count) || 0,
      forks_count: Number(r.forks_count) || 0,
      updated_at: typeof r.updated_at === "string" ? r.updated_at : null,
    });
    if (out.length >= 8) break;
  }
  return out;
}

// Small in-memory cache: key -> { data, expiresAt }.
const cache = new Map<string, { data: SafeRepo[]; expiresAt: number }>();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

export async function fetchUserRepos(username: string): Promise<{
  repos: SafeRepo[];
  cached: boolean;
  upstreamStatus: number;
}> {
  const cacheKey = `repos:${username}`;
  const hit = cache.get(cacheKey);
  if (hit && hit.expiresAt > Date.now()) {
    return { repos: hit.data, cached: true, upstreamStatus: 200 };
  }

  const headers: Record<string, string> = { Accept: "application/vnd.github+json" };
  const token = process.env.GITHUB_TOKEN; // server-only, never NEXT_PUBLIC
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}/repos?sort=updated&per_page=8`, {
    headers,
    next: { revalidate: 300 }, // ISR-style cache hint where supported
  });

  if (!res.ok) {
    // Never leak upstream error bodies / headers to the client.
    return { repos: [], cached: false, upstreamStatus: res.status };
  }

  const raw = (await res.json()) as RawRepo[];
  const repos = normalize(raw);
  cache.set(cacheKey, { data: repos, expiresAt: Date.now() + CACHE_TTL_MS });
  return { repos, cached: false, upstreamStatus: 200 };
}
