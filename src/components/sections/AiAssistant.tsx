"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Bot, X, Send, CornerDownRight, Loader2, Sparkles, Mic } from "lucide-react";
import { scrollToId } from "@/components/layout/CommandPalette";

interface Message {
  role: "user" | "bot";
  text: string;
  nav?: string;
  suggestions?: string[];
}

const QUICK_QUESTIONS = [
  "Who is Kapil?",
  "What skills does he have?",
  "Show his projects",
  "Tell me about his certificates",
  "How can I contact him?",
];

const WELCOME: Message = {
  role: "bot",
  text: "Hi, I'm the KAPIL OS assistant. 👋 Ask me anything about Kapil — his skills, projects, certifications, or how to reach him.",
  suggestions: QUICK_QUESTIONS,
};

// Very simple markdown-ish formatting for **bold** so answers read cleanly.
function renderText(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*|\n)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-accent-cyan">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part === "\n") {
      return <span key={i} className="block h-1.5" />;
    }
    return <span key={i}>{part}</span>;
  });
}

export function AiAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [listening, setListening] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const reduce = useReducedMotion();
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current?.focus(), 100);
      return () => clearTimeout(t);
    }
  }, [open]);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, thinking]);

  async function send(text?: string) {
    const q = (text ?? input).trim();
    if (!q || thinking) return;

    const userMsg: Message = { role: "user", text: q };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setError(null);
    setThinking(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: q }),
      });
      const data = (await res.json()) as { reply?: string; nav?: string; suggestions?: string[]; error?: string };
      const reply = data.reply;
      if (!res.ok || !reply) {
        setError(data.error || "Something went wrong. Please try again.");
        setThinking(false);
        return;
      }
      setMessages((m) => [
        ...m,
        { role: "bot", text: reply, nav: data.nav, suggestions: data.suggestions },
      ]);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setThinking(false);
    }
  }

  // Voice-to-text input (browser Web Speech API — no API key needed).
  function toggleVoice() {
    if (typeof window === "undefined") return;
    const SR =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) {
      setError("Voice input isn't supported in this browser.");
      return;
    }
    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }
    const rec = new SR();
    recognitionRef.current = rec;
    rec.lang = "en-US";
    rec.interimResults = false;
    rec.onresult = (e: any) => {
      const text = e.results?.[0]?.[0]?.transcript ?? "";
      if (text) setInput(text);
    };
    rec.onerror = () => setListening(false);
    rec.onend = () => setListening(false);
    rec.start();
    setListening(true);
  }

  return (
    <>
      {/* Floating toggle button */}
      <motion.button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-5 right-5 z-[70] flex h-14 w-14 items-center justify-center rounded-2xl border border-accent-cyan/40 bg-surface text-accent-cyan shadow-glow transition-colors hover:bg-accent-cyan/10"
        aria-label={open ? "Close AI assistant" : "Open AI assistant"}
        animate={reduce ? {} : open ? { scale: 1 } : { y: [0, -6, 0] }}
        transition={{ duration: 2, repeat: open ? 0 : Infinity, ease: "easeInOut" }}
      >
        {open ? <X className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed bottom-24 right-5 z-[70] flex h-[min(600px,calc(100dvh-8rem))] w-[calc(100vw-2.5rem)] max-w-sm flex-col overflow-hidden rounded-2xl border border-white/10 bg-surface shadow-card"
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            role="dialog"
            aria-modal="false"
            aria-label="Ask about Kapil"
          >
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-white/10 bg-gradient-to-r from-accent-cyan/10 to-transparent px-4 py-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-cyan/15 text-accent-cyan">
                <Sparkles className="h-4 w-4" />
              </span>
              <div className="min-w-0">
                <p className="font-display text-sm font-semibold text-white">KAPIL OS Assistant</p>
                <p className="flex items-center gap-1.5 text-[11px] text-accent-green">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent-green" /> online · knows all about Kapil
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="ml-auto rounded-lg p-1.5 text-ink-muted transition-colors hover:bg-white/10 hover:text-white"
                aria-label="Close assistant"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                      m.role === "user"
                        ? "rounded-br-sm bg-accent-cyan/15 text-white"
                        : "rounded-bl-sm border border-white/[0.07] bg-white/[0.03] text-ink-muted"
                    }`}
                  >
                    {renderText(m.text)}
                    {m.nav && (
                      <button
                        onClick={() => {
                          scrollToId(m.nav!);
                          setOpen(false);
                        }}
                        className="mt-2 inline-flex items-center gap-1 rounded-lg border border-accent-cyan/30 bg-accent-cyan/10 px-2.5 py-1 text-[11px] font-medium text-accent-cyan transition-colors hover:bg-accent-cyan/20"
                      >
                        <CornerDownRight className="h-3 w-3" /> Jump to {m.nav}
                      </button>
                    )}
                    {m.suggestions && m.suggestions.length > 0 && (
                      <div className="mt-2.5 flex flex-wrap gap-1.5">
                        {m.suggestions.map((s) => (
                          <button
                            key={s}
                            onClick={() => send(s)}
                            className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[11px] text-ink-muted transition-colors hover:border-accent-cyan/40 hover:text-accent-cyan"
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {thinking && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-sm border border-white/[0.07] bg-white/[0.03] px-3.5 py-2.5">
                    <Loader2 className="h-4 w-4 animate-spin text-accent-cyan" />
                    <span className="text-sm text-ink-muted">thinking...</span>
                  </div>
                </div>
              )}

              {error && (
                <p role="alert" className="rounded-xl border border-red-400/30 bg-red-400/10 px-3 py-2 text-xs text-red-300">
                  {error}
                </p>
              )}
            </div>

            {/* Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send();
              }}
              className="border-t border-white/10 p-3"
            >
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask me anything about Kapil..."
                  maxLength={500}
                  className="flex-1 rounded-xl border border-white/10 bg-black/30 px-3.5 py-2.5 text-sm text-white placeholder:text-ink-faint focus:outline-none focus:border-accent-cyan/50"
                  aria-label="Ask the assistant"
                />
                <button
                  type="button"
                  onClick={toggleVoice}
                  disabled={thinking}
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition-colors disabled:opacity-40 ${
                    listening
                      ? "border-red-400/50 bg-red-400/15 text-red-300"
                      : "border-white/10 bg-white/[0.03] text-accent-cyan hover:border-accent-cyan/40"
                  }`}
                  aria-label={listening ? "Stop voice input" : "Use voice input"}
                >
                  <Mic className={`h-4 w-4 ${listening ? "animate-pulse" : ""}`} />
                </button>
                <button
                  type="submit"
                  disabled={!input.trim() || thinking}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-cyan text-base transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Send message"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
              <p className="mt-1.5 text-center font-mono text-[10px] text-ink-faint">
                instant answers from Kapil's real data · no account needed
              </p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
