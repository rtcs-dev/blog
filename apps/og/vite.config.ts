import path from "node:path"
import { fileURLToPath } from "node:url"

import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

import { ogDevApiPlugin } from "./server/dev-api-plugin"

const rootDir = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [react(), ogDevApiPlugin()],
  resolve: {
    alias: {
      "@": rootDir,
    },
  },
  server: {
    port: 3010,
    strictPort: false,
  },
  ssr: {
    external: ["sharp"],
  },
})
