import type { Chapter } from "@/content/types";

/**
 * Eyebrow + display heading at the top of every chapter.
 *
 * Eyebrow is small and italic-feeling (uses the display face at body size).
 * Heading is display-m italic — intentionally smaller than the page hero
 * (display-l) so the hero stays the loudest moment.
 */
export function ChapterHeader({ chapter }: { chapter: Chapter }) {
  return (
    <header className="pb-12">
      <span
        className="block text-body italic text-[color:var(--surface-graphite)]"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {chapter.eyebrow}
      </span>
      <h2 className="mt-2 max-w-[24ch] text-display-m italic text-[color:var(--surface-ink)]">
        {chapter.title}
      </h2>
    </header>
  );
}
