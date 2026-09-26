import { defineEcConfig } from "astro-expressive-code";

const codeFontFamily =
  '"JetBrains Mono Variable", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace';

export default defineEcConfig({
  themes: ["github-light", "vesper"],
  // Keep Vesper's muted token colors. The default contrast pass brightens them.
  minSyntaxHighlightingColorContrast: 0,
  themeCssSelector: (theme) =>
    theme.type === "dark" ? ".dark *" : ":not(.dark *)",
  styleOverrides: {
    codeFontFamily,
    codeFontSize: "13px",
    codeLineHeight: "1.7",
  },
});
