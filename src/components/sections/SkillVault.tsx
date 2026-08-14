"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Code2, Braces, Coffee, FileCode, Layout, Box, GitBranch, Cpu, Sparkles,
  Bot, MemoryStick, BarChart, Network, Plug, Gauge, Workflow, ShieldCheck,
  Cloud, Layers, Github, Microchip, X, FolderGit2, Award, ArrowRight,
} from "lucide-react";
import { skillCategories, type SkillItem } from "@/data/skills";
import { certificates } from "@/data/certificates";
import { projects } from "@/data/projects";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { TiltCard } from "@/components/ui/TiltCard";
import { scrollToId } from "@/components/layout/CommandPalette";

const iconMap: Record<string, any> = {
  code2: Code2, braces: Braces, coffee: Coffee, "file-code": FileCode, layout: Layout,
  box: Box, "git-branch": GitBranch, cpu: Cpu, sparkles: Sparkles, bot: Bot,
  "memory-stick": MemoryStick, "bar-chart": BarChart, network: Network, plug: Plug,
  gauge: Gauge, workflow: Workflow, "shield-check": ShieldCheck, cloud: Cloud,
  layers: Layers, github: Github, microchip: Microchip,
};

export function SkillVault() {
  const [activeCat, setActiveCat] = useState(skillCategories[0].id);
  const [selected, setSelected] = useState<SkillItem | null>(null);

  const category = skillCategories.find((c) => c.id === activeCat)!;

  const selectedDetail = useMemo(() => {
    if (!selected) return null;
    const relatedProjects = projects.filter((p) => selected.projects.includes(p.id));
    const relatedCerts = certificates.filter((c) => selected.certificates.includes(c.id));
    return { ...selected, relatedProjects, relatedCerts };
  }, [selected]);

  return (
    <Section
      id="skills" number="02"
      label="SKILL VAULT"
      title={
        <>
          Skill <span className="text-gradient">Vault</span>
        </>
      }
      intro="Not a list of progress bars — a vault of capabilities, each linked to the projects and certifications that prove it."
    >
      {/* Category tabs */}
      <Reveal>
        <div className="mb-8 flex flex-wrap gap-2" role="tablist" aria-label="Skill categories">
          {skillCategories.map((c) => (
            <button
              key={c.id}
              role="tab"
              aria-selected={activeCat === c.id}
              onClick={() => setActiveCat(c.id)}
              className={`rounded-xl border px-4 py-2.5 text-sm font-medium transition-all ${
                activeCat === c.id
                  ? "border-accent-cyan/40 bg-accent-cyan/10 text-accent-cyan"
                  : "border-white/10 bg-white/[0.02] text-ink-muted hover:border-white/20 hover:text-white"
              }`}
            >
              {c.label}
              <span className="ml-2 font-mono text-[10px] text-ink-faint">
                {c.skills.length}
              </span>
            </button>
          ))}
        </div>
      </Reveal>

      <div className="grid gap-6 lg:grid-cols-[1fr_0.85fr]">
        {/* Skill grid */}
        <div>
          <p className="mb-4 font-mono text-xs uppercase tracking-wider text-ink-faint">
            {category.hint}
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {category.skills.map((skill, i) => {
              const Icon = iconMap[skill.icon] ?? Code2;
              return (
                <Reveal key={skill.id} delay={i * 0.04}>
                  <TiltCard max={5}>
                  <button
                    onClick={() => setSelected(skill)}
                    className={`group spotlight-card w-full rounded-xl border p-4 text-left transition-all ${
                      selected?.id === skill.id
                        ? "border-accent-cyan/40 bg-accent-cyan/[0.06]"
                        : "border-white/[0.08] bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]"
                    }`}
                    aria-label={`View details for ${skill.name}`}
                  >
                    <div className="flex items-center justify-between">
                      <Icon className="h-5 w-5 text-accent-cyan transition-transform group-hover:scale-110" />
                      <ArrowRight className="h-4 w-4 text-ink-faint opacity-0 transition-opacity group-hover:opacity-100" />
                    </div>
                    <p className="mt-3 font-medium text-white">{skill.name}</p>
                    <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-ink-muted">
                      {skill.description}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {skill.tags.map((t) => (
                        <span key={t} className="rounded bg-white/[0.05] px-1.5 py-0.5 font-mono text-[10px] text-ink-faint">
                          {t}
                        </span>
                      ))}
                    </div>
                  </button>
                  </TiltCard>
                </Reveal>
              );
            })}
          </div>
        </div>

        {/* Detail panel */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <AnimatePresence mode="wait">
            {selectedDetail ? (
              <motion.div
                key={selectedDetail.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.25 }}
                className="glass-strong rounded-2xl p-6"
                role="region"
                aria-label={`${selectedDetail.name} details`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {(() => {
                      const Icon = iconMap[selectedDetail.icon] ?? Code2;
                      return (
                        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-cyan/10 text-accent-cyan">
                          <Icon className="h-5 w-5" />
                        </span>
                      );
                    })()}
                    <div>
                      <p className="font-display text-lg font-semibold text-white">
                        {selectedDetail.name}
                      </p>
                      <p className="font-mono text-[11px] uppercase tracking-wider text-ink-faint">
                        SKILL MODULE
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelected(null)}
                    className="rounded-lg p-1.5 text-ink-faint transition-colors hover:text-white"
                    aria-label="Close skill details"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <p className="mt-4 text-sm leading-relaxed text-ink-muted">
                  {selectedDetail.description}
                </p>

                {selectedDetail.relatedProjects.length > 0 && (
                  <div className="mt-5">
                    <p className="mb-2 flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-ink-faint">
                      <FolderGit2 className="h-3.5 w-3.5 text-accent-cyan" /> Used in
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {selectedDetail.relatedProjects.map((p) => (
                        <button
                          key={p.id}
                          onClick={() => scrollToId("projects")}
                          className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-ink-muted transition-colors hover:border-accent-cyan/40 hover:text-accent-cyan"
                        >
                          {p.title}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {selectedDetail.relatedCerts.length > 0 && (
                  <div className="mt-5">
                    <p className="mb-2 flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-ink-faint">
                      <Award className="h-3.5 w-3.5 text-accent-green" /> Related certifications
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {selectedDetail.relatedCerts.map((c) => (
                        <button
                          key={c.id}
                          onClick={() => scrollToId("certificates")}
                          className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-ink-muted transition-colors hover:border-accent-green/40 hover:text-accent-green"
                        >
                          {c.organization} — {c.title}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-6 flex flex-wrap gap-2 border-t border-white/[0.08] pt-4">
                  {selectedDetail.tags.map((t) => (
                    <span key={t} className="chip">{t}</span>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex h-full min-h-[220px] flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/[0.01] p-6 text-center"
              >
                <Layers className="h-8 w-8 text-ink-faint" />
                <p className="mt-3 text-sm text-ink-muted">
                  Select a skill to inspect its module —
                  <br />
                  projects &amp; certifications it connects to.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Section>
  );
}
