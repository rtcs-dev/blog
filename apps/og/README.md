# Studio

Local Open Graph / cover image editor for this blog’s publishing workflow.

Adapted from [clerk/og.new](https://github.com/clerk/og.new). Many thanks to [Fady](https://github.com/fadymak), the original creator of the OG image editor.

## What it does

1. Pick a logo from `public/logos` (built-ins: NestJS, Node.js, blog mark — plus any you upload).
2. Enter title and subtitle (matching existing post covers).
3. Choose a filename stem (e.g. `my-post`).
4. Save **light** and **dark** variants into the blog app:

- Raw PNGs → `apps/web/public/assets/images/posts/_raw/{name}-light.png` / `{name}-dark.png`
- WebP covers → `apps/web/public/assets/images/posts/{name}-light.webp` / `{name}-dark.webp`

Then reference them from MDX frontmatter as `imageLight` / `imageDark`.

## Develop

Local-only Vite + React app (never deployed). Rendering and file writes run in Vite
dev-server middleware via Node `fs`, Satori, and Sharp.

From the monorepo root:

```bash
pnpm --filter studio dev
# or
pnpm dev:og
```

Opens on [http://localhost:3010](http://localhost:3010) (or the next free port).

## Credits

- Upstream: [clerk/og.new](https://github.com/clerk/og.new)
- Original editor: [Fady Abdelmalik](https://github.com/fadymak)
