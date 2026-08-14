"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

const bootSteps = [
  "Initializing modules",
  "Loading skills",
  "Loading projects",
  "Loading certificates",
  "Loading journey",
  "Warming up assistant",
];

export function BootScreen({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0);
  const [completed, setCompleted] = useState(0);
  const reduce = useReducedMotion();

  // Drive progress 0 -> 100 smoothly over ~1.8s
  useEffect(() => {
    if (reduce) {
      setProgress(100);
      setCompleted(bootSteps.length);
      const t = setTimeout(onDone, 150);
      return () => clearTimeout(t);
    }
    const duration = 1800;
    const start = performance.now();
    let raf = 0;
    function tick(now: number) {
      const t = Math.min(1, (now - start) / duration);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - t, 3);
      const p = Math.round(eased * 100);
      setProgress(p);
      // map progress to completed steps
      const stepsDone = Math.min(bootSteps.length, Math.floor(t * bootSteps.length));
      setCompleted(stepsDone);
      if (t < 1) raf = requestAnimationFrame(tick);
      else {
        setCompleted(bootSteps.length);
        setTimeout(onDone, 350);
      }
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onDone, reduce]);

  const showLines = Math.max(1, Math.min(bootSteps.length, Math.floor((progress / 100) * bootSteps.length) + 1));

  return (
    <motion.div
      className="boot-overlay fixed inset-0 z-[100] flex items-center justify-center bg-base px-6"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      aria-live="polite"
    >
      {/* subtle grid backdrop */}
      <div aria-hidden className="grid-bg pointer-events-none absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,black,transparent)]" />
      {/* faint glow */}
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-cyan/[0.07] blur-[100px]" />

      <div className="relative flex w-full max-w-sm flex-col items-center text-center font-mono">
        {/* Logo mark */}
        <motion.div
          className="relative mb-6 flex h-20 w-20 items-center justify-center"
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* spinning dashed ring */}
          <motion.div
            className="absolute inset-0 rounded-full border border-accent-cyan/40"
            animate={reduce ? {} : { rotate: 360 }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "linear" }}
            style={{ borderTopColor: "#22d3ee", borderWidth: 2 }}
            aria-hidden
          />
          {/* inner core */}
          <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-surface shadow-glow">
            <span className="font-display text-2xl font-bold text-accent-cyan">
              {"</>"}
            </span>
          </div>
        </motion.div>

        {/* Wordmark */}
        <p className="mb-1 text-sm tracking-[0.4em] text-white">
          KAPIL<span className="text-accent-cyan">.</span>OS
        </p>
        <p className="mb-8 text-[10px] uppercase tracking-[0.3em] text-ink-faint">
          initializing system
        </p>

        {/* Progress bar */}
        <div className="mb-8 w-full">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-accent-cyan to-accent-blue"
              style={{ width: `${progress}%` }}
              transition={{ ease: "linear", duration: 0.05 }}
            />
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-widest text-ink-faint">loading modules</span>
            <span className="font-display text-sm font-semibold text-accent-cyan">{progress}%</span>
          </div>
        </div>

        {/* Boot lines */}
        <div className="w-full space-y-1.5 text-left text-xs">
          {bootSteps.slice(0, showLines).map((line, i) => {
            const isDone = i < completed;
            const isCurrent = i === completed;
            return (
              <motion.p
                key={line}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-ink-muted"
              >
                <span
                  className={`flex h-3.5 w-3.5 items-center justify-center rounded-full text-[9px] font-bold ${
                    isDone
                      ? "bg-accent-green/20 text-accent-green"
                      : "border border-white/15 text-transparent"
                  }`}
                >
                  ✓
                </span>
                <span className={isCurrent ? "text-white" : isDone ? "text-ink-muted" : "text-ink-faint"}>
                  {line}
                </span>
                {isCurrent && <span className="term-cursor" />}
              </motion.p>
            );
          })}
        </div>

        {/* Skip */}
        <button
          onClick={onDone}
          className="mt-8 text-xs text-ink-faint underline-offset-4 transition-colors hover:text-ink-muted hover:underline"
          aria-label="Skip system initialization"
        >
          SKIP →
        </button>
      </div>
    </motion.div>
  );
}
