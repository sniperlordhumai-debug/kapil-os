"use client";

import { useRef, type ReactNode } from "react";
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "framer-motion";

export function TiltCard({
  children,
  className = "",
  max = 8,
  glare = true,
}: {
  children: ReactNode;
  className?: string;
  max?: number;
  glare?: boolean;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);
  const sX = useSpring(x, { stiffness: 150, damping: 20 });
  const sY = useSpring(y, { stiffness: 150, damping: 20 });

  const rotateX = useTransform(sY, [0, 1], [max, -max]);
  const rotateY = useTransform(sX, [0, 1], [-max, max]);
  const glareX = useTransform(sX, [0, 1], [0, 100]);

  function handleMove(e: React.MouseEvent) {
    if (reduce) return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left) / rect.width);
    y.set((e.clientY - rect.top) / rect.height);
  }
  function reset() {
    x.set(0.5);
    y.set(0.5);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={reduce ? {} : { rotateX, rotateY, transformStyle: "preserve-3d" }}
      className={`relative [perspective:900px] ${className}`}
    >
      {children}
      {glare && (
        <motion.div
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 hover:opacity-100"
          style={{
            background: useTransform(glareX, (p) =>
              `radial-gradient(circle at ${p}% 0%, rgba(255,255,255,0.08), transparent 55%)`
            ),
          }}
          aria-hidden
        />
      )}
    </motion.div>
  );
}
