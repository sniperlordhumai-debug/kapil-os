"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

export function BackgroundFX() {
  const glowRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  // Cursor-following glow
  useEffect(() => {
    if (reduce) return;
    const el = glowRef.current;
    if (!el) return;
    const target = el;
    let raf = 0;
    let tx = 0,
      ty = 0,
      x = 0,
      y = 0;
    function onMove(e: MouseEvent) {
      tx = e.clientX;
      ty = e.clientY;
    }
    function loop() {
      x += (tx - x) * 0.12;
      y += (ty - y) * 0.12;
      target.style.transform = `translate3d(${x - 250}px, ${y - 250}px, 0)`;
      raf = requestAnimationFrame(loop);
    }
    window.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [reduce]);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* fine grid */}
      <div className="grid-bg absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,black,transparent)]" />
      {/* floating ambient particles */}
      <div className="particles absolute inset-0" />
      {/* radial top glow */}
      <div className="absolute -top-40 left-1/2 h-[40rem] w-[60rem] -translate-x-1/2 rounded-full bg-accent-blue/10 blur-[140px]" />
      {/* cursor glow */}
      <div
        ref={glowRef}
        className="absolute left-0 top-0 h-[500px] w-[500px] rounded-full bg-accent-cyan/[0.06] blur-[120px]"
      />
      {/* subtle green accent */}
      <div className="absolute bottom-0 right-0 h-[30rem] w-[30rem] rounded-full bg-accent-green/[0.04] blur-[130px]" />
      {/* fine noise */}
      <div className="noise absolute inset-0" />
    </div>
  );
}
