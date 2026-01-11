import { defineEcConfig } from "astro-expressive-code";

export default defineEcConfig({
  themeCssSelector: (theme) => {
    const isDarkTheme = theme.name === "github-dark";
    return isDarkTheme ? ".dark *" : ":not(.dark *)";
  },
});
