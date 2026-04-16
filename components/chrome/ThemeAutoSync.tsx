"use client";

import { useEffect } from "react";

/**
 * Live OS theme listener.
 *
 * Mounted once in the root layout so it's active on every page (the
 * footer-mounted ThemeToggle isn't enough on its own — case study pages
 * don't render the footer).
 *
 * The site follows the user's device color-scheme by default. If the user
 * has explicitly toggled via the footer button, that choice is pinned to
 * localStorage and this listener respects it — only ambient OS changes
 * (no override) propagate.
 *
 * Renders nothing.
 */
export function ThemeAutoSync() {
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    function applyIfAuto(matches: boolean) {
      let stored: string | null = null;
      try {
        stored = localStorage.getItem("theme");
      } catch {
        /* private mode, quota, etc. */
      }
      // An explicit override pins the theme — leave the class alone.
      if (stored === "dark" || stored === "light") return;
      document.documentElement.classList.toggle("dark", matches);
    }

    // Sync once on mount in case the OS preference shifted between SSR and
    // hydration.
    applyIfAuto(mediaQuery.matches);

    function handleChange(event: MediaQueryListEvent) {
      applyIfAuto(event.matches);
    }

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return null;
}
