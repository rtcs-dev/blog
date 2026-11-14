import { describe, expect, it } from "vitest";
import {
  buildBlogIndex,
  getSeriesMembers,
  getSeriesName,
  getSeriesNeighbors,
  isPostVisible,
  pickFeaturedPost,
  seriesHref,
  seriesSlidePosts,
  seriesSlug,
  type BlogIndex,
  type BlogIndexPost,
  type SeriesPostInput,
} from "./series";

const posts: SeriesPostInput[] = [
  {
    id: "configuring-nestjs",
    data: {
      title: "Configuring NestJS applications",
      series: { name: "NestJS", order: 1 },
      status: "stable",
    },
  },
  {
    id: "mixins-in-nestjs",
    data: {
      title: "Mixins and their use-cases in NestJS",
      series: { name: "NestJS", order: 2 },
      status: "stable",
    },
  },
  {
    id: "draft-nestjs-tip",
    data: {
      title: "Draft NestJS tip",
      series: { name: "NestJS", order: 3 },
      status: "draft",
    },
  },
  {
    id: "hello-world",
    data: {
      title: "Pilot",
    },
  },
  {
    id: "other-series",
    data: {
      title: "Other series post",
      series: { name: "Other", order: 1 },
    },
  },
];

describe("getSeriesMembers", () => {
  it("returns ordered members for a series name", () => {
    expect(getSeriesMembers(posts, "NestJS")).toEqual([
      {
        id: "configuring-nestjs",
        title: "Configuring NestJS applications",
        order: 1,
      },
      {
        id: "mixins-in-nestjs",
        title: "Mixins and their use-cases in NestJS",
        order: 2,
      },
      {
        id: "draft-nestjs-tip",
        title: "Draft NestJS tip",
        order: 3,
      },
    ]);
  });

  it("hides drafts when includeDrafts is false", () => {
    expect(getSeriesMembers(posts, "NestJS", { includeDrafts: false })).toEqual(
      [
        {
          id: "configuring-nestjs",
          title: "Configuring NestJS applications",
          order: 1,
        },
        {
          id: "mixins-in-nestjs",
          title: "Mixins and their use-cases in NestJS",
          order: 2,
        },
      ],
    );
  });

  it("returns an empty list when no posts share the series", () => {
    expect(getSeriesMembers(posts, "Missing")).toEqual([]);
  });
});

describe("isPostVisible", () => {
  it("treats posts without status as visible", () => {
    expect(isPostVisible(posts[3]!)).toBe(true);
  });

  it("hides drafts only when includeDrafts is false", () => {
    const draft = posts[2]!;
    expect(isPostVisible(draft)).toBe(true);
    expect(isPostVisible(draft, { includeDrafts: false })).toBe(false);
  });
});

describe("getSeriesNeighbors", () => {
  const members = getSeriesMembers(posts, "NestJS", { includeDrafts: false });

  it("returns the next part when the current post is first", () => {
    expect(getSeriesNeighbors(members, "configuring-nestjs")).toEqual({
      position: 1,
      previous: undefined,
      next: {
        id: "mixins-in-nestjs",
        title: "Mixins and their use-cases in NestJS",
        order: 2,
      },
    });
  });

  it("returns the previous part when the current post is last", () => {
    expect(getSeriesNeighbors(members, "mixins-in-nestjs")).toEqual({
      position: 2,
      previous: {
        id: "configuring-nestjs",
        title: "Configuring NestJS applications",
        order: 1,
      },
      next: undefined,
    });
  });

  it("returns no neighbors for an unknown post", () => {
    expect(getSeriesNeighbors(members, "missing")).toEqual({
      position: 0,
      previous: undefined,
      next: undefined,
    });
  });
});

