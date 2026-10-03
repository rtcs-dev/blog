/** True when a post should be visible given the current deploy context. */
export function isPostVisible(
  status: "draft" | "stable",
  includeDrafts: boolean,
): boolean {
  if (includeDrafts) return true;
  return status === "stable";
}
