"use client";

import { BookOpen, Award, Briefcase, Wrench, Zap, Rocket } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { milestones } from "@/data/timeline";

const catIcon = {
  Learning: BookOpen,
  Certification: Award,
  Simulation: Briefcase,
  Build: Wrench,
  Event: Zap,
};

const catColor = {
  Learning: "#22d3ee",
  Certification: "#4ade80",
  Simulation: "#3b82f6",
  Build: "#a78bfa",
  Event: "#fbbf24",
};

export function Journey() {
  return (
    <Section
      id="journey" number="05"
      label="EXPERIENCE / JOURNEY"
      title={
        <>
          My <span className="text-gradient">Journey</span>
        </>
      }
      intro="A chronological map of milestones, derived from real certification dates and activity — nothing fabricated."
    >
      <div className="relative">
        {/* vertical line */}
        <div className="absolute left-[19px] top-0 bottom-0 w-px bg-gradient-to-b from-accent-cyan/40 via-white/10 to-transparent sm:left-1/2 sm:-translate-x-1/2" />

        <div className="space-y-8">
          {milestones.map((m, i) => {
            const Icon = catIcon[m.category as keyof typeof catIcon] ?? Rocket;
            const color = catColor[m.category as keyof typeof catColor] ?? "#22d3ee";
            const left = i % 2 === 0;
            return (
              <Reveal key={m.id} delay={i * 0.04}>
                <div
                  className={`relative flex flex-col gap-3 pl-14 sm:w-1/2 sm:pl-0 ${
                    left
                      ? "sm:mr-auto sm:pr-12 sm:text-right"
                      : "sm:ml-auto sm:pl-12"
                  }`}
                >
                  {/* node */}
                  <div
                    className={`absolute left-[11px] top-1 flex h-4 w-4 items-center justify-center rounded-full border sm:left-auto ${
                      left ? "sm:-right-2" : "sm:-left-2"
                    }`}
                    style={{ borderColor: color, background: "#0c0d0f" }}
                  >
                    <span className="h-1.5 w-1.5 rounded-full" style={{ background: color }} />
                  </div>

                  <div className="glass rounded-2xl p-5">
                    <div className={`flex items-center gap-2 ${left ? "sm:justify-end" : ""}`}>
                      <span className="chip font-mono">
                        <Icon className="h-3 w-3" style={{ color }} />
                        {m.dateLabel}
                      </span>
                      <span className="chip">{m.tag}</span>
                    </div>
                    <p className="mt-3 font-display text-lg font-semibold text-white">
                      {m.title}
                    </p>
                    <p className={`mt-1.5 text-sm leading-relaxed text-ink-muted ${left ? "sm:text-right" : ""}`}>
                      {m.detail}
                    </p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>

      <Reveal>
        <p className="mt-10 flex items-center justify-center gap-2 font-mono text-xs text-ink-faint">
          <Rocket className="h-3.5 w-3.5 text-accent-green" /> currently building — next milestone
        </p>
      </Reveal>
    </Section>
  );
}
