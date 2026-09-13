// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import expressiveCode from "astro-expressive-code";
import cloudflare from "@astrojs/cloudflare";
import svgr from "vite-plugin-svgr";
import react from "@astrojs/react";
import wgslVitePlugin from "@vgpu/wgsl/loader-vite";

// https://astro.build/config
export default defineConfig({
  site: "https://rtcs.dev",
  session: false,
  adapter: cloudflare({
    prerenderEnvironment: "node",
    imageService: "compile",
  }),
  vite: {
    plugins: [tailwindcss(), svgr(), wgslVitePlugin({ minify: true })],
    resolve: {
      dedupe: ["react", "react-dom"],
    },
    optimizeDeps: {
      include: [
        "react",
        "react-dom",
        "react-dom/client",
        "react/jsx-runtime",
        "react/jsx-dev-runtime",
      ],
    },
  },
  integrations: [expressiveCode(), mdx(), sitemap(), react()],
  redirects: {
    "/hub": "/blog",
  },
});
