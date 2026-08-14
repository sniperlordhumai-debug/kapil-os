"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import {
  ArrowRight, Download, ExternalLink, Github, MapPin, Cpu, Sparkles,
  Award, FolderGit2, GraduationCap, Zap, Terminal, Star,
} from "lucide-react";
import { site } from "@/data/site";
import { projects } from "@/data/projects";
import { certificates } from "@/data/certificates";
import { skillCategories } from "@/data/skills";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { StatusPill } from "@/components/ui/StatusPill";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { scrollToId } from "@/components/layout/CommandPalette";

// Lazy-load the real-time 3D avatar so Three.js doesn't weigh down initial load.
const Avatar3D = dynamic(() => import("./Avatar3D"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent-cyan/40 border-t-accent-cyan" />
    </div>
  ),
});

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.15 } },
};
const item = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } },
};

// Real stats drawn from the bundled data
const stats = [
  { icon: Award, value: certificates.length + "+", label: "Certifications" },
  { icon: FolderGit2, value: projects.length, label: "Projects building" },
  { icon: GraduationCap, value: skillCategories.length, label: "Skill areas" },
];

// Tech stack marquee (substring of skills for the ticker)
const marqueeTags = [
  "Python", "TypeScript", "C++", "Java", "JavaScript", "React", "Next.js",
  "Generative AI", "AI Agents", "REST APIs", "AWS", "NVIDIA Jetson", "Git",
  "Machine Learning", "Data Analytics", "HTML", "CSS", "OOP", "DSA",
];

function Typewriter() {
  const lines = [
    "> build intelligence",
    "> ship software",
    "> automate everything",
    "> learn by building",
  ];
  const [text, setText] = useState("");
  const [li, setLi] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) {
      setText(lines[0]);
      return;
    }
    const full = lines[li];
    let i = 0;
    const id = setInterval(() => {
      i++;
      setText(full.slice(0, i));
      if (i >= full.length) {
        clearInterval(id);
        setTimeout(() => setLi((l) => (l + 1) % lines.length), 1600);
      }
    }, 45);
    return () => clearInterval(id);
  }, [li, reduce, lines]);

  return (
    <span>
      <span className="text-accent-cyan">{">"}</span>{" "}
      {text}
      <span className="term-cursor" />
    </span>
  );
}

