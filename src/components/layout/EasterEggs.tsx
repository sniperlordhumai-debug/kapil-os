"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const SUDO = "sudo";
const RESPONSES = [
  { title: "Permission granted.", body: "You already have root access to my projects. Let's build." },
  { title: "Access denied — not needed.", body: "My entire workspace is public. No sudo required." },
  { title: "$ whoami → Kapil Kumar", body: "Granted. This OS is running at full trust." },
];

// Classic Konami code: ↑ ↑ ↓ ↓ ← → ← → B A
const KONAMI = [
  "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
  "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight",
  "b", "a",
];

export function EasterEggs() {
  const [toast, setToast] = useState<{ title: string; body: string } | null>(null);
  const typedRef = useRef("");
  const konamiIdx = useRef(0);
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.target as HTMLElement)?.tagName === "INPUT" || (e.target as HTMLElement)?.tagName === "TEXTAREA") {
        return;
      }
      const key = e.key.length === 1 ? e.key.toLowerCase() : "";
      // sudo
      typedRef.current = (typedRef.current + key).slice(-SUDO.length);
      if (typedRef.current === SUDO) {
        typedRef.current = "";
        trigger(RESPONSES[Math.floor(Math.random() * RESPONSES.length)]);
        return;
      }
      // konami
      const expect = KONAMI[konamiIdx.current];
      if (e.key === expect) {
        konamiIdx.current += 1;
        if (konamiIdx.current === KONAMI.length) {
          konamiIdx.current = 0;
          trigger({ title: "KONAMI ACTIVATED", body: "Hidden command entered. +1 developer energy unlocked." });
        }
      } else {
        konamiIdx.current = e.key === "ArrowUp" ? 1 : 0;
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function trigger(t: { title: string; body: string }) {
    setToast(t);
    if (timeout.current) clearTimeout(timeout.current);
    timeout.current = setTimeout(() => setToast(null), 3200);
  }

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          className="fixed bottom-6 left-1/2 z-[95] w-[calc(100%-2rem)] max-w-sm -translate-x-1/2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          role="status"
          aria-live="polite"
        >
          <div className="glass-strong flex items-start gap-3 rounded-xl p-4">
            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent-cyan/10 text-accent-cyan">
              <TerminalMark />
            </span>
            <div>
              <p className="font-mono text-sm font-semibold text-white">{toast.title}</p>
              <p className="mt-1 text-xs leading-relaxed text-ink-muted">{toast.body}</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function TerminalMark() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="4 17 10 11 4 5" />
      <line x1="12" y1="19" x2="20" y2="19" />
    </svg>
  );
}
