export type ThemeVariant = "light" | "dark"

/**
 * Cover themes matched to the blog homepage page backdrop
 * (`apps/web/src/components/layout/background.astro` + `--background`).
 */
export type CoverTheme = {
  background: string
  title: string
  subtitle: string
  /** Stacked radial gradients matching background.astro (Satori-friendly layers). */
  gradients: string[]
}

export const THEMES: Record<ThemeVariant, CoverTheme> = {
  light: {
    // --background (light)
    background: "#ffffff",
    title: "#0a0a0a",
    subtitle: "#171717",
    gradients: [
      "radial-gradient(ellipse 95% 60% at 50% -18%, rgba(255,149,77,0.20), transparent 58%)",
      "radial-gradient(ellipse 55% 45% at 100% 0%, rgba(167,139,250,0.10), transparent 52%)",
      "radial-gradient(ellipse 70% 50% at 0% 100%, rgba(251,191,36,0.06), transparent 55%)",
    ],
  },
  dark: {
    // --background (dark)
    background: "#0a0a0a",
    title: "#fafafa",
    subtitle: "#f5f5f5",
    gradients: [
      "radial-gradient(ellipse 80% 80% at 50% -20%, rgba(120,119,198,0.3), rgba(255,255,255,0))",
    ],
  },
}

export const CANVAS = {
  width: 1200,
  height: 630,
} as const
