import { describe, expect, it } from "vitest";
import { Post } from "./post.schema";

const base = {
  title: "Pilot",
  description: "A short post.",
  date: "2023-12-12",
  imageLight: "/assets/images/posts/hello-world-light.webp",
  imageDark: "/assets/images/posts/hello-world-dark.webp",
  status: "stable" as const,
};

describe("Post schema series", () => {
  it("accepts posts without series", () => {
    const parsed = Post.parse(base);
    expect(parsed.series).toBeUndefined();
  });

  it("accepts optional series name and order", () => {
    const parsed = Post.parse({
      ...base,
      series: { name: "NestJS", order: 1 },
    });
    expect(parsed.series).toEqual({ name: "NestJS", order: 1 });
  });

  it("rejects empty series names and non-positive order", () => {
    expect(() =>
      Post.parse({ ...base, series: { name: "", order: 1 } }),
    ).toThrow();
    expect(() =>
      Post.parse({ ...base, series: { name: "NestJS", order: 0 } }),
    ).toThrow();
  });
});
