import { describe, expect, it } from "vitest";
import { isPostVisible } from "./post-visibility";

describe("isPostVisible", () => {
  it("shows stable posts in production", () => {
    expect(isPostVisible("stable", false)).toBe(true);
  });

  it("hides draft posts in production", () => {
    expect(isPostVisible("draft", false)).toBe(false);
  });

  it("shows draft and stable posts when drafts are included", () => {
    expect(isPostVisible("draft", true)).toBe(true);
    expect(isPostVisible("stable", true)).toBe(true);
  });
});

describe("Post schema status default", () => {
  it("defaults missing status to stable", async () => {
    const { Post } = await import("./schemas/post.schema");
    const parsed = Post.parse({
      title: "Example",
      description: "Desc",
      date: "2024-01-01",
      imageDark: "/dark.webp",
      imageLight: "/light.webp",
    });
    expect(parsed.status).toBe("stable");
  });

  it("accepts draft and stable", async () => {
    const { Post } = await import("./schemas/post.schema");
    expect(
      Post.parse({
        title: "Draft",
        description: "Desc",
        date: "2024-01-01",
        imageDark: "/dark.webp",
        imageLight: "/light.webp",
        status: "draft",
      }).status,
    ).toBe("draft");
    expect(
      Post.parse({
        title: "Stable",
        description: "Desc",
        date: "2024-01-01",
        imageDark: "/dark.webp",
        imageLight: "/light.webp",
        status: "stable",
      }).status,
    ).toBe("stable");
  });
});
