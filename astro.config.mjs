// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import aws from "astro-sst";
import tailwindcss from "@tailwindcss/vite";

import expressiveCode from "astro-expressive-code";

// https://astro.build/config
export default defineConfig({
  site: "https://rtcs.dev",
  output: "server",
  adapter: aws(),
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [
    expressiveCode({
      themeCssSelector: (theme) => {
        const isDarkTheme = theme.name === "github-dark";
        return isDarkTheme ? ".dark *" : ":not(.dark *)";
      },
    }),
    mdx(),
    sitemap(),
  ],
  redirects: {
    "/hub": "/blog",
  },
});
