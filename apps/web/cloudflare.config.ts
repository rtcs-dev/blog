import { bindings, defineConfig } from "cf/config";

export default defineConfig({
  worker: {
    name: "rtcs-blog",
    compatibilityDate: "2025-11-25",
    compatibilityFlags: [
      "nodejs_compat",
      "global_fetch_strictly_public",
      "disable_nodejs_process_v2",
    ],
    entrypoint: "@astrojs/cloudflare/entrypoints/server",
    observability: {
      enabled: true,
    },
    domains: ["rtcs.dev"],
    env: {
      ASSETS: bindings.assets(),
    },
  },
});
