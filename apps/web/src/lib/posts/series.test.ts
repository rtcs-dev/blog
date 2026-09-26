import { describe, expect, it } from "vitest";
import {
  getSeriesMembers,
  getSeriesName,
  isPostVisible,
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
    expect(
      getSeriesMembers(posts, "NestJS", { includeDrafts: false }),
    ).toEqual([
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
    ]);
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

describe("getSeriesName", () => {
  it("returns the series name when present", () => {
    expect(getSeriesName(posts[0]!)).toBe("NestJS");
  });

  it("returns undefined when the post has no series", () => {
    expect(getSeriesName(posts[3]!)).toBeUndefined();
  });
});
