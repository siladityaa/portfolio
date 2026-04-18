"use client";

import { useEffect } from "react";

/**
 * Brief §5.3 — Console Easter egg.
 * When devtools opens, a mono-formatted message appears in the console.
 * Renders nothing to the DOM.
 */
export function ConsoleEasterEgg() {
  useEffect(() => {
    const styles = [
      "font-family: 'JetBrains Mono', 'Berkeley Mono', monospace",
      "font-size: 13px",
      "line-height: 1.6",
      "color: #6B6B70",
    ].join(";");

    const accent = [
      "font-family: 'JetBrains Mono', 'Berkeley Mono', monospace",
      "font-size: 13px",
      "line-height: 1.6",
      "color: #FF3B00",
    ].join(";");

    console.log(
      `%c// you're the kind of person I want to talk to\n%c// siladityaa@gmail.com\n\n%c// built with Next.js, Tailwind, Framer Motion\n// fonts: Instrument Serif + JetBrains Mono\n// source: github.com/siladityaa/portfolio`,
      accent,
      accent,
      styles,
    );
  }, []);

  return null;
}
