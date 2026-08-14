import type { ReactNode } from "react";

export function StatusPill({
  children,
  dot = true,
  tone = "cyan",
}: {
  children: ReactNode;
  dot?: boolean;
  tone?: "cyan" | "green" | "blue" | "muted";
}) {
  const colors = {
    cyan: "bg-accent-cyan",
    green: "bg-accent-green",
    blue: "bg-accent-blue",
    muted: "bg-ink-faint",
  };
  return (
    <span className="chip">
      {dot && (
        <span className={`relative flex h-1.5 w-1.5 ${colors[tone]}`}>
          <span className="absolute inline-flex h-full w-full animate-ping opacity-60" />
          <span className={`relative inline-flex h-1.5 w-1.5 rounded-full ${colors[tone]}`} />
        </span>
      )}
      {children}
    </span>
  );
}
