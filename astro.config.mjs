// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import aws from "astro-sst";

import expressiveCode from "astro-expressive-code";

// https://astro.build/config
export default defineConfig({
  site: "https://rtcs.dev",
  output: "server",
  adapter: aws({
    deploymentStrategy: "regional",
    serverRoutes: ["/api/*"],
  }),
  integrations: [
    expressiveCode({
      themeCssSelector: (theme) => {
        const isDarkTheme = theme.name === "github-dark";
        return isDarkTheme ? ".dark *" : ":not(.dark *)";
      },
    }),
    mdx(),
    sitemap(),
    tailwind({
      applyBaseStyles: false,
    }),
  ],
  redirects: {
    "/hub": "/blog",
  },
});
