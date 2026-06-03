import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "تأويل الرؤى",
    short_name: "تأويل الرؤى",
    description:
      "مدونة عربية متخصصة في تأويل الرؤى والأحلام والمحتوى الثري.",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#f5efe8",
    theme_color: "#6B3F23",
    lang: "ar",
    dir: "rtl",
    icons: [
      { src: "/icon.svg", type: "image/svg+xml", sizes: "any" },
      { src: "/apple-icon.svg", type: "image/svg+xml", sizes: "180x180" },
    ],
  };
}
