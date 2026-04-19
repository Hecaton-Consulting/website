import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, fontProviders } from "astro/config";
import sharp from "sharp";
import config from "./src/config/config.json";

// https://astro.build/config
export default defineConfig({
  site: config.site.base_url,
  base: config.site.base_path,
  trailingSlash: "always",
  build: { format: "directory" },
  image: { service: sharp() },
  vite: { plugins: [tailwindcss()] },
  integrations: [sitemap(), mdx()],
  experimental: {
    fonts: [
      {
        provider: fontProviders.google(),
        name: "Space Grotesk",
        cssVariable: "--font-primary-file",
        weights: ["500", "600", "700"],
        styles: ["normal"],
        subsets: ["latin"],
      },
      {
        provider: fontProviders.google(),
        name: "Inter",
        cssVariable: "--font-secondary-file",
        weights: ["400", "500"],
        styles: ["normal"],
        subsets: ["latin"],
      },
      {
        provider: fontProviders.google(),
        name: "JetBrains Mono",
        cssVariable: "--font-mono-file",
        weights: ["400", "500"],
        styles: ["normal"],
        subsets: ["latin"],
      },
    ],
  },
  markdown: {
    shikiConfig: { theme: "one-dark-pro", wrap: true },
    extendDefaultPlugins: true,
  },
});
