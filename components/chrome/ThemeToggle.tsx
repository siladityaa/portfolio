"use client";

import { useCallback, useEffect, useState } from "react";

type Theme = "light" | "dark";

/**
 * Manual theme toggle.
 *
 * Sits in the footer; the site otherwise follows the OS color-scheme via
 * `ThemeAutoSync`. Clicking pins an override in localStorage. Clicking
 * back into a state that matches the OS clears the override, returning
 * the page to auto-follow mode (so users can opt back into "system"
 * without dev tools).
 *
 * Local React state is kept in sync with `<html class="dark">` via a
 * MutationObserver — that way, ambient OS changes propagate into the
 * button label without us needing a duplicate listener here.
 */
export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const html = document.documentElement;

    function sync() {
      setTheme(html.classList.contains("dark") ? "dark" : "light");
    }

    sync();
    setReady(true);

    // Watch for any class changes — covers OS-driven flips from
    // ThemeAutoSync as well as our own toggle clicks.
    const observer = new MutationObserver(sync);
    observer.observe(html, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  const toggle = useCallback(() => {
    setTheme((current) => {
      const next: Theme = current === "dark" ? "light" : "dark";
      document.documentElement.classList.toggle("dark", next === "dark");

      try {
        const osPrefersDark = window.matchMedia(
          "(prefers-color-scheme: dark)",
        ).matches;
        const osTheme: Theme = osPrefersDark ? "dark" : "light";
        if (next === osTheme) {
          // The toggle landed back on the OS preference — drop the override
          // so future ambient OS changes propagate again.
          localStorage.removeItem("theme");
        } else {
          // Pin the explicit override.
          localStorage.setItem("theme", next);
        }
      } catch {
        /* private mode, quota, etc. */
      }

      return next;
    });
  }, []);

  return (
    <button
      type="button"
      onClick={toggle}
      data-cursor="view"
      aria-label={
        ready ? `Switch to ${theme === "dark" ? "light" : "dark"} mode` : "Toggle theme"
      }
      className="text-mono-s text-[color:var(--surface-graphite)] transition-opacity duration-300 ease-[var(--ease-out-soft)] hover:opacity-60"
    >
      ◑ {ready ? (theme === "dark" ? "LIGHT" : "DARK") : "THEME"}
    </button>
  );
}
