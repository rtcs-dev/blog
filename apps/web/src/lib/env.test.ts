import { afterEach, describe, expect, it, vi } from "vitest";

describe("includeDraftPosts", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it("includes drafts in the dev server even when NODE_ENV is production", async () => {
    vi.stubEnv("NODE_ENV", "production");
    const { includeDraftPosts } = await import("./env");
    expect(includeDraftPosts()).toBe(true);
  });
});
