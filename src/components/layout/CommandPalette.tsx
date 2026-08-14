"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Search, Home, User, Layers, FolderGit2, Award, GitBranch, FileText, Mail, ExternalLink, CornerDownLeft } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { navItems, site } from "@/data/site";

export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

const commandIcon: Record<string, any> = {
  home: Home,
  about: User,
  skills: Layers,
  projects: FolderGit2,
  certificates: Award,
  journey: GitBranch,
  github: GitBranch,
  resume: FileText,
  contact: Mail,
};

export function CommandPalette({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const commands = useMemo(() => {
    const items: Array<{ id: string; label: string; group: string; run: () => void }> =
      navItems.map((n) => ({
        id: n.id,
        label: n.label,
        group: "Navigate",
        run: () => {
          scrollToId(n.id);
          onClose();
        },
      }));
    items.push({
      id: "github",
      label: "GitHub",
      group: "Navigate",
      run: () => {
        window.open(site.github, "_blank");
        onClose();
      },
    });
    items.push({
      id: "resume",
      label: "Download Resume",
      group: "Actions",
      run: () => {
        window.open(site.resumePath, "_blank");
        onClose();
      },
    });
    items.push({
      id: "contact",
      label: "Email Kapil",
      group: "Actions",
      run: () => {
        window.location.href = `mailto:${site.email}`;
        onClose();
      },
    });
    return items;
  }, [onClose]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter((c) => c.label.toLowerCase().includes(q));
  }, [commands, query]);

  useEffect(() => {
    if (open) {
      setQuery("");
      setActive(0);
      setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [open]);

  useEffect(() => {
    setActive(0);
  }, [query]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActive((a) => (a + 1) % filtered.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActive((a) => (a - 1 + filtered.length) % filtered.length);
      } else if (e.key === "Enter") {
        e.preventDefault();
        filtered[active]?.run();
      } else if (e.key === "Escape") {
        onClose();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, filtered, active, onClose]);

  // keep active item in view
  useEffect(() => {
    const el = listRef.current?.children[active] as HTMLElement | undefined;
    el?.scrollIntoView({ block: "nearest" });
  }, [active]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-start justify-center bg-black/60 px-4 pt-[12vh] backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label="Command palette"
        >
          <motion.div
            className="glass-strong w-full max-w-lg overflow-hidden rounded-2xl shadow-card"
            initial={{ opacity: 0, y: -16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
              <Search className="h-4 w-4 text-ink-faint" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search portfolio..."
                className="w-full bg-transparent text-sm text-white placeholder:text-ink-faint focus:outline-none"
                aria-label="Search portfolio"
              />
              <kbd className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] text-ink-faint">
                ESC
              </kbd>
            </div>

            <div ref={listRef} className="max-h-[46vh] overflow-y-auto p-2">
              {filtered.length === 0 && (
                <p className="px-3 py-6 text-center text-sm text-ink-faint">
                  No results for &quot;{query}&quot;
                </p>
              )}
              {filtered.map((c, i) => {
                const Icon = commandIcon[c.id] ?? Search;
                return (
                  <button
                    key={c.id + c.label}
                    onMouseEnter={() => setActive(i)}
                    onClick={() => c.run()}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                      i === active ? "bg-white/[0.07] text-white" : "text-ink-muted"
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0 text-accent-cyan" />
                    <span className="flex-1">{c.label}</span>
                    <span className="text-[10px] uppercase tracking-wider text-ink-faint">
                      {c.group}
                    </span>
                    {i === active && <CornerDownLeft className="h-3.5 w-3.5 text-ink-faint" />}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-4 border-t border-white/10 px-4 py-2.5 text-[11px] text-ink-faint">
              <span className="flex items-center gap-1">
                <ExternalLink className="h-3 w-3" /> Ctrl + K anywhere
              </span>
              <span className="flex items-center gap-1">↑↓ to navigate</span>
              <span className="flex items-center gap-1">↵ to select</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