describe("buildBlogIndex", () => {
  const indexPosts: BlogIndexPost[] = [
    {
      id: "mixins-in-nestjs",
      data: {
        title: "Mixins and their use-cases in NestJS",
        description: "Mixins",
        date: new Date("2024-08-05"),
        status: "stable",
        series: { name: "NestJS", order: 2 },
      },
    },
    {
      id: "pilot",
      data: {
        title: "Pilot",
        description: "First post",
        date: new Date("2023-12-12"),
        status: "stable",
      },
    },
    {
      id: "configuring-nestjs",
      data: {
        title: "Configuring NestJS applications",
        description: "Configuration",
        date: new Date("2024-02-05"),
        status: "stable",
        series: { name: "NestJS", order: 1 },
      },
    },
    {
      id: "notes",
      data: {
        title: "A note",
        description: "Notes",
        date: new Date("2025-01-01"),
        status: "stable",
        series: { name: "Notes", order: 1 },
      },
    },
    {
      id: "open-sourcing-rtcs",
      data: {
        title: "Open-sourcing rtcs.dev",
        description: "The story",
        date: new Date("2024-10-25"),
        status: "stable",
      },
    },
  ];

  it("lists every series by its newest part, then standalone posts newest first", () => {
    expect(summarizeIndex(buildBlogIndex(indexPosts))).toEqual({
      series: [
        { name: "Notes", ids: ["notes"] },
        {
          name: "NestJS",
          ids: ["mixins-in-nestjs", "configuring-nestjs"],
        },
      ],
      posts: ["open-sourcing-rtcs", "pilot"],
    });
  });

  it("omits a standalone featured post from the post list", () => {
    expect(
      summarizeIndex(buildBlogIndex(indexPosts, "open-sourcing-rtcs")),
    ).toEqual({
      series: [
        { name: "Notes", ids: ["notes"] },
        {
          name: "NestJS",
          ids: ["mixins-in-nestjs", "configuring-nestjs"],
        },
      ],
      posts: ["pilot"],
    });
  });

  it("keeps a featured series post in its series and out of the post list", () => {
    expect(
      summarizeIndex(buildBlogIndex(indexPosts, "mixins-in-nestjs")),
    ).toEqual({
      series: [
        { name: "Notes", ids: ["notes"] },
        {
          name: "NestJS",
          ids: ["mixins-in-nestjs", "configuring-nestjs"],
        },
      ],
      posts: ["open-sourcing-rtcs", "pilot"],
    });
  });

  it("breaks equal dates by series name and post title", () => {
    const tied: BlogIndexPost[] = [
      {
        id: "b-post",
        data: {
          title: "Bravo",
          description: "",
          date: new Date("2024-01-01"),
        },
      },
      {
        id: "a-post",
        data: {
          title: "Alpha",
          description: "",
          date: new Date("2024-01-01"),
        },
      },
      {
        id: "zeta",
        data: {
          title: "Zeta",
          description: "",
          date: new Date("2024-01-01"),
          series: { name: "Zeta", order: 1 },
        },
      },
      {
        id: "alpha-series",
        data: {
          title: "Alpha series",
          description: "",
          date: new Date("2024-01-01"),
          series: { name: "Alpha", order: 1 },
        },
      },
    ];

    expect(summarizeIndex(buildBlogIndex(tied))).toEqual({
      series: [
        { name: "Alpha", ids: ["alpha-series"] },
        { name: "Zeta", ids: ["zeta"] },
      ],
      posts: ["a-post", "b-post"],
    });
  });

  it("lists series posts newest first and breaks date ties by later part", () => {
    const tiedParts: BlogIndexPost[] = [
      {
        id: "part-1",
        data: {
          title: "Part 1",
          description: "",
          date: new Date("2024-06-01"),
          series: { name: "Tied", order: 1 },
        },
      },
      {
        id: "part-3",
        data: {
          title: "Part 3",
          description: "",
          date: new Date("2024-07-01"),
          series: { name: "Tied", order: 3 },
        },
      },
      {
        id: "part-2",
        data: {
          title: "Part 2",
          description: "",
          date: new Date("2024-06-01"),
          series: { name: "Tied", order: 2 },
        },
      },
    ];

    expect(summarizeIndex(buildBlogIndex(tiedParts))).toEqual({
      series: [{ name: "Tied", ids: ["part-3", "part-2", "part-1"] }],
      posts: [],
    });
  });
});

