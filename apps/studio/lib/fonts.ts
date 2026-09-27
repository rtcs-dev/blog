export type FontWeight = 400 | 700

export function getFontUrl({ weight }: { weight: FontWeight }) {
  return `https://cdn.jsdelivr.net/fontsource/fonts/inter@latest/latin-${weight}-normal.woff`
}

export function getFontsFromParams(params: {
  title: { fontWeight: FontWeight }
  subtitle: { fontWeight: FontWeight }
}) {
  const weights = new Set<FontWeight>([
    params.title.fontWeight,
    params.subtitle.fontWeight,
  ])
  return [...weights].map((weight) => ({ family: "inter" as const, weight }))
}
