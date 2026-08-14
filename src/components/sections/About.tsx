"use client";

import { GraduationCap, MapPin, Activity, BrainCircuit, Code2, Globe, ShieldCheck, BarChart3, Sparkles } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { StatusPill } from "@/components/ui/StatusPill";
import { site } from "@/data/site";

const interestAreas = [
  { icon: BrainCircuit, label: "AI / ML" },
  { icon: Sparkles, label: "Generative AI" },
  { icon: Code2, label: "Software" },
  { icon: Globe, label: "Web" },
  { icon: Activity, label: "Automation" },
  { icon: BarChart3, label: "Data" },
];

const certDomains = [
  "AI",
  "Software Engineering",
  "Cloud",
  "Cybersecurity",
  "Data Analytics",
  "Generative AI",
];

export function About() {
  return (
    <Section
      id="about" number="01"
      label="ABOUT ME"
      title="WHO IS KAPIL?"
      intro="A B.Tech CSE (AI & ML) student at Parul University who enjoys turning ideas into practical software — learning by building."
    >
      <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:gap-14">
        {/* Left: biography */}
        <Reveal>
          <div className="space-y-5 text-base leading-relaxed text-ink-muted">
            <p>
              I&apos;m a B.Tech CSE student specializing in{" "}
              <span className="text-white">Artificial Intelligence &amp; Machine Learning</span> at{" "}
              <span className="text-white">Parul University, Vadodara</span>. I focus on building
              practical software, intelligent tools and experimental products.
            </p>
            <p>
              My interests span AI, ML, Generative AI, AI agents, automation, web development and
              software engineering. I learn by building — and I&apos;ve backed that up with
              industry-oriented simulations and certifications across AI, software engineering,
              cloud, cybersecurity, data analytics and generative AI.
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              {interestAreas.map((a) => (
                <span key={a.label} className="chip">
                  <a.icon className="h-3.5 w-3.5 text-accent-cyan" />
                  {a.label}
                </span>
              ))}
            </div>

            <div className="mt-6 rounded-xl border border-white/[0.08] bg-white/[0.02] p-5">
              <p className="mb-3 font-mono text-xs uppercase tracking-[0.25em] text-ink-faint">
                Simulation & Certification Domains
              </p>
              <div className="flex flex-wrap gap-2">
                {certDomains.map((d) => (
                  <span key={d} className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-sm text-ink-muted">
                    {d}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Reveal>

        {/* Right: system profile */}
        <Reveal delay={0.1}>
          <div className="glass rounded-2xl p-6">
            <div className="mb-5 flex items-center justify-between">
              <p className="font-mono text-xs uppercase tracking-[0.25em] text-accent-cyan">
                SYSTEM PROFILE
              </p>
              <StatusPill dot tone="green">
                ACTIVE
              </StatusPill>
            </div>

            <div className="space-y-5">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent-cyan/10 text-accent-cyan">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-ink-faint">Education</p>
                  <p className="mt-0.5 text-sm font-medium text-white">B.Tech CSE (AI &amp; ML)</p>
                  <p className="text-sm text-ink-muted">Parul University, Vadodara</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent-green/10 text-accent-green">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-ink-faint">Location</p>
                  <p className="mt-0.5 text-sm font-medium text-white">{site.location.split(",")[0]}</p>
                  <p className="text-sm text-ink-muted">Open to remote &amp; opportunities</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent-blue/10 text-accent-blue">
                  <Activity className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-ink-faint">Focus</p>
                  <p className="mt-0.5 text-sm font-medium text-white">{site.focus}</p>
                  <p className="text-sm text-ink-muted">Learning through real projects</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent-cyan/10 text-accent-cyan">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-ink-faint">Status</p>
                  <p className="mt-0.5 text-sm font-medium text-white">BUILDING</p>
                  <p className="text-sm text-ink-muted">Actively developing &amp; exploring</p>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
