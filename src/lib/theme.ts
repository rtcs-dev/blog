export type ThemePreference = "dark" | "light";

export const getThemePreference = (): ThemePreference => {
  if (localStorage && localStorage.getItem("theme")) {
    return localStorage.getItem("theme") as ThemePreference;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};
