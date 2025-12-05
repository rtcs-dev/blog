// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import expressiveCode from "astro-expressive-code";
import cloudflare from "@astrojs/cloudflare";
import svgr from "vite-plugin-svgr";
import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  site: "https://rtcs.dev",
  adapter: cloudflare(),
  vite: {
    plugins: [tailwindcss(), svgr()],
  },
  integrations: [expressiveCode(), mdx(), sitemap(), react()],
  redirects: {
    "/hub": "/blog",
  },
});
