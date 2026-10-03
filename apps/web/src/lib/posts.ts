import { getCollection, type CollectionEntry } from "astro:content";
import { includeDraftPosts } from "@/lib/env";
import { isPostVisible } from "@/lib/post-visibility";

export type PostEntry = CollectionEntry<"posts">;

export { isPostVisible } from "@/lib/post-visibility";

/**
 * All posts visible in the current environment, newest first.
 * Production deploys omit drafts; local development includes them.
 */
export async function getPosts(): Promise<PostEntry[]> {
  const includeDrafts = includeDraftPosts();
  const posts = await getCollection("posts", ({ data }) =>
    isPostVisible(data.status, includeDrafts),
  );

  return posts.sort(
    (a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime(),
  );
}
