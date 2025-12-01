# rtcs.dev

<a href ="https://rtcs.dev" target="_blank">
  <img src="public/assets/logo/orange-1200x1200.png" width="200" height="200" alt="rtcs logo" />
</a>

This repository contains the source code for the [rtcs blog](https://rtcs.dev).

It is built using Astro, Tailwind CSS, and MDX. The blog is deployed on Cloudflare Workers.

## Directory Structure

The `src` directory contains the following structure:

- `pages`: for the pages, as enforced by Astro.
- `content`: all of the content, authored using MDX.
- `components`: both re-usable and page specific components.
- `layouts`: different page layout components.
- `styles`: CSS files.
- `icons`: SVG assets imported directly as Astro components.
- `lib`: business logic, constants (that don't belong in content collections) and schemas.

## Getting Started

### Preliminaries for local development

- `node` (version 20 or latest recommended)
- `pnpm`

Clone the repository, install the dependencies, and make it yours!

## Deployment using Cloudflare Workers

### Prerequisites

1. Create a Cloudflare account if you don't have one
2. Install the Wrangler CLI (already included as a dev dependency)
3. Authenticate with Cloudflare: `npx wrangler login`

### Deploying

1. Build the site: `pnpm build`
2. Deploy to Cloudflare Workers: `pnpm deploy`
   - Or use `pnpm deploy:preview` to preview locally before deploying
