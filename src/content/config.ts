import { Post } from "@/lib/schemas/post.schema";
import { glob } from "astro/loaders";
import { defineCollection } from "astro:content";

const posts = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/posts" }),
  schema: Post,
});

export const collections = { posts };