function summarizeIndex(index: BlogIndex) {
  return {
    series: index.series.map((entry) => ({
      name: entry.name,
      ids: entry.posts.map((post) => post.id),
    })),
    posts: index.posts.map((post) => post.id),
  };
}

describe("pickFeaturedPost", () => {
  const older: BlogIndexPost = {
    id: "configuring-nestjs",
    data: {
      title: "Configuring NestJS applications",
      description: "Configuration",
      date: new Date("2024-02-05"),
      status: "stable",
      series: { name: "NestJS", order: 1 },
    },
  };
  const newer: BlogIndexPost = {
    id: "notes",
    data: {
      title: "A note",
      description: "Notes",
      date: new Date("2025-01-01"),
      status: "stable",
      series: { name: "Notes", order: 1 },
    },
  };

  it("selects the newest post it is given, regardless of order", () => {
    expect(pickFeaturedPost([older, newer])?.id).toBe("notes");
    expect(pickFeaturedPost([newer, older])?.id).toBe("notes");
  });

  it("returns undefined when there are no posts", () => {
    expect(pickFeaturedPost([])).toBeUndefined();
  });

  it("keeps the earlier post when dates tie", () => {
    const first = { ...older, id: "first" };
    const second = { ...older, id: "second" };
    expect(pickFeaturedPost([first, second])?.id).toBe("first");
  });

  it("follows draft filtering done before it runs", () => {
    const draft: BlogIndexPost = {
      id: "later-draft",
      data: {
        title: "Later draft",
        description: "Later",
        date: new Date("2026-10-03"),
        status: "draft",
      },
    };
    const production = [draft, newer].filter((post) =>
      isPostVisible(post, { includeDrafts: false }),
    );
    expect(pickFeaturedPost(production)?.id).toBe("notes");
    expect(pickFeaturedPost([draft, newer])?.id).toBe("later-draft");
  });
});

describe("seriesSlug", () => {
  it("derives a stable url slug from the series name", () => {
    expect(seriesSlug("NestJS")).toBe("nestjs");
    expect(seriesSlug("Sample series")).toBe("sample-series");
    expect(seriesSlug("Hello, World!")).toBe("hello-world");
  });

  it("falls back when the name has no url characters", () => {
    expect(seriesSlug("   ")).toBe("series");
  });
});

describe("seriesHref", () => {
  it("builds the series page path from the slug", () => {
    expect(seriesHref("NestJS")).toBe("/series/nestjs");
    expect(seriesHref("Sample series")).toBe("/series/sample-series");
  });
});

describe("seriesSlidePosts", () => {
  const slidePosts: BlogIndexPost[] = [
    {
      id: "middle",
      data: {
        title: "Middle",
        description: "",
        date: new Date("2024-03-01"),
        series: { name: "NestJS", order: 2 },
      },
    },
    {
      id: "last",
      data: {
        title: "Last",
        description: "",
        date: new Date("2024-08-05"),
        series: { name: "NestJS", order: 3 },
      },
    },
    {
      id: "first",
      data: {
        title: "First",
        description: "",
        date: new Date("2024-02-05"),
        series: { name: "NestJS", order: 1 },
      },
    },
  ];

  it("returns the only post once", () => {
    expect(seriesSlidePosts([slidePosts[2]!]).map((post) => post.id)).toEqual([
      "first",
    ]);
  });

  it("returns both posts when the series has two", () => {
    expect(
      seriesSlidePosts([slidePosts[1]!, slidePosts[2]!]).map((post) => post.id),
    ).toEqual(["first", "last"]);
  });

  it("returns the first and last posts and skips the middle", () => {
    expect(seriesSlidePosts(slidePosts).map((post) => post.id)).toEqual([
      "first",
      "last",
    ]);
  });
});

describe("getSeriesName", () => {
  it("returns the series name when present", () => {
    expect(getSeriesName(posts[0]!)).toBe("NestJS");
  });

  it("returns undefined when the post has no series", () => {
    expect(getSeriesName(posts[3]!)).toBeUndefined();
  });
});
