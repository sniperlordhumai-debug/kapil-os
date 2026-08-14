"use client";

import { FileText, Download, ExternalLink, GraduationCap, Award, FolderGit2 } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { site } from "@/data/site";

export function Resume() {
  return (
    <Section
      id="resume" number="07"
      label="RESUME"
      title={
        <>
          Resume <span className="text-gradient">Module</span>
        </>
      }
      intro="A one-page professional resume summarizing profile, education, skills, projects, certifications and activities."
    >
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Reveal>
          {/* resume preview */}
          <div className="glass relative overflow-hidden rounded-2xl">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">
              <span className="flex items-center gap-2 font-mono text-xs text-ink-muted">
                <FileText className="h-4 w-4 text-accent-cyan" /> Kapil_Kumar_Resume.pdf
              </span>
              <span className="chip">1 page</span>
            </div>
            <div className="aspect-[1/1.4] max-h-[520px] w-full overflow-hidden bg-black/30">
              <iframe
                src={`${site.resumePath}#toolbar=0`}
                title="Kapil Kumar resume preview"
                className="h-full w-full border-0"
                loading="lazy"
              />
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="space-y-4">
            <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-5">
              <p className="mb-3 font-mono text-xs uppercase tracking-wider text-ink-faint">
                At a glance
              </p>
              <ul className="space-y-3 text-sm text-ink-muted">
                <li className="flex items-start gap-3">
                  <GraduationCap className="mt-0.5 h-4 w-4 shrink-0 text-accent-cyan" />
                  B.Tech CSE (AI &amp; ML), Parul University
                </li>
                <li className="flex items-start gap-3">
                  <Award className="mt-0.5 h-4 w-4 shrink-0 text-accent-green" />
                  15+ certifications across AI, software, cloud, data, cybersecurity &amp; web
                </li>
                <li className="flex items-start gap-3">
                  <FolderGit2 className="mt-0.5 h-4 w-4 shrink-0 text-accent-blue" />
                  4 active projects in the Project Lab
                </li>
              </ul>
            </div>

            <div className="flex flex-col gap-3">
              <a
                href={site.resumePath}
                download
                className="btn bg-white text-base hover:bg-white/90"
              >
                <Download className="h-4 w-4" /> Download PDF
              </a>
              <a
                href={site.resumePath}
                target="_blank"
                rel="noopener noreferrer"
                className="btn border border-white/15 bg-white/[0.03] text-white hover:bg-white/[0.07]"
              >
                <ExternalLink className="h-4 w-4" /> View Resume
              </a>
            </div>

            <p className="rounded-xl border border-dashed border-white/10 bg-white/[0.01] p-4 text-xs leading-relaxed text-ink-faint">
              The downloadable PDF is the same professional resume provided — always in sync, no
              recreated data.
            </p>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
