"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

function useClock() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

export function SystemHUD() {
  const now = useClock();
  const reduce = useReducedMotion();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 200);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const time = now
    ? now.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit", second: "2-digit" })
    : "--:--:--";
  const date = now
    ? now.toLocaleDateString(undefined, { day: "numeric", month: "short" })
    : "";

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed bottom-5 left-5 z-[45] hidden select-none items-center gap-3 rounded-xl border border-white/[0.08] bg-surface/80 px-3.5 py-2 font-mono text-[11px] text-ink-muted backdrop-blur-xl sm:flex"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.3 }}
          aria-hidden
        >
          <span className="flex items-center gap-1.5">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-green opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent-green" />
            </span>
            SYS ONLINE
          </span>
          <span className="text-ink-faint">{date}</span>
          <span className="tabular-nums text-white">{time}</span>
          <span className="text-ink-faint">IST</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
