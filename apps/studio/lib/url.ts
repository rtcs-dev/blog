export function absoluteUrl(path: string) {
  const baseUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : "http://localhost:3010"
  return new URL(path, baseUrl).toString()
}
