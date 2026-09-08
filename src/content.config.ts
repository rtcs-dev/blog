import { Post } from "@/lib/schemas/post.schema";
import { RegistryItem } from "@/lib/schemas/registry-item.schema";
import { glob } from "astro/loaders";
import { defineCollection } from "astro:content";

const posts = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/posts" }),
  schema: Post,
});

const registry = defineCollection({
  loader: glob({
    pattern: ["**/*.json", "!**/registry.json"],
    base: "./public/r",
  }),
  schema: RegistryItem,
});

export const collections = { posts, registry };
