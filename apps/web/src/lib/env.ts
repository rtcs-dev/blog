/**
 * Whether draft posts should appear in listings and routes.
 *
 * Production deploys must exclude drafts; local `astro dev` must include them.
 * Do not key off NODE_ENV alone — `astro build` (and `next build`) set
 * NODE_ENV=production even for local builds. Prefer platform deploy signals:
 * - Vercel: exclude only when VERCEL_ENV === "production" (preview keeps drafts)
 * - Cloudflare Pages: exclude on the production branch deploy
 * - Otherwise: include drafts only in the Vite/Astro dev server (import.meta.env.DEV)
 */
export function includeDraftPosts(): boolean {
  const vercelEnv = process.env.VERCEL_ENV;
  if (vercelEnv !== undefined) {
    return vercelEnv !== "production";
  }

  if (process.env.CF_PAGES === "1") {
    const productionBranch =
      process.env.CF_PAGES_PRODUCTION_BRANCH ?? "main";
    return process.env.CF_PAGES_BRANCH !== productionBranch;
  }

  return import.meta.env.DEV;
}
