# Factory brain

Facts a run proved.

## Build

Workers Builds for `rtcs-blog` watches `rtcs-dev/blog` `main` with root directory `apps/web`, an empty build command, and `NODE_VERSION=24`. Production runs `pnpm run deploy`. Previews run `pnpm run deploy:preview`.

From `apps/web`, `deploy` is `pnpm run build && cf deploy --prebuilt --mode production`. `deploy:preview` is `astro check && pnpm run build:registry && cf previews deploy --mode production`.

## Tests

From the repo root, `pnpm test` exited 0 (5 files, 41 tests). `pnpm build` exited 0: `astro check` reported 0 errors, and `cf build` built 17 pages. The repo has no lint script.

## Review

## Conventions
