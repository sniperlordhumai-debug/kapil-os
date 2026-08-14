"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Github, ExternalLink, ArrowRight, X, FolderGit2, Lightbulb, Target,
  Waypoints, User, Code2, Database, Cpu, Boxes, Flag, TrendingUp,
} from "lucide-react";
import { projects, type Project } from "@/data/projects";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { StatusPill } from "@/components/ui/StatusPill";
import { TiltCard } from "@/components/ui/TiltCard";
import { site } from "@/data/site";

function ArchitectureDiagram({ kind }: { kind: string }) {
  const web = [
    { label: "USER", icon: User },
    { label: "FRONTEND", icon: Code2 },
    { label: "API", icon: Waypoints },
    { label: "BACKEND", icon: Cpu },
    { label: "DATABASE", icon: Database },
  ];
  const ai = [
    { label: "INPUT", icon: Boxes },
    { label: "PROCESSING", icon: Cpu },
    { label: "MODEL", icon: Brain },
    { label: "OUTPUT", icon: Flag },
  ];
  const steps = kind === "web" ? web : kind === "ai" ? ai : ai;

  return (
    <div className="flex flex-col items-stretch gap-1.5 rounded-xl border border-white/[0.08] bg-black/30 p-4">
      {steps.map((s, i) => {
        const Icon = s.icon;
        return (
          <div key={s.label}>
            <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5">
              <Icon className="h-4 w-4 text-accent-cyan" />
              <span className="font-mono text-xs font-medium tracking-wide text-white">{s.label}</span>
            </div>
            {i < steps.length - 1 && (
              <div className="flex items-center justify-center py-0.5 text-ink-faint">
                <ArrowRight className="h-3.5 w-3.5 rotate-90" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function Brain({ className }: { className?: string }) {
  return <Cpu className={className} />;
}

const statusTone = { Building: "green", Experimental: "cyan", Concept: "muted" } as const;

export function ProjectLab() {
  const [open, setOpen] = useState<Project | null>(null);

  const detailSections = [
    { key: "problem" as const, icon: Target, title: "Problem", text: "What I'm trying to solve" },
    { key: "idea" as const, icon: Lightbulb, title: "Idea", text: "The concept" },
    { key: "solution" as const, icon: Code2, title: "Solution", text: "How it works" },
    { key: "contribution" as const, icon: User, title: "My contribution", text: "What I own" },
    { key: "challenges" as const, icon: Flag, title: "Challenges", text: "The hard parts" },
    { key: "future" as const, icon: TrendingUp, title: "Future improvements", text: "Where it goes next" },
  ];

  return (
    <Section
      id="projects" number="03"
      label="PROJECT LAB"
      title={
        <>
          Project <span className="text-gradient">Lab</span>
        </>
      }
      intro="Experimental products and builds in progress — treated like products, not college assignments."
    >
      <div className="grid gap-5 md:grid-cols-2">
        {projects.map((p, i) => (
          <Reveal key={p.id} delay={i * 0.05}>
            <TiltCard className="h-full">
            <article
              className={`group spotlight-card relative flex h-full flex-col overflow-hidden rounded-2xl border p-6 transition-all hover:-translate-y-1 ${
                p.featured
                  ? "border-white/[0.12] bg-white/[0.03] hover:border-accent-cyan/30"
                  : "border-white/[0.08] bg-white/[0.02] hover:border-white/20"
              }`}
            >
              <div className="mb-4 flex items-start justify-between">
                <span className="font-mono text-sm text-ink-faint">/{p.number}</span>
                <StatusPill tone={statusTone[p.status]}>{p.status}</StatusPill>
              </div>

              <h3 className="font-display text-2xl font-semibold text-white">{p.title}</h3>
              <p className="mt-1 font-mono text-xs uppercase tracking-wider text-accent-cyan/80">
                {p.category}
              </p>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-muted">
                {p.oneLiner}
              </p>

              <div className="mt-4 flex flex-wrap gap-1.5">
                {p.technologies.map((t) => (
                  <span key={t} className="chip">{t}</span>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-white/[0.07] pt-4">
                {p.github ? (
                  <a
                    href={p.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn border border-white/15 bg-white/[0.03] px-4 py-2 text-xs text-white hover:bg-white/[0.07]"
                  >
                    <Github className="h-3.5 w-3.5" /> GitHub
                  </a>
                ) : null}
                {p.demo ? (
                  <a
                    href={p.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn bg-white px-4 py-2 text-xs text-base hover:bg-white/90"
                  >
                    <ExternalLink className="h-3.5 w-3.5" /> Live Demo
                  </a>
                ) : null}
                <button
                  onClick={() => setOpen(p)}
                  className="btn ml-auto border border-accent-cyan/30 bg-accent-cyan/10 px-4 py-2 text-xs text-accent-cyan hover:bg-accent-cyan/20"
                >
                  Case Study <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-0 blur-3xl transition-opacity group-hover:opacity-100"
                style={{ background: `${p.accent}22` }}
              />
            </article>
            </TiltCard>
          </Reveal>
        ))}
      </div>

      {/* Case study modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[90] flex items-start justify-center overflow-y-auto bg-black/80 p-3 backdrop-blur-md sm:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(null)}
            role="dialog"
            aria-modal="true"
            aria-label={`${open.title} case study`}
          >
            <motion.div
              className="relative my-4 w-full max-w-3xl overflow-hidden rounded-2xl border border-white/10 bg-surface shadow-card"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="border-b border-white/10 px-6 py-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-mono text-xs text-ink-faint">PROJECT /{open.number}</p>
                    <h3 className="mt-1 font-display text-2xl font-semibold text-white">
                      {open.title}
                    </h3>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <StatusPill tone={statusTone[open.status]}>{open.status}</StatusPill>
                      <span className="font-mono text-xs text-accent-cyan/80">{open.category}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setOpen(null)}
                    className="rounded-lg p-2 text-ink-muted transition-colors hover:bg-white/10 hover:text-white"
                    aria-label="Close case study"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-ink-muted">{open.description}</p>
              </div>

              <div className="grid gap-5 px-6 py-6 md:grid-cols-[1fr_1fr]">
                <div className="space-y-4">
                  {detailSections.map((s) => {
                    const content = open.caseStudy[s.key];
                    if (!content) return null;
                    return (
                      <div key={s.key} className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4">
                        <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-accent-cyan">
                          <s.icon className="h-3.5 w-3.5" /> {s.title}
                        </p>
                        <p className="mt-2 text-sm leading-relaxed text-ink-muted">{content}</p>
                      </div>
                    );
                  })}
                </div>

                <div className="space-y-4">
                  {open.caseStudy.architecture && (
                    <div>
                      <p className="mb-2 flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-ink-faint">
                        <Waypoints className="h-3.5 w-3.5 text-accent-cyan" /> Architecture
                      </p>
                      <ArchitectureDiagram kind={open.caseStudy.architecture} />
                    </div>
                  )}

                  <div>
                    <p className="mb-2 font-mono text-[11px] uppercase tracking-wider text-ink-faint">
                      <FolderGit2 className="mr-1 inline h-3.5 w-3.5 text-accent-cyan" /> Technologies
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {open.technologies.map((t) => (
                        <span key={t} className="chip">{t}</span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 pt-2">
                    <a
                      href={open.github || site.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn border border-white/15 bg-white/[0.03] text-white hover:bg-white/[0.07]"
                    >
                      <Github className="h-4 w-4" /> View on GitHub
                    </a>
                    {open.demo && (
                      <a
                        href={open.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn bg-white text-base hover:bg-white/90"
                      >
                        <ExternalLink className="h-4 w-4" /> Live Demo
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Section>
  );
}
