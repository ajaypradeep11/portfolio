import type { MetadataRoute } from "next";

import { home } from "@/app/resources/content";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: home.title,
    short_name: "Ajay Portfolio",
    description: home.description,
    start_url: "/",
    display: "standalone",
    background_color: "#151515",
    theme_color: "#151515",
    icons: [
      {
        src: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
