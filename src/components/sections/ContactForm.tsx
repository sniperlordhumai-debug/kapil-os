"use client";

import { useRef, useState } from "react";
import { Send, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { VoiceRecorder, type VoiceResult } from "@/components/ui/VoiceRecorder";
import { VideoRecorder, type VideoResult } from "@/components/ui/VideoRecorder";

const LIMITS = { nameMax: 80, emailMax: 254, messageMax: 2000 };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

interface FormState {
  status: "idle" | "sending" | "success" | "error";
  message: string;
}

export function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [state, setState] = useState<FormState>({ status: "idle", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [voice, setVoice] = useState<VoiceResult | null>(null);
  const [video, setVideo] = useState<VideoResult | null>(null);
  const [lastName, setLastName] = useState("");
  const honeypotRef = useRef<HTMLInputElement>(null);
  const turnstileKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "";

  function validate(): boolean {
    const e: Record<string, string> = {};
    const name = form.name.trim();
    const email = form.email.trim();
    const message = form.message.trim();

    if (name.length < 2) e.name = "Please enter your name.";
    if (name.length > LIMITS.nameMax) e.name = `Name must be under ${LIMITS.nameMax} characters.`;
    if (!EMAIL_RE.test(email)) e.email = "Please enter a valid email address.";
    if (email.length > LIMITS.emailMax) e.email = "Email is too long.";
    if (message.length < 10 && !voice && !video)
      e.message = "Please write a message or add a voice/video note.";
    if (message.length > LIMITS.messageMax) e.message = `Message must be under ${LIMITS.messageMax} characters.`;
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function blobToBase64(blob: Blob): Promise<string> {
    const buf = await blob.arrayBuffer();
    const bytes = new Uint8Array(buf);
    let binary = "";
    for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
    return btoa(binary);
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (state.status === "sending") return;
    if (!validate()) return;

    setState({ status: "sending", message: "" });
    const payload: Record<string, string> = {
      name: form.name,
      email: form.email,
      message: form.message,
      // Honeypot — this field is hidden from humans; bots auto-fill it.
      website: honeypotRef.current?.value ?? "",
    };
    if (voice && voice.blob && voice.blob.size > 0) {
      try {
        payload.audioData = await blobToBase64(voice.blob);
        payload.audioName = voice.name;
      } catch {
        // ignore if base64 fails
      }
    }
    if (video && video.blob && video.blob.size > 0) {
      try {
        payload.videoData = await blobToBase64(video.blob);
        payload.videoName = video.name;
      } catch {
        // ignore if base64 fails
      }
    }
    if (turnstileKey && typeof window !== "undefined") {
      const w = window as unknown as {
        turnstile?: { getResponse?: () => string };
      };
      const token = w.turnstile?.getResponse?.() ?? "";
      payload.turnstileToken = token;
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string; message?: string };
      if (res.ok && data.ok) {
        setLastName(form.name.trim());
        setState({ status: "success", message: data.message || "Message sent. Thank you!" });
        setForm({ name: "", email: "", message: "" });
        setVoice(null);
        setVideo(null);
      } else {
        setState({ status: "error", message: data.error || "Something went wrong. Please try again." });
      }
    } catch {
      setState({ status: "error", message: "Network error. Please try again." });
    }
  }

  const inputCls =
    "w-full rounded-xl border border-white/10 bg-black/30 px-3.5 py-3 text-sm text-white placeholder:text-ink-faint focus:outline-none focus:border-accent-cyan/50 transition-colors";

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {/* Honeypot field — invisible to humans, catches bots. */}
      <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input
          ref={honeypotRef}
          id="website"
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="cf-name" className="mb-1.5 block text-xs font-medium text-ink-muted">
            Name
          </label>
          <input
            id="cf-name"
            type="text"
            maxLength={LIMITS.nameMax}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Your name"
            className={inputCls}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "cf-name-err" : undefined}
          />
          {errors.name && (
            <p id="cf-name-err" className="mt-1 text-xs text-red-400">{errors.name}</p>
          )}
        </div>
        <div>
          <label htmlFor="cf-email" className="mb-1.5 block text-xs font-medium text-ink-muted">
            Email
          </label>
          <input
            id="cf-email"
            type="email"
            maxLength={LIMITS.emailMax}
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="you@example.com"
            className={inputCls}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "cf-email-err" : undefined}
          />
          {errors.email && (
            <p id="cf-email-err" className="mt-1 text-xs text-red-400">{errors.email}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="cf-message" className="mb-1.5 block text-xs font-medium text-ink-muted">
          Message
        </label>
        <textarea
          id="cf-message"
          rows={5}
          maxLength={LIMITS.messageMax}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          placeholder="Tell me about your project, role or idea..."
          className={`${inputCls} resize-y`}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "cf-message-err" : undefined}
        />
        <div className="mt-1 flex items-center justify-between">
          <span>
            {errors.message ? (
              <span id="cf-message-err" className="text-xs text-red-400">{errors.message}</span>
            ) : (
              <span className="text-[10px] text-ink-faint">All fields are validated server-side too.</span>
            )}
          </span>
          <span className="font-mono text-[10px] text-ink-faint">
            {form.message.length}/{LIMITS.messageMax}
          </span>
        </div>
      </div>

      {/* Optional voice message */}
      <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-3">
        <p className="mb-2 text-xs font-medium text-ink-muted">Or send a voice message</p>
        <VoiceRecorder onResult={setVoice} />
      </div>

      {/* Optional video message */}
      <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-3">
        <p className="mb-2 text-xs font-medium text-ink-muted">Or send a video message</p>
        <VideoRecorder onResult={setVideo} />
      </div>

      {/* Turnstile widget renders only when a public site key is configured. */}
      {turnstileKey ? (
        <div className="[&>div]:mx-auto [&>div]:!w-auto" data-turnstile-sitekey={turnstileKey} data-theme="dark" />
      ) : null}

      <button
        type="submit"
        disabled={state.status === "sending"}
        className="btn w-full bg-white text-base transition-colors hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {state.status === "sending" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Sending...
          </>
        ) : (
          <>
            <Send className="h-4 w-4" /> Send Message
          </>
        )}
      </button>

      {state.status === "success" && (
        <div
          role="status"
          className="rounded-xl border border-accent-green/30 bg-gradient-to-br from-accent-green/[0.08] to-transparent p-5"
        >
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-green/15 text-accent-green">
              <CheckCircle2 className="h-5 w-5" />
            </span>
            <div>
              <p className="font-display font-semibold text-white">Message received!</p>
              <p className="text-sm text-ink-muted">
                Thanks{lastName ? `, ${lastName.split(" ")[0]}` : ""} — I&apos;ve got your message and
                will get back to you soon.
              </p>
            </div>
          </div>
          <p className="mt-3 border-t border-white/[0.06] pt-3 text-xs text-ink-faint">
            Usually within 24–48 hours. For anything urgent, reach me directly via email or LinkedIn.
          </p>
        </div>
      )}
      {state.status === "error" && (
        <p role="alert" className="flex items-center gap-2 rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-300">
          <AlertCircle className="h-4 w-4 shrink-0" /> {state.message}
        </p>
      )}
    </form>
  );
}
