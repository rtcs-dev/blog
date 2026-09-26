export type ThemeVariant = "light" | "dark"

export const THEMES: Record<
  ThemeVariant,
  { background: string; title: string; subtitle: string; noise: number }
> = {
  light: {
    background: "#fafafa",
    title: "#0a0a0a",
    subtitle: "#171717",
    noise: 0.18,
  },
  dark: {
    background: "#121212",
    title: "#fafafa",
    subtitle: "#f5f5f5",
    noise: 0.22,
  },
}

export const CANVAS = {
  width: 1200,
  height: 630,
} as const
