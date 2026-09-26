import { z } from "astro/zod";

export const PostStatus = z.enum(["draft", "stable"]);

export const PostSeries = z.object({
  name: z.string().min(1),
  order: z.number().int().positive(),
});

export const Post = z.object({
  title: z.string(),
  description: z.string(),
  date: z.coerce.date(),
  imageDark: z.string(),
  imageLight: z.string(),
  keywords: z.string().optional(),
  status: PostStatus,
  series: PostSeries.optional(),
});

export type PostSeries = z.infer<typeof PostSeries>;
export type Post = z.infer<typeof Post>;
export type PostStatus = z.infer<typeof PostStatus>;
