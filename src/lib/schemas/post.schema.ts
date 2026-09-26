import { z } from "astro/zod";

export const PostStatus = z.enum(["draft", "stable"]);

export const Post = z.object({
  title: z.string(),
  description: z.string(),
  date: z.coerce.date(),
  imageDark: z.string(),
  imageLight: z.string(),
  keywords: z.string().optional(),
  /** Publish state. Missing values default to stable so existing posts stay live. */
  status: PostStatus.default("stable"),
});

export type Post = z.infer<typeof Post>;
export type PostStatus = z.infer<typeof PostStatus>;
