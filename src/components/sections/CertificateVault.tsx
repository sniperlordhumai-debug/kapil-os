"use client";

import { useMemo, useState } from "react";
import { Search, Award, Building2, Calendar, Layers, ExternalLink, SlidersHorizontal, ArrowUpDown } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { FlipCard } from "@/components/ui/FlipCard";
import { CertificateViewer } from "./CertificateViewer";
import { certificates, certificateCategories, certificateStats } from "@/data/certificates";

const orgOptions = Array.from(new Set(certificates.map((c) => c.organization))).sort();
const yearOptions = Array.from(new Set(certificates.map((c) => c.year))).sort((a, b) => b - a);

export function CertificateVault() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [org, setOrg] = useState("All");
  const [year, setYear] = useState("All");
  const [sort, setSort] = useState<"newest" | "oldest">("newest");
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = certificates.filter((c) => {
      if (category !== "All" && c.category !== category) return false;
      if (org !== "All" && c.organization !== org) return false;
      if (year !== "All" && c.year !== Number(year)) return false;
      if (q) {
        const hay = `${c.title} ${c.organization} ${c.category} ${c.skills.join(" ")}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
    list.sort((a, b) =>
      sort === "newest"
        ? b.dateISO.localeCompare(a.dateISO)
        : a.dateISO.localeCompare(b.dateISO)
    );
    return list;
  }, [query, category, org, year, sort]);

  const activeCert = activeIdx !== null ? filtered[activeIdx] : null;

  function navigate(dir: 1 | -1) {
    if (activeIdx === null) return;
    const next = (activeIdx + dir + filtered.length) % filtered.length;
    setActiveIdx(next);
  }

  const filterBtn = (active: boolean) =>
    `rounded-lg border px-3 py-2 text-xs font-medium transition-all ${
      active
        ? "border-accent-cyan/50 bg-accent-cyan/10 text-accent-cyan"
        : "border-white/10 bg-white/[0.02] text-ink-muted hover:border-white/25 hover:text-white"
    }`;

  return (
    <Section
      id="certificates" number="04"
      label="CERTIFICATE VAULT"
      title={
        <>
          Certificate <span className="text-gradient">Vault</span>
        </>
      }
      intro="An archive of real credentials. Every certificate links back to the skills it proves."
    >
      {/* Stats */}
      <Reveal>
        <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "Credentials", value: `${certificateStats.total}+`, icon: Award },
            { label: "Organizations", value: certificateStats.organizations, icon: Building2 },
            { label: "Years", value: certificateStats.years, icon: Calendar },
            { label: "Domains", value: certificateStats.categories, icon: Layers },
          ].map((s) => (
            <div key={s.label} className="glass rounded-2xl p-4">
              <s.icon className="h-4 w-4 text-accent-cyan" />
              <p className="mt-2 font-display text-2xl font-semibold text-white">{s.value}</p>
              <p className="text-xs text-ink-muted">{s.label}</p>
            </div>
          ))}
        </div>
      </Reveal>

      {/* Search + filters */}
      <Reveal>
        <div className="glass mb-8 rounded-2xl p-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
            <div className="flex flex-1 items-center gap-2 rounded-xl border border-white/10 bg-black/30 px-3 py-2.5">
              <Search className="h-4 w-4 text-ink-faint" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search certificates..."
                className="w-full bg-transparent text-sm text-white placeholder:text-ink-faint focus:outline-none"
                aria-label="Search certificates"
              />
            </div>
            <button
              onClick={() => setSort((s) => (s === "newest" ? "oldest" : "newest"))}
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm text-ink-muted transition-colors hover:text-white"
              aria-label="Toggle sort order"
            >
              <ArrowUpDown className="h-4 w-4 text-accent-cyan" />
              {sort === "newest" ? "Newest" : "Oldest"}
            </button>
          </div>

          <div className="mt-4 space-y-3">
            <div>
              <p className="mb-2 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-ink-faint">
                <SlidersHorizontal className="h-3 w-3" /> Category
              </p>
              <div className="flex flex-wrap gap-2">
                {["All", ...certificateCategories].map((c) => (
                  <button key={c} onClick={() => setCategory(c)} className={filterBtn(category === c)}>
                    {c}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <p className="mb-2 font-mono text-[10px] uppercase tracking-wider text-ink-faint">Organization</p>
                <div className="flex flex-wrap gap-2">
                  {["All", ...orgOptions].map((o) => (
                    <button key={o} onClick={() => setOrg(o)} className={filterBtn(org === o)}>
                      {o}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-2 font-mono text-[10px] uppercase tracking-wider text-ink-faint">Year</p>
                <div className="flex flex-wrap gap-2">
                  {["All", ...yearOptions.map(String)].map((y) => (
                    <button key={y} onClick={() => setYear(y)} className={filterBtn(year === y)}>
                      {y === "All" ? "All" : y}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Reveal>

      {/* Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((c, i) => (
          <Reveal key={c.id} delay={i * 0.04}>
            <div className="h-full">
              <FlipCard
                className="h-full cursor-pointer"
                onFrontClick={() => setActiveIdx(i)}
                onBackClick={() => setActiveIdx(i)}
                front={
                  <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02] text-left transition-colors hover:border-accent-cyan/30 hover:bg-white/[0.04]">
                    <div className="relative aspect-[16/10] overflow-hidden bg-black/40">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={c.image}
                        alt={`${c.title} certificate preview`}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                      <span className="absolute left-3 top-3 rounded-lg bg-black/60 px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-accent-cyan backdrop-blur">
                        {c.category}
                      </span>
                    </div>
                    <div className="p-4">
                      <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-ink-faint">
                        <Building2 className="h-3 w-3 text-accent-cyan" /> {c.organization}
                      </p>
                      <p className="mt-2 font-medium text-white group-hover/flip:text-accent-cyan">
                        {c.title}
                      </p>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-xs text-ink-muted">{c.date}</span>
                        <span className="flex items-center gap-1 text-xs text-accent-cyan">
                          Hover to flip <ExternalLink className="h-3 w-3" />
                        </span>
                      </div>
                    </div>
                  </div>
                }
                back={
                  <div className="flex h-full flex-col items-center justify-center gap-3 overflow-hidden rounded-2xl border border-accent-cyan/30 bg-gradient-to-br from-accent-cyan/[0.08] via-surface to-accent-blue/[0.08] p-6 text-center">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-cyan/15 text-accent-cyan">
                      <ExternalLink className="h-5 w-5" />
                    </span>
                    <p className="font-display text-sm font-semibold text-white">{c.title}</p>
                    <p className="text-xs text-ink-muted">{c.organization} · {c.date}</p>
                    <div className="mt-1 flex flex-wrap justify-center gap-1.5">
                      {c.skills.slice(0, 3).map((s) => (
                        <span key={s} className="chip">{s}</span>
                      ))}
                    </div>
                    <span className="mt-2 rounded-full bg-white px-4 py-1.5 text-xs font-semibold text-base">
                      Click to view full certificate
                    </span>
                  </div>
                }
              />
            </div>
          </Reveal>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="rounded-2xl border border-dashed border-white/10 p-10 text-center text-ink-muted">
          No certificates match your filters.
        </div>
      )}

      <CertificateViewer
        cert={activeCert}
        onClose={() => setActiveIdx(null)}
        onNavigate={navigate}
      />
    </Section>
  );
}
