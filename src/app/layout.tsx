import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BackgroundFX } from "@/components/layout/BackgroundFX";
import { ClientShell } from "@/components/layout/ClientShell";
import { EasterEggs } from "@/components/layout/EasterEggs";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { SystemHUD } from "@/components/layout/SystemHUD";
import { BackToTop } from "@/components/layout/BackToTop";
import { AiAssistant } from "@/components/sections/AiAssistant";

const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});
const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});
const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const url = "https://kapil-os.vercel.app";

export const metadata: Metadata = {
  title: {
    default: "Kapil Kumar | AI/ML & Software Developer",
    template: "%s | Kapil Kumar",
  },
  description:
    "Portfolio of Kapil Kumar — B.Tech CSE AI & ML student building AI, software, web and automation projects.",
  metadataBase: new URL(url),
  alternates: { canonical: url },
  keywords: [
    "Kapil Kumar", "AI/ML developer", "software developer", "machine learning",
    "artificial intelligence", "generative AI", "portfolio", "Parul University",
    "React", "Python", "web developer",
  ],
  authors: [{ name: "Kapil Kumar" }],
  openGraph: {
    type: "website",
    url,
    title: "Kapil Kumar | AI/ML & Software Developer",
    description:
      "Kapil OS — a personal digital workspace showcasing an AI/ML developer and builder.",
    siteName: "Kapil OS",
    locale: "en_US",
    images: [{ url: `${url}/og.png`, width: 1200, height: 630, alt: "Kapil OS — Kapil Kumar, AI/ML & Software Developer" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kapil Kumar | AI/ML & Software Developer",
    description:
      "Kapil OS — a personal digital workspace showcasing an AI/ML developer and builder.",
    images: [`${url}/og.png`],
  },
};

export const viewport: Viewport = {
  themeColor: "#050505",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} ${mono.variable}`}>
      <body className="relative min-h-screen">
        <ScrollProgress />
        <BackgroundFX />
        <ClientShell />
        <Navbar />
        <main className="relative z-10">{children}</main>
        <Footer />
        <SystemHUD />
        <BackToTop />
        <EasterEggs />
        <AiAssistant />
      </body>
    </html>
  );
}
