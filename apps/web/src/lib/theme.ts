export type ThemePreference = "dark" | "light";

/** Keep in sync with `--background` in `src/styles/globals.css`. */
export const THEME_BACKGROUNDS = {
  light: "#ffffff",
  dark: "#0a0a0a",
} as const;

export const getThemePreference = (): ThemePreference => {
  if (localStorage && localStorage.getItem("theme")) {
    return localStorage.getItem("theme") as ThemePreference;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

export function syncBrowserChrome(
  isDark: boolean,
  doc: Document = document,
) {
  const color = isDark ? THEME_BACKGROUNDS.dark : THEME_BACKGROUNDS.light;
  doc.documentElement.style.colorScheme = isDark ? "dark" : "light";

  let meta = doc.querySelector('meta[name="theme-color"]');
  if (!(meta instanceof HTMLMetaElement)) {
    meta = doc.createElement("meta");
    meta.name = "theme-color";
    doc.head.appendChild(meta);
  }
  meta.content = color;
}
