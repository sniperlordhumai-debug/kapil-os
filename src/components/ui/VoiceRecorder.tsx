"use client";

import { useEffect, useRef, useState } from "react";
import { Mic, Square, Loader2, Play, Pause, Trash2, AudioLines } from "lucide-react";

const MAX_MS = 60_000; // 60s cap (keeps attachment small, under Resend's 10MB limit)

export interface VoiceResult {
  blob: Blob;
  name: string;
  durationMs: number;
}

export function VoiceRecorder({ onResult }: { onResult: (r: VoiceResult) => void }) {
  const [state, setState] = useState<"idle" | "recording" | "recorded">("idle");
  const [busy, setBusy] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [playing, setPlaying] = useState(false);

  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);
  const mimeType = useRef<string>("audio/webm");
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioEl = useRef<HTMLAudioElement | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  function cleanupTimer() {
    if (timer.current) clearInterval(timer.current);
    timer.current = null;
  }

  async function start() {
    setBusy(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const rec = new MediaRecorder(stream);
      mediaRecorder.current = rec;
      mimeType.current = rec.mimeType || "audio/webm";
      chunks.current = [];
      rec.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.current.push(e.data);
      };
      rec.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunks.current, { type: mimeType.current });
        const dur = Math.min(elapsedRef.current, MAX_MS);
        onResult({ blob, name: `voice-${Date.now()}.${ext(mimeType.current)}`, durationMs: dur });
        // build preview URL
        const url = URL.createObjectURL(blob);
        setPreviewUrl((old) => {
          if (old) URL.revokeObjectURL(old);
          return url;
        });
        setState("recorded");
        setPlaying(false);
      };
      rec.start();
      setState("recording");
      setElapsed(0);
      const startAt = Date.now();
      timer.current = setInterval(() => {
        const e = Date.now() - startAt;
        setElapsed(e);
        if (e >= MAX_MS) stop();
      }, 200);
    } catch {
      alert("Microphone access was denied or unavailable.");
    } finally {
      setBusy(false);
    }
  }

  const elapsedRef = useRef(0);
  elapsedRef.current = elapsed;

  function stop() {
    cleanupTimer();
    if (mediaRecorder.current && mediaRecorder.current.state !== "inactive") {
      mediaRecorder.current.stop();
    }
  }

  function discard() {
    cleanupTimer();
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setState("idle");
    setElapsed(0);
    setPlaying(false);
    onResult({ blob: new Blob([], { type: "audio/webm" }), name: "", durationMs: 0 });
  }

  function ext(mime: string) {
    if (mime.includes("ogg")) return "ogg";
    if (mime.includes("mp4")) return "m4a";
    if (mime.includes("mpeg")) return "mp3";
    return "webm";
  }

  const fmt = (ms: number) => {
    const s = Math.floor(ms / 1000);
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  };

  const hasAudio = state === "recorded" && previewUrl;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {hasAudio && <audio ref={audioEl} src={previewUrl} className="hidden" onEnded={() => setPlaying(false)} />}

      {state !== "recording" && (
        <button
          type="button"
          onClick={state === "recorded" ? discard : start}
          disabled={busy}
          className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-ink-muted transition-colors hover:border-accent-cyan/40 hover:text-accent-cyan disabled:opacity-50"
          aria-label={state === "recorded" ? "Discard voice message" : "Record voice message"}
        >
          {busy ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : state === "recorded" ? (
            <Trash2 className="h-4 w-4" />
          ) : (
            <Mic className="h-4 w-4" />
          )}
          {state === "recorded" ? "Discard" : "Record voice"}
        </button>
      )}

      {state === "recording" && (
        <>
          <span className="inline-flex items-center gap-2 rounded-lg border border-red-400/40 bg-red-400/10 px-3 py-2 text-xs text-red-300">
            <span className="h-2 w-2 animate-pulse rounded-full bg-red-400" />
            Recording {fmt(elapsed)}
          </span>
          <button
            type="button"
            onClick={stop}
            className="inline-flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-xs font-semibold text-base hover:bg-white/90"
            aria-label="Stop recording"
          >
            <Square className="h-3.5 w-3.5" /> Stop
          </button>
        </>
      )}

      {hasAudio && (
        <>
          <span className="inline-flex items-center gap-2 rounded-lg border border-accent-green/30 bg-accent-green/10 px-3 py-2 text-xs text-accent-green">
            <AudioLines className="h-4 w-4" /> Voice attached ({fmt(elapsed)})
          </span>
          <button
            type="button"
            onClick={() => {
              if (!audioEl.current) return;
              if (playing) {
                audioEl.current.pause();
                setPlaying(false);
              } else {
                audioEl.current.play();
                setPlaying(true);
              }
            }}
            className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-ink-muted hover:text-accent-cyan"
            aria-label={playing ? "Pause voice message" : "Play voice message"}
          >
            {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {playing ? "Pause" : "Play"}
          </button>
        </>
      )}
    </div>
  );
}
