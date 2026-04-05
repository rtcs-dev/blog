import * as React from "react";

import { Button } from "@/components/ui/button";
import { getThemePreference } from "@/lib/theme";
import MoonIcon from "@/icons/theme/moon.svg?react";
import SunIcon from "@/icons/theme/sun.svg?react";

type ViewTransitionDocument = Document & {
  startViewTransition?: (callback: () => void) => {
    finished: Promise<void>;
  };
};

function cleanupThemeRipple(root: HTMLElement) {
  root.removeAttribute("data-theme-vt");
  root.style.removeProperty("--theme-ripple-x");
  root.style.removeProperty("--theme-ripple-y");
  root.style.removeProperty("--theme-ripple-r");
}

export function ThemeSwitcher() {
  React.useEffect(() => {
    const theme = getThemePreference();
    const isDark = theme === "dark";

    document.documentElement.classList[isDark ? "add" : "remove"]("dark");

    const observer = new MutationObserver(() => {
      const isDarkMode = document.documentElement.classList.contains("dark");
      localStorage.setItem("theme", isDarkMode ? "dark" : "light");
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const theme = getThemePreference();
    const shouldSwitchToDark = theme !== "dark";

    const applyTheme = () => {
      document.documentElement.classList[shouldSwitchToDark ? "add" : "remove"](
        "dark",
      );
    };

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const root = document.documentElement;
    const transitionDocument = document as ViewTransitionDocument;

    if (!prefersReducedMotion && transitionDocument.startViewTransition) {
      const x = event.clientX;
      const y = event.clientY;
      const r =
        Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y)) +
        8;

      root.style.setProperty("--theme-ripple-x", `${x}px`);
      root.style.setProperty("--theme-ripple-y", `${y}px`);
      root.style.setProperty("--theme-ripple-r", `${r}px`);
      root.dataset.themeVt = "ripple";

      const transition = transitionDocument.startViewTransition(applyTheme);
      void transition.finished.finally(() => cleanupThemeRipple(root));
      return;
    }

    applyTheme();
  };

  return (
    <Button
      aria-label="theme-button"
      id="theme-button"
      variant="ghost"
      size="icon"
      className="size-12 rounded-lg"
      onClick={handleClick}
    >
      <MoonIcon className="size-4 dark:hidden" />
      <SunIcon className="hidden size-4 dark:block" />
    </Button>
  );
}
