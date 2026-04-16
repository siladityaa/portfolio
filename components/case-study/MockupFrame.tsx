import type { MockupFrameSection } from "@/content/types";

/**
 * Full-bleed dark rounded frame for a single big mockup. The frame
 * intentionally inverts the surface (always dark) so production UI
 * mockups read correctly on either light or dark page background.
 *
 * Phase 4 swaps the placeholder block for `<img src={section.src} />`.
 */
export function MockupFrame({ section }: { section: MockupFrameSection }) {
  return (
    <figure className="my-12 flex flex-col gap-3">
      <div className="overflow-hidden rounded-2xl border border-[#1a1a1c] bg-[#0b0b0c] p-3">
        <div
          aria-label={section.alt}
          className="aspect-[16/10] w-full rounded-xl"
          style={{ backgroundColor: "#161618" }}
        />
      </div>
      {section.caption ? (
        <figcaption className="text-mono-s text-[color:var(--surface-graphite)]">
          {section.caption.toUpperCase()}
        </figcaption>
      ) : null}
    </figure>
  );
}
