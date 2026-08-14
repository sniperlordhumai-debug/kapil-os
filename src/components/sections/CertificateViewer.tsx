"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, Award, Calendar, Building2, Layers, ShieldCheck, Check } from "lucide-react";
import type { Certificate } from "@/data/certificates";

interface Props {
  cert: Certificate | null;
  onClose: () => void;
  onNavigate: (dir: 1 | -1) => void;
}

export function CertificateViewer({ cert, onClose, onNavigate }: Props) {
  useEffect(() => {
    if (!cert) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNavigate(1);
      if (e.key === "ArrowLeft") onNavigate(-1);
    }
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [cert, onClose, onNavigate]);

  return (
    <AnimatePresence>
      {cert && (
        <motion.div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-black/80 p-3 backdrop-blur-md sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={`Certificate: ${cert.title}`}
        >
          <motion.div
            className="relative flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-surface shadow-card"
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 12 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* header */}
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <div className="flex items-center gap-3 min-w-0">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent-cyan/10 text-accent-cyan">
                  <Award className="h-4.5 w-4.5" />
                </span>
                <div className="min-w-0">
                  <p className="truncate font-display text-sm font-semibold text-white sm:text-base">
                    {cert.title}
                  </p>
                  <p className="truncate text-xs text-ink-muted">{cert.organization}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onNavigate(-1)}
                  className="hidden rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-ink-muted transition-colors hover:text-white sm:block"
                  aria-label="Previous certificate"
                >
                  ← Prev
                </button>
                <button
                  onClick={() => onNavigate(1)}
                  className="hidden rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-ink-muted transition-colors hover:text-white sm:block"
                  aria-label="Next certificate"
                >
                  Next →
                </button>
                <button
                  onClick={onClose}
                  className="rounded-lg p-2 text-ink-muted transition-colors hover:bg-white/10 hover:text-white"
                  aria-label="Close certificate viewer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* body */}
            <div className="flex flex-1 flex-col overflow-y-auto md:flex-row">
              {/* preview */}
              <div className="flex flex-1 items-center justify-center bg-black/40 p-4 md:p-6">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={cert.image}
                  alt={`Certificate of completion: ${cert.title} from ${cert.organization}`}
                  className="max-h-[46vh] w-auto rounded-lg border border-white/10 shadow-glow md:max-h-[64vh]"
                  loading="lazy"
                />
              </div>

              {/* details */}
              <div className="flex w-full flex-col gap-4 border-t border-white/10 p-5 md:w-80 md:border-l md:border-t-0">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Building2 className="h-4 w-4 text-accent-cyan" />
                    <div>
                      <p className="text-[11px] uppercase tracking-wider text-ink-faint">Issuer</p>
                      <p className="text-sm text-white">{cert.issuer}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-accent-cyan" />
                    <div>
                      <p className="text-[11px] uppercase tracking-wider text-ink-faint">Date</p>
                      <p className="text-sm text-white">{cert.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Layers className="h-4 w-4 text-accent-cyan" />
                    <div>
                      <p className="text-[11px] uppercase tracking-wider text-ink-faint">Category</p>
                      <p className="text-sm text-white">{cert.category}</p>
                    </div>
                  </div>
                </div>

                <p className="text-xs leading-relaxed text-ink-muted">{cert.description}</p>

                <div>
                  <p className="mb-2 flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-ink-faint">
                    <ShieldCheck className="h-3.5 w-3.5 text-accent-green" /> Skills demonstrated
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {cert.skills.map((s) => (
                      <span key={s} className="chip">
                        <Check className="h-3 w-3 text-accent-green" /> {s}
                      </span>
                    ))}
                  </div>
                </div>

                {cert.verificationNote && (
                  <p className="font-mono text-[10px] text-ink-faint">{cert.verificationNote}</p>
                )}

                <div className="mt-auto flex flex-col gap-2 pt-2">
                  {cert.verificationUrl ? (
                    <a
                      href={cert.verificationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn bg-white text-base hover:bg-white/90"
                    >
                      <ExternalLink className="h-4 w-4" />
                      View Certificate
                    </a>
                  ) : (
                    <p className="rounded-lg border border-dashed border-white/15 px-3 py-2 text-center text-[11px] text-ink-faint">
                      Verification link not available
                    </p>
                  )}
                  <button
                    onClick={onClose}
                    className="btn border border-white/15 bg-white/[0.03] text-white hover:bg-white/[0.07]"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
