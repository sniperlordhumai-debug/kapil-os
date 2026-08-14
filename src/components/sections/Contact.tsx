"use client";

import { Mail, Phone, Github, Linkedin, ArrowRight, Terminal } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { ContactForm } from "./ContactForm";
import { site } from "@/data/site";

export function Contact() {
  return (
    <Section id="contact" number="08" label="CONTACT" title="LET'S BUILD SOMETHING.">
      <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
        <Reveal>
          <p className="max-w-xl text-base leading-relaxed text-ink-muted">
            Whether it&apos;s an AI/ML internship, a collaboration on an intelligent tool, or a
            conversation about generative AI and software — I&apos;d love to hear from you.
          </p>

          {/* Secure contact form */}
          <div className="glass mt-8 rounded-2xl p-6">
            <p className="mb-5 font-mono text-xs uppercase tracking-[0.25em] text-accent-cyan">
              Send a message
            </p>
            <ContactForm />
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="glass-strong relative overflow-hidden rounded-2xl p-8">
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-accent-cyan/10 blur-3xl" />
            <div className="font-mono text-sm">
              <p className="flex items-center gap-2 text-ink-muted">
                <span className="text-accent-green">$</span> kapil --start-conversation
              </p>
              <p className="mt-2 text-white">
                Ready to build something <span className="text-accent-cyan">intelligent</span>.
                <span className="term-cursor" />
              </p>
            </div>

            <div className="mt-8 space-y-3">
              {[
                { icon: Mail, label: "Email", value: site.email, href: `mailto:${site.email}` },
                { icon: Phone, label: "Phone", value: site.phone, href: `tel:${site.phone.replace(/\s/g, "")}` },
                { icon: Github, label: "GitHub", value: site.githubHandle, href: site.github },
                { icon: Linkedin, label: "LinkedIn", value: "kapil-kumar-931330375", href: site.linkedin },
              ].map((c) => (
                <a
                  key={c.label}
                  href={c.href}
                  target={c.href.startsWith("http") ? "_blank" : undefined}
                  rel={c.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="group flex items-center gap-4 rounded-xl border border-white/[0.08] bg-white/[0.02] p-4 transition-all hover:border-accent-cyan/30 hover:bg-white/[0.04]"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-white/[0.04] text-accent-cyan">
                    <c.icon className="h-5 w-5" />
                  </span>
                  <span className="min-w-0">
                    <span className="block font-mono text-[10px] uppercase tracking-wider text-ink-faint">
                      {c.label}
                    </span>
                    <span className="block truncate text-sm text-white">{c.value}</span>
                  </span>
                  <ArrowRight className="ml-auto h-4 w-4 shrink-0 text-ink-faint opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                </a>
              ))}
            </div>

            <MagneticButton
              href={`mailto:${site.email}`}
              ariaLabel="Start a conversation via email"
              className="btn mt-6 w-full border border-accent-cyan/30 bg-accent-cyan/10 text-accent-cyan hover:bg-accent-cyan/20"
            >
              Email Me Directly <ArrowRight className="h-4 w-4" />
            </MagneticButton>

            <div className="mt-6 space-y-2 text-xs text-ink-faint">
              <p className="flex items-center gap-2">
                <Terminal className="h-3.5 w-3.5 text-accent-cyan" /> Response time: typically within 24–48h
              </p>
              <p>Location: {site.location}</p>
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
