import clsx from "clsx";
import type { ImageGridSection } from "@/content/types";

const COLS_CLASS: Record<1 | 2 | 3, string> = {
  1: "grid-cols-1",
  2: "grid-cols-1 md:grid-cols-2",
  3: "grid-cols-1 md:grid-cols-3",
};

/** Image grid module — placeholders today, real imagery in Phase 4. */
export function ImageGrid({ section }: { section: ImageGridSection }) {
  return (
    <div className={clsx("my-12 grid gap-6", COLS_CLASS[section.cols])}>
      {section.images.map((image, i) => (
        <figure key={`${image.src}-${i}`} className="flex flex-col gap-2">
          <div
            aria-label={image.alt}
            className="aspect-[4/3] w-full rounded-2xl"
            style={{
              backgroundColor:
                "color-mix(in srgb, var(--surface-graphite) 18%, transparent)",
            }}
          />
          {image.caption ? (
            <figcaption className="text-mono-s text-[color:var(--surface-graphite)]">
              {image.caption}
            </figcaption>
          ) : null}
        </figure>
      ))}
    </div>
  );
}
