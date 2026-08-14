import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Kapil OS — Kapil Kumar",
    short_name: "Kapil OS",
    description: "Personal digital workspace of Kapil Kumar, AI/ML & Software Developer.",
    start_url: "/",
    display: "standalone",
    background_color: "#050505",
    theme_color: "#050505",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