export function Hero() {
  const reduce = useReducedMotion();

  return (
    <section id="home" className="relative flex min-h-screen items-center overflow-hidden pt-24 pb-20">
      {/* Hero-specific aurora + grid depth */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="aurora-blob left-1/2 top-[-6rem] h-[30rem] w-[44rem] -translate-x-1/2 bg-accent-cyan/[0.12]" />
        <div className="aurora-blob bottom-[-4rem] left-[-6rem] h-[24rem] w-[24rem] bg-accent-blue/[0.12]" style={{ animationDelay: "-4s" }} />
        <div className="aurora-blob right-[-6rem] top-1/4 h-[22rem] w-[22rem] bg-accent-green/[0.09]" style={{ animationDelay: "-8s" }} />
        {/* sweeping light beam */}
        <div className="beam left-0" />
      </div>

      <div className="container-x relative grid items-center gap-14 lg:grid-cols-[1.15fr_0.85fr] lg:gap-10">
        {/* ===================== LEFT ===================== */}
        <motion.div variants={container} initial="hidden" animate="show" className="relative">
          <motion.div variants={item} className="flex flex-wrap items-center gap-2">
            <StatusPill dot tone="green">SYSTEM ONLINE</StatusPill>
            <span className="chip font-mono">
              <MapPin className="h-3.5 w-3.5 text-accent-cyan" />
              {site.location.toUpperCase()}
            </span>
            <span className="chip font-mono hidden sm:inline-flex">
              <Zap className="h-3.5 w-3.5 text-accent-green" /> AI + SOFTWARE
            </span>
          </motion.div>

          <motion.h1
            variants={item}
            className="mt-7 font-display text-[2.7rem] font-semibold leading-[1.04] tracking-tight text-white sm:text-6xl lg:text-[4.6rem]"
          >
            {site.tagline.split(".").map((part, i) => (
              <span key={i} className="block">
                {i === 0 ? (
                  <>
                    {part}
                    <span className="text-gradient">.</span>
                  </>
                ) : (
                  part
                )}
              </span>
            ))}
          </motion.h1>

          <motion.p variants={item} className="mt-5 font-mono text-sm tracking-wide text-ink-muted sm:text-base">
            <Typewriter />
          </motion.p>

          <motion.p variants={item} className="mt-4 max-w-xl text-base leading-relaxed text-ink-muted">
            {site.shortBio}
          </motion.p>

          <motion.div variants={item} className="mt-9 flex flex-wrap items-center gap-3">
            <MagneticButton
              href="#"
              onClick={() => scrollToId("projects")}
              ariaLabel="Explore my work"
              className="btn bg-white text-base shadow-glow hover:bg-white/90"
            >
              Explore My Work <ArrowRight className="h-4 w-4" />
            </MagneticButton>
            <MagneticButton
              href={site.resumePath}
              download
              ariaLabel="Download resume"
              className="btn border border-white/15 bg-white/[0.03] text-white hover:bg-white/[0.07]"
            >
              <Download className="h-4 w-4" /> Download Resume
            </MagneticButton>
          </motion.div>

          <motion.div variants={item} className="mt-5">
            <a
              href={site.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-ink-muted transition-colors hover:text-accent-cyan"
            >
              <Github className="h-4 w-4" /> View GitHub <ExternalLink className="h-3.5 w-3.5" /> {site.githubHandle}
            </a>
          </motion.div>

          {/* Live stats row */}
          <motion.div variants={item} className="mt-9 grid max-w-md grid-cols-3 gap-3">
            {stats.map((s) => (
              <div key={s.label} className="glass rounded-xl p-3.5">
                <s.icon className="h-4 w-4 text-accent-cyan" />
                <p className="mt-1.5 font-display text-2xl font-semibold text-white">{s.value}</p>
                <p className="text-[11px] text-ink-muted">{s.label}</p>
              </div>
            ))}
          </motion.div>

          {/* terminal status */}
          <motion.div variants={item} className="mt-6 max-w-md">
            <div className="glass rounded-xl p-3.5 font-mono text-xs leading-relaxed">
              <div className="mb-2 flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-green-400/70" />
                <span className="ml-2 text-ink-faint">kapil@os:~</span>
              </div>
              <p className="text-ink-muted">
                <span className="text-accent-green">$</span> whoami
              </p>
              <p className="text-white">
                AI/ML student building <span className="text-accent-cyan">intelligent software</span>
                <span className="term-cursor" />
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* ===================== RIGHT ===================== */}
        <motion.div
          initial={{ opacity: 0, y: 28, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.85, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto w-full max-w-sm"
        >
          {/* Animated gradient ring behind portrait */}
          <div className="absolute -inset-6 -z-10">
            <div
              className="h-full w-full rounded-[2.5rem] opacity-40 blur-2xl"
              style={{ background: "conic-gradient(from 180deg, #22d3ee, #3b82f6, #4ade80, #22d3ee)" }}
              aria-hidden
            />
          </div>

          <div className="glass border-glow spotlight-card relative overflow-hidden rounded-3xl p-4">
            <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-accent-cyan/15 blur-3xl" />

            <div className="relative mx-auto aspect-square w-full max-w-[280px]">
              {/* Real-time 3D circular avatar (error-safe: falls back to the photo) */}
              <div className="absolute inset-0">
                <ErrorBoundary
                  fallback={
                    <img
                      src={site.portraitPath}
                      alt={`Portrait of ${site.name}, ${site.role}`}
                      className="h-full w-full rounded-full object-cover object-top"
                    />
                  }
                >
                  <Avatar3D />
                </ErrorBoundary>
              </div>
              {/* scanline / status bar */}
              <div className="absolute inset-x-0 top-0 flex items-center justify-between px-2">
                <span className="flex items-center gap-1.5 rounded-full bg-black/50 px-2 py-1 font-mono text-[10px] text-accent-green backdrop-blur">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent-green animate-pulse" /> 3D·LIVE
                </span>
              </div>
            </div>

            {/* metadata */}
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-display text-lg font-semibold text-white">{site.name.toUpperCase()}</p>
                  <p className="font-mono text-[11px] tracking-widest text-accent-cyan">AI / ML</p>
                </div>
                <StatusPill dot tone="green">{site.status}</StatusPill>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-lg border border-white/[0.07] bg-white/[0.02] p-2.5">
                  <p className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-ink-faint">
                    <Cpu className="h-3 w-3" /> Focus
                  </p>
                  <p className="mt-1 text-sm font-medium text-white">{site.focus}</p>
                </div>
                <div className="rounded-lg border border-white/[0.07] bg-white/[0.02] p-2.5">
                  <p className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-ink-faint">
                    <MapPin className="h-3 w-3" /> Location
                  </p>
                  <p className="mt-1 text-sm font-medium text-white">{site.location.split(",")[0]}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Floating badges */}
          <motion.div
            className="absolute -right-2 -top-3"
            animate={reduce ? {} : { y: [0, -9, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <StatusPill dot tone="blue">
              <Sparkles className="h-3 w-3 text-accent-blue" /> open to opportunities
            </StatusPill>
          </motion.div>
          <motion.div
            className="absolute -left-3 bottom-20"
            animate={reduce ? {} : { y: [0, 9, 0] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <span className="chip"><Terminal className="h-3 w-3 text-accent-cyan" /> clean code</span>
          </motion.div>
          <motion.div
            className="absolute -right-4 bottom-6"
            animate={reduce ? {} : { y: [0, -7, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          >
            <span className="chip"><Star className="h-3 w-3 text-accent-green" /> 15+ certs</span>
          </motion.div>
        </motion.div>
      </div>

      {/* Tech marquee strip */}
      <div className="absolute inset-x-0 bottom-0 border-t border-white/[0.06] py-3.5 backdrop-blur-sm">
        <div className="flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <div className="flex shrink-0 animate-[marquee_30s_linear_infinite] items-center gap-8 pr-8">
            {[...marqueeTags, ...marqueeTags].map((t, i) => (
              <span key={i} className="flex items-center gap-2 whitespace-nowrap font-mono text-xs uppercase tracking-widest text-ink-faint">
                <span className="h-1 w-1 rounded-full bg-accent-cyan/60" /> {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="sr-only">{skillCategories.length}</div>
    </section>
  );
}
