"use client";

import { useEffect, useRef, useState } from "react";
import { Video, Square, Loader2, Play, Pause, Trash2, Clapperboard } from "lucide-react";

const MAX_MS = 60_000; // 60s cap

export interface VideoResult {
  blob: Blob;
  name: string;
  durationMs: number;
}

export function VideoRecorder({ onResult }: { onResult: (r: VideoResult) => void }) {
  const [state, setState] = useState<"idle" | "recording" | "recorded">("idle");
  const [busy, setBusy] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [playing, setPlaying] = useState(false);

  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);
  const mimeType = useRef<string>("video/webm");
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const liveRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Reveal the recorded frame (webm blobs often render a black first frame).
  // Reliable technique: load, then seek slightly past 0 and play briefly so the
  // browser decodes a real frame, with a fallback retry.
  useEffect(() => {
    if (!previewUrl) return;
    const v = videoRef.current;
    if (!v) return;
    let cancelled = false;

    const paint = () => {
      if (cancelled || !v) return;
      try {
        // seek a touch past zero so the browser decodes a real frame
        if (v.readyState >= 1) {
          v.currentTime = 0.08;
        }
        v.play().catch(() => {});
      } catch {
        /* ignore */
      }
    };

    v.addEventListener("loadeddata", paint);
    v.addEventListener("seeked", paint);

    // initial attempt + fallback retries
    paint();
    const t1 = setTimeout(paint, 200);
    const t2 = setTimeout(paint, 600);

    return () => {
      cancelled = true;
      clearTimeout(t1);
      clearTimeout(t2);
      v.removeEventListener("loadeddata", paint);
      v.removeEventListener("seeked", paint);
    };
  }, [previewUrl]);

  function cleanupTimer() {
    if (timer.current) clearInterval(timer.current);
    timer.current = null;
  }

  async function start() {
    setBusy(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = stream;
      if (liveRef.current) {
        liveRef.current.srcObject = stream;
        await liveRef.current.play().catch(() => {});
      }
      const rec = new MediaRecorder(stream);
      mediaRecorder.current = rec;
      mimeType.current = rec.mimeType || "video/webm";
      chunks.current = [];
      rec.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.current.push(e.data);
      };
      rec.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunks.current, { type: mimeType.current });
        onResult({ blob, name: `video-${Date.now()}.${ext(mimeType.current)}`, durationMs: elapsedRef.current });
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
      alert("Camera / microphone access was denied or unavailable.");
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
    onResult({ blob: new Blob([], { type: "video/webm" }), name: "", durationMs: 0 });
  }

  function ext(mime: string) {
    if (mime.includes("mp4")) return "mp4";
    if (mime.includes("ogg")) return "ogv";
    return "webm";
  }

  const fmt = (ms: number) => {
    const s = Math.floor(ms / 1000);
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  };

  const hasVideo = state === "recorded" && previewUrl;

  return (
    <div className="space-y-2">
      {/* live preview while recording / preview after */}
      {previewUrl ? (
        <video
          ref={videoRef}
          src={previewUrl}
          controls
          playsInline
          muted
          preload="auto"
          className="w-full max-w-[220px] rounded-lg border border-white/10"
        />
      ) : (
        <video
          ref={liveRef}
          playsInline
          muted
          className={`w-full max-w-[220px] rounded-lg border border-white/10 ${state === "recording" ? "" : "hidden"}`}
        />
      )}

      <div className="flex flex-wrap items-center gap-2">
        {state !== "recording" && (
          <button
            type="button"
            onClick={state === "recorded" ? discard : start}
            disabled={busy}
            className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-ink-muted transition-colors hover:border-accent-cyan/40 hover:text-accent-cyan disabled:opacity-50"
            aria-label={state === "recorded" ? "Discard video message" : "Record video message"}
          >
            {busy ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : state === "recorded" ? (
              <Trash2 className="h-4 w-4" />
            ) : (
              <Video className="h-4 w-4" />
            )}
            {state === "recorded" ? "Discard" : "Record video"}
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

        {hasVideo && (
          <span className="inline-flex items-center gap-2 rounded-lg border border-accent-green/30 bg-accent-green/10 px-3 py-2 text-xs text-accent-green">
            <Clapperboard className="h-4 w-4" /> Video attached ({fmt(elapsed)})
          </span>
        )}
      </div>
    </div>
  );
}
