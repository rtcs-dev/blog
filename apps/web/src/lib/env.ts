export function includeDraftPosts(): boolean {
  return import.meta.env.DEV;
}
