import type { SeriesIcon } from "@/lib/posts/series-icon";
import type { PostSeries } from "@/lib/schemas/post.schema";

export type SeriesPostInput = {
  id: string;
  data: {
    title: string;
    series?: PostSeries;
    status?: "draft" | "stable";
  };
};

export type SeriesMember = {
  id: string;
  title: string;
  order: number;
};

export type SeriesNeighbors = {
  position: number;
  previous?: SeriesMember;
  next?: SeriesMember;
};

export type BlogIndexPost = {
  id: string;
  data: {
    title: string;
    description: string;
    date: Date;
    status?: "draft" | "stable";
    series?: PostSeries;
  };
};

export type BlogIndexSeries = {
  name: string;
  icon?: SeriesIcon;
  posts: BlogIndexPost[];
};

export type BlogIndex = {
  series: BlogIndexSeries[];
  posts: BlogIndexPost[];
};

export function isPostVisible(
  post: SeriesPostInput,
  options: { includeDrafts?: boolean } = {},
): boolean {
  const { includeDrafts = true } = options;
  if (post.data.status === "draft" && !includeDrafts) return false;
  return true;
}

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
    .sort((a, b) => (a.data.series?.order ?? 0) - (b.data.series?.order ?? 0))
    .map((post) => ({
      id: post.id,
      title: post.data.title,
      order: post.data.series!.order,
    }));
}

export function getSeriesNeighbors(
  members: SeriesMember[],
  currentId: string,
): SeriesNeighbors {
  const index = members.findIndex((member) => member.id === currentId);
  return {
    position: index + 1,
    previous: index > 0 ? members[index - 1] : undefined,
    next:
      index >= 0 && index < members.length - 1 ? members[index + 1] : undefined,
  };
}

export function getSeriesName(post: SeriesPostInput): string | undefined {
  return post.data.series?.name;
}

export function seriesSlug(name: string): string {
  const slug = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || "series";
}

export function seriesHref(name: string): string {
  return `/series/${seriesSlug(name)}`;
}

function seriesIconFromPosts(
  posts: readonly { data: { series?: PostSeries } }[],
): SeriesIcon | undefined {
  for (const post of posts) {
    const icon = post.data.series?.icon;
    if (icon) return icon;
  }
  return undefined;
}

export function seriesSlidePosts<
  T extends { data: { series?: { order: number } } },
>(posts: readonly T[]): T[] {
  const sorted = [...posts].sort(
    (a, b) => (b.data.series?.order ?? 0) - (a.data.series?.order ?? 0),
  );
  if (sorted.length <= 2) return sorted;
  return [sorted[0]!, sorted[sorted.length - 1]!];
}

export function pickFeaturedPost<T extends { data: { date: Date } }>(
  posts: readonly T[],
): T | undefined {
  let featured: T | undefined;

  for (const post of posts) {
    if (!featured || post.data.date.getTime() > featured.data.date.getTime()) {
      featured = post;
    }
  }

  return featured;
}

export function buildBlogIndex(
  posts: readonly BlogIndexPost[],
  featuredId?: string,
): BlogIndex {
  const featured = featuredId
    ? posts.find((post) => post.id === featuredId)
    : undefined;
  const omitStandaloneId =
    featured && !featured.data.series ? featured.id : undefined;
  const grouped = new Map<string, BlogIndexPost[]>();
  const standalone: BlogIndexPost[] = [];

  for (const post of posts) {
    if (post.id === omitStandaloneId) continue;

    const name = post.data.series?.name;
    if (!name) {
      standalone.push(post);
      continue;
    }

    const group = grouped.get(name);
    if (group) {
      group.push(post);
      continue;
    }

    grouped.set(name, [post]);
  }

  const series = [...grouped.entries()].map(([name, seriesPosts]) => ({
    name,
    icon: seriesIconFromPosts(seriesPosts),
    posts: seriesPosts.sort(
      (a, b) =>
        b.data.date.getTime() - a.data.date.getTime() ||
        (b.data.series?.order ?? 0) - (a.data.series?.order ?? 0),
    ),
  }));

  const latest = (group: BlogIndexSeries) =>
    Math.max(...group.posts.map((post) => post.data.date.getTime()));

  series.sort(
    (a, b) => latest(b) - latest(a) || a.name.localeCompare(b.name),
  );

  standalone.sort(
    (a, b) =>
      b.data.date.getTime() - a.data.date.getTime() ||
      a.data.title.localeCompare(b.data.title),
  );

  return { series, posts: standalone };
}
