"use client";

import { useEffect, useState } from "react";
import { Menu, X, Download, Command, Terminal } from "lucide-react";
import { site, navItems } from "@/data/site";
import { CommandPalette, scrollToId } from "./CommandPalette";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [active, setActive] = useState<string>("home");

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 24);
      // Scroll-spy: find the section currently in view
      const ids = navItems.map((n) => n.id);
      let current = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 120) {
          current = id;
        }
      }
      setActive(current);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((p) => !p);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function nav(id: string) {
    setMobileOpen(false);
    scrollToId(id);
  }

  const navLinkCls = (id: string) =>
    `relative text-[13px] font-medium tracking-wide transition-colors hover:text-white ${
      active === id ? "text-accent-cyan" : "text-ink-muted"
    }`;

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "border-b border-white/[0.07] bg-base/80 backdrop-blur-xl"
            : "bg-transparent"
        }`}
      >
        <nav className="container-x flex h-16 items-center justify-between" aria-label="Main">
          <button
            onClick={() => nav("home")}
            className="flex items-center gap-2 font-mono text-sm font-semibold tracking-wide text-white"
            aria-label="Go to home"
          >
            <Terminal className="h-4 w-4 text-accent-cyan" />
            KAPIL<span className="text-accent-cyan">.</span>OS
          </button>

          <div className="hidden items-center gap-7 lg:flex">
            {navItems.map((item) => (
              <button key={item.id} onClick={() => nav(item.id)} className={navLinkCls(item.id)}>
                <span className="relative inline-block">
                  {item.label}
                  {active === item.id && (
                    <span className="absolute -bottom-1.5 left-0 h-0.5 w-full rounded-full bg-accent-cyan" />
                  )}
                </span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPaletteOpen(true)}
              className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1.5 text-xs text-ink-muted transition-colors hover:text-white"
              aria-label="Open command palette (Ctrl+K)"
            >
              <Command className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Ctrl</span>
              <span className="hidden sm:inline text-ink-faint">K</span>
            </button>

            <a
              href={site.resumePath}
              download
              className="btn hidden bg-white text-base transition-colors hover:bg-white/90 sm:inline-flex"
            >
              <Download className="h-4 w-4" />
              Download Resume
            </a>

            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-white lg:hidden"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="border-t border-white/[0.07] bg-base/95 backdrop-blur-xl lg:hidden">
            <div className="container-x flex flex-col py-4">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => nav(item.id)}
                  className={`flex items-center justify-between border-b border-white/5 py-3.5 text-left text-sm transition-colors hover:text-white ${
                    active === item.id ? "text-accent-cyan" : "text-ink-muted"
                  }`}
                >
                  <span>{item.label}</span>
                  <span className="font-mono text-xs text-accent-cyan/60">→</span>
                </button>
              ))}
              <a
                href={site.resumePath}
                download
                className="btn mt-4 bg-white text-base hover:bg-white/90"
              >
                <Download className="h-4 w-4" />
                Download Resume
              </a>
            </div>
          </div>
        )}
      </header>

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </>
  );
}
