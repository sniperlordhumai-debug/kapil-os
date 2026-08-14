"use client";

import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

interface SectionProps {
  id: string;
  label?: string;
  title?: ReactNode;
  intro?: string;
  number?: string;
  children: ReactNode;
  className?: string;
}

export function Section({ id, label, title, intro, number, children, className = "" }: SectionProps) {
  return (
    <section id={id} className={`relative scroll-mt-24 py-20 sm:py-28 ${className}`}>
      {/* faint big module number watermark */}
      {number && (
        <span
          aria-hidden
          className="pointer-events-none absolute right-4 top-10 select-none font-display text-[7rem] font-bold leading-none text-white/[0.025] sm:text-[11rem]"
        >
          {number}
        </span>
      )}
      <div className="container-x">
        {(label || title) && (
          <Reveal>
            <header className="mb-10 sm:mb-14">
              {label && (
                <p className="section-label mb-3 flex items-center gap-3">
                  <span className="inline-block h-px w-8 bg-accent-cyan/60" />
                  {label}
                </p>
              )}
              {title && (
                <h2 className="font-display text-3xl font-semibold tracking-tight text-white sm:text-5xl">
                  {title}
                </h2>
              )}
              {intro && (
                <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-muted">
                  {intro}
                </p>
              )}
            </header>
          </Reveal>
        )}
        {children}
      </div>
    </section>
  );
}
