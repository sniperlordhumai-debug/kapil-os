"use client";

import { useRef, type ReactNode } from "react";

/**
 * 3D flip card (CSS group-hover based, no JS animation loop → no flicker).
 * Front face sits in normal flow (defines height). On hover the inner
 * element rotates 180° around the Y axis to reveal the back.
 */
export function FlipCard({
  front,
  back,
  className = "",
  onFrontClick,
  onBackClick,
}: {
  front: ReactNode;
  back: ReactNode;
  className?: string;
  onFrontClick?: () => void;
  onBackClick?: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div ref={ref} className={`group/flip relative ${className}`} style={{ perspective: "1100px" }}>
      {/* inner rotating element */}
      <div
        className="relative h-full w-full will-change-transform transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/flip:[transform:rotateY(180deg)]"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* FRONT — in flow, defines height */}
        <div
          className="relative w-full"
          style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
          onClick={onFrontClick}
        >
          {front}
        </div>
        {/* BACK — absolute, rotated away */}
        <div
          className="absolute inset-0"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
          onClick={onBackClick ?? onFrontClick}
        >
          {back}
        </div>
      </div>
    </div>
  );
}
