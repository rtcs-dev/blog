# rtcs.dev

<a href ="https://rtcs.dev" target="_blank">
  <img src="apps/web/public/assets/logo/orange-1200x1200.png" width="200" height="200" alt="rtcs logo" />
</a>

This repository contains the source code for the [rtcs blog](https://rtcs.dev).

It is a pnpm workspace. The site lives in `apps/web`, built with Astro, Tailwind CSS, and MDX, and deployed on Cloudflare Workers. Local publishing tools live in `apps/studio`.

## Directory Structure

`apps/web/src` contains the following structure:

- `pages`: for the pages, as enforced by Astro.
- `content`: all of the content, authored using MDX.
- `components`: both re-usable and page specific components.
- `layouts`: different page layout components.
- `styles`: CSS files.
- `icons`: SVG assets imported directly as Astro components.
- `lib`: business logic, constants (that don't belong in content collections) and schemas.

## Getting Started

### Preliminaries for local development

- `node` (version 22.22 or newer)
- `pnpm`

Clone the repository, install the dependencies from the repo root, and make it yours!

```sh
pnpm install
pnpm dev
```

## Deployment using Cloudflare Workers

### Prerequisites

1. Create a Cloudflare account if you don't have one
2. Use Node.js 22.22 or newer
3. Authenticate with Cloudflare: `pnpm run login`

### Deploying

From the repository root:

- `pnpm run dev` starts the local Worker dev server.
- `pnpm run preview` does the same.
- `pnpm build` checks and builds the site without deploying.
- `pnpm run deploy` builds the site, then deploys that production build.
- `pnpm run deploy:preview` runs the checks and registry build, then `cf previews deploy` builds and deploys a Worker Preview.
- `pnpm run types` writes the Worker types from `cloudflare.config.ts`.
