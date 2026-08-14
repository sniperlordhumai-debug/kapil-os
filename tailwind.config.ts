import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        base: "#050505",
        surface: "#0c0d0f",
        ink: {
          DEFAULT: "#e8e9ea",
          muted: "#9a9fa8",
          faint: "#5c626b",
        },
        accent: {
          cyan: "#22d3ee",
          blue: "#3b82f6",
          green: "#4ade80",
        },
        borderline: "rgba(255,255,255,0.08)",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        sans: ["var(--font-sans)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      boxShadow: {
        glow: "0 0 40px -12px rgba(34,211,238,0.35)",
        card: "0 10px 40px -20px rgba(0,0,0,0.8)",
      },
      backgroundImage: {
        "grid-fine":
          "linear-gradient(to right, rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.035) 1px, transparent 1px)",
      },
      animation: {
        "fade-up": "fadeUp .6s cubic-bezier(.22,1,.36,1) both",
        blink: "blink 1s step-end infinite",
        pulse: "pulse 2.4s ease-in-out infinite",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        blink: { "0%,100%": { opacity: "1" }, "50%": { opacity: "0" } },
        marquee: { "0%": { transform: "translateX(0)" }, "100%": { transform: "translateX(-50%)" } },
      },
    },
  },
  plugins: [],
};

export default config;
