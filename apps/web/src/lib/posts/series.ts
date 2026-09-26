import type { PostSeries } from "@/lib/schemas/post.schema";

/** Minimal post shape needed to resolve series membership. */
export type SeriesPostInput = {
  id: string;
  data: {
    title: string;
    series?: PostSeries;
    /**
     * Owned by feat/post-draft-stable: `"draft" | "stable"` (default stable).
     * Present here as optional so this helper can call a shared visibility
     * filter once that field lands — do not invent a second status system.
     */
    status?: "draft" | "stable";
  };
};

export type SeriesMember = {
  id: string;
  title: string;
  order: number;
};

/**
 * Posts currently shown in the listing environment.
 *
 * When `status` exists on posts, production must hide drafts and local dev
 * may show them — same rules as the index/post loader. Until that branch
 * lands, every post is treated as visible.
 */
export function isPostVisible(
  post: SeriesPostInput,
  options: { includeDrafts?: boolean } = {},
): boolean {
  const { includeDrafts = true } = options;
  // Series membership listings must respect `status` once draft/stable lands.
  if (post.data.status === "draft" && !includeDrafts) {
    return false;
  }
  return true;
}

/**
 * Ordered members of a series. Pass posts already filtered for the current
 * environment, or rely on `includeDrafts` once `status` is on the schema.
 */
export function getSeriesMembers(
  posts: SeriesPostInput[],
  seriesName: string,
  options: { includeDrafts?: boolean } = {},
): SeriesMember[] {
  return posts
    .filter(
      (post) =>
        post.data.series?.name === seriesName && isPostVisible(post, options),
    )
    .sort(
      (a, b) => (a.data.series?.order ?? 0) - (b.data.series?.order ?? 0),
    )
    .map((post) => ({
      id: post.id,
      title: post.data.title,
      order: post.data.series!.order,
    }));
}

export function getSeriesName(
  post: SeriesPostInput,
): string | undefined {
  return post.data.series?.name;
}
