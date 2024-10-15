import { z } from "astro:content";

export const Post = z.object({
  title: z.string(),
  description: z.string(),
  date: z.coerce.date(),
  image: z.string(),
  keywords: z.string().optional(),
});

export type Post = z.infer<typeof Post>;
