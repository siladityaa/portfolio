"use client";

/**
 * Animated Meta infinity symbol — the morphing official animation, recolored
 * to monotone with a transparent background.
 *
 * Source: Meta's published animated brand mark, converted to two APNGs in
 * /public:
 *   - meta-symbol-anim-black.png  (used in light mode)
 *   - meta-symbol-anim-white.png  (used in dark mode)
 *
 * Auto-swaps via the `.dark` class on <html> (managed by ThemeAutoSync).
 *
 * Sized via the `em` unit so it always scales with the parent font-size.
 * Drop it inline anywhere a word would go.
 */
export function MetaSymbol({ className = "" }: { className?: string }) {
  return (
    <span
      aria-label="Meta"
      role="img"
      className={`relative inline-block align-baseline ${className}`}
      style={{
        // The processed asset is square (256×256), trimmed close to the symbol.
        // Sizing both width and height as a fraction of em keeps it inline.
        width: "0.95em",
        height: "0.95em",
        // Nudge down so the symbol sits visually centered on the cap height
        // of the surrounding serif text rather than the descender baseline.
        verticalAlign: "-0.18em",
      }}
    >
      {/* Light mode — black symbol */}
      <img
        src="/meta-symbol-anim-black.png"
        alt=""
        aria-hidden
        className="absolute inset-0 h-full w-full object-contain dark:hidden"
        draggable={false}
      />
      {/* Dark mode — white symbol */}
      <img
        src="/meta-symbol-anim-white.png"
        alt=""
        aria-hidden
        className="absolute inset-0 hidden h-full w-full object-contain dark:block"
        draggable={false}
      />
    </span>
  );
}
