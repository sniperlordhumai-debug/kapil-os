"use client";

import { Github, Linkedin, Mail, ArrowUp } from "lucide-react";
import { site } from "@/data/site";

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/[0.07] py-12">
      <div className="container-x">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="text-center sm:text-left">
            <p className="font-display text-lg font-semibold text-white">
              {site.name.toUpperCase()}
            </p>
            <p className="mt-1 font-mono text-xs tracking-wide text-ink-faint">
              AI/ML • SOFTWARE • BUILDING
            </p>
            <p className="mt-3 text-sm text-ink-muted italic">
              &quot;Built with curiosity and code.&quot;
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={site.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-ink-muted transition-colors hover:text-white hover:border-white/25"
            >
              <Github className="h-4.5 w-4.5" />
            </a>
            <a
              href={site.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-ink-muted transition-colors hover:text-white hover:border-white/25"
            >
              <Linkedin className="h-4.5 w-4.5" />
            </a>
            <a
              href={`mailto:${site.email}`}
              aria-label="Email"
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-ink-muted transition-colors hover:text-white hover:border-white/25"
            >
              <Mail className="h-4.5 w-4.5" />
            </a>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              aria-label="Back to top"
              className="ml-2 flex h-10 w-10 items-center justify-center rounded-lg border border-accent-cyan/30 bg-accent-cyan/10 text-accent-cyan transition-colors hover:bg-accent-cyan/20"
            >
              <ArrowUp className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-white/[0.06] pt-6 text-xs text-ink-faint sm:flex-row">
          <p>© {site.copyrightYear} Kapil Kumar. All rights reserved.</p>
          <p className="font-mono">
            <span className="text-accent-green">✓</span> SYSTEM ONLINE — KAPIL.OS v1.0
          </p>
        </div>
      </div>
    </footer>
  );
}
