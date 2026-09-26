import { afterEach, describe, expect, it, vi } from "vitest";

describe("includeDraftPosts", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it("excludes drafts on Vercel production", async () => {
    vi.stubEnv("VERCEL_ENV", "production");
    const { includeDraftPosts } = await import("./env");
    expect(includeDraftPosts()).toBe(false);
  });

  it("includes drafts on Vercel preview", async () => {
    vi.stubEnv("VERCEL_ENV", "preview");
    const { includeDraftPosts } = await import("./env");
    expect(includeDraftPosts()).toBe(true);
  });

  it("excludes drafts on Cloudflare Pages production branch", async () => {
    vi.stubEnv("CF_PAGES", "1");
    vi.stubEnv("CF_PAGES_BRANCH", "main");
    const { includeDraftPosts } = await import("./env");
    expect(includeDraftPosts()).toBe(false);
  });

  it("includes drafts on Cloudflare Pages preview branch", async () => {
    vi.stubEnv("CF_PAGES", "1");
    vi.stubEnv("CF_PAGES_BRANCH", "feat/drafts");
    const { includeDraftPosts } = await import("./env");
    expect(includeDraftPosts()).toBe(true);
  });

  it("includes drafts when NODE_ENV is production but no deploy signal is set", async () => {
    // Mimics a local toolchain where NODE_ENV was set without a platform env.
    vi.stubEnv("NODE_ENV", "production");
    // Vitest itself runs with import.meta.env.DEV === true.
    const { includeDraftPosts } = await import("./env");
    expect(includeDraftPosts()).toBe(true);
  });
});
