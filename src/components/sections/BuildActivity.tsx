"use client";

import { useEffect, useState } from "react";
import { Github, ExternalLink, Star, GitFork, Loader2, FolderGit2, Activity } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { staticRepos, githubProfileUrl, languageColors } from "@/data/github";

interface ApiRepo {
  name: string;
  description: string | null;
  language: string | null;
  html_url?: string;
  url?: string;
  stargazers_count?: number;
  forks_count?: number;
}

export function BuildActivity({ githubHandle = "sniperlordhumai-debug" }: { githubHandle?: string }) {
  const [repos, setRepos] = useState<ApiRepo[] | null>(null);
  const [mode, setMode] = useState<"live" | "static">("live");
  const [error, setError] = useState(false);

  // Fetch through our server-side proxy (/api/github) so the token stays
  // off the client, responses are cached, and the endpoint is rate-limited.
  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch("/api/github");
        if (!res.ok) throw new Error("api");
        const data = (await res.json()) as { repos?: ApiRepo[] };
        if (!cancelled) {
          if (data.repos && data.repos.length > 0) {
            setRepos(data.repos);
          } else {
            setMode("static");
            setRepos(staticRepos);
          }
        }
      } catch {
        if (!cancelled) {
          setError(true);
          setMode("static");
        }
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const langTotals = useMemoLanguageStats(repos);

  return (
    <Section
      id="github" number="06"
      label="GITHUB / BUILD ACTIVITY"
      title={
        <>
          Build <span className="text-gradient">Activity</span>
        </>
      }
      intro={`Live repositories from ${githubHandle}, fetched from the public GitHub API (with a static fallback if the API is unavailable).`}
    >
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <a
          href={githubProfileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm text-ink-muted transition-colors hover:text-accent-cyan"
        >
          <Github className="h-4 w-4" /> {githubHandle} <ExternalLink className="h-3.5 w-3.5" />
        </a>
        <span className="chip">
          <Activity className="h-3.5 w-3.5 text-accent-green" />
          {mode === "live" ? "LIVE DATA" : "STATIC FALLBACK"}
        </span>
      </div>

      {/* Language distribution */}
      {repos && repos.length > 0 && (
        <Reveal>
          <div className="glass mb-6 rounded-2xl p-5">
            <p className="mb-3 font-mono text-xs uppercase tracking-wider text-ink-faint">
              Language distribution (top repos)
            </p>
            <div className="flex h-2.5 w-full overflow-hidden rounded-full">
              {langTotals.map((l) => (
                <div
                  key={l.lang}
                  style={{ width: `${l.pct}%`, background: languageColors[l.lang] ?? "#64748b" }}
                  title={`${l.lang} ${l.pct.toFixed(0)}%`}
                />
              ))}
            </div>
            <div className="mt-3 flex flex-wrap gap-4">
              {langTotals.map((l) => (
                <span key={l.lang} className="flex items-center gap-1.5 text-xs text-ink-muted">
                  <span className="h-2.5 w-2.5 rounded-sm" style={{ background: languageColors[l.lang] ?? "#64748b" }} />
                  {l.lang} <span className="text-ink-faint">{l.count}</span>
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      )}

      {/* Repos */}
      {repos === null && !error ? (
        <div className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.02] p-12 text-ink-muted">
          <Loader2 className="h-5 w-5 animate-spin text-accent-cyan" />
          Fetching repositories...
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {(repos ?? staticRepos).map((r, i) => (
            <Reveal key={r.name} delay={i * 0.04}>
              <a
                href={"html_url" in r ? r.html_url : r.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-full flex-col rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 transition-all hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.04]"
              >
                <div className="flex items-center justify-between">
                  <FolderGit2 className="h-5 w-5 text-accent-cyan" />
                  <ExternalLink className="h-4 w-4 text-ink-faint opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
                <p className="mt-3 font-mono text-sm font-medium text-white group-hover:text-accent-cyan">
                  {r.name}
                </p>
                <p className="mt-1.5 flex-1 text-xs leading-relaxed text-ink-muted">
                  {r.description || "No description available."}
                </p>
                <div className="mt-4 flex items-center gap-4 text-xs text-ink-faint">
                  {"stargazers_count" in r && (
                    <>
                      <span className="flex items-center gap-1">
                        <Star className="h-3 w-3" /> {r.stargazers_count}
                      </span>
                      <span className="flex items-center gap-1">
                        <GitFork className="h-3 w-3" /> {r.forks_count}
                      </span>
                    </>
                  )}
                  {r.language && (
                    <span className="flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ background: languageColors[r.language] ?? "#64748b" }} />
                      {r.language}
                    </span>
                  )}
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      )}

      <Reveal>
        <a
          href={githubProfileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-accent-cyan hover:underline"
        >
          View full GitHub profile →
        </a>
      </Reveal>
    </Section>
  );
}

function useMemoLanguageStats(repos: ApiRepo[] | null) {
  if (!repos || repos.length === 0) return [];
  const counts: Record<string, number> = {};
  repos.forEach((r) => {
    if (r.language) counts[r.language] = (counts[r.language] ?? 0) + 1;
  });
  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  return Object.entries(counts)
    .map(([lang, count]) => ({ lang, count, pct: (count / total) * 100 }))
    .sort((a, b) => b.count - a.count);
}
