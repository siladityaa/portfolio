import type { BeforeAfterSection } from "@/content/types";

/**
 * Side-by-side before/after with labeled pills in the top corners.
 * The xiangyi version is a draggable comparison slider — that's a Phase 5
 * polish beat (pointer event handling, clip-path animation). For now this
 * ships as a clean side-by-side that reads the same and avoids fragile UX.
 */
export function BeforeAfter({ section }: { section: BeforeAfterSection }) {
  return (
    <figure className="my-12">
      <div className="relative overflow-hidden rounded-2xl border border-[color:color-mix(in_srgb,var(--surface-graphite)_25%,transparent)]">
        <div className="grid grid-cols-2">
          <div
            aria-label={section.before.label}
            className="relative aspect-[16/10] border-r border-[color:color-mix(in_srgb,var(--surface-graphite)_25%,transparent)]"
            style={{
              backgroundColor:
                "color-mix(in srgb, var(--surface-graphite) 14%, transparent)",
            }}
          >
            <span className="absolute left-4 top-4 inline-flex items-center rounded-full bg-[color:color-mix(in_srgb,var(--surface-paper)_85%,transparent)] px-4 py-1.5 text-mono-s text-[color:var(--surface-ink)]">
              {section.before.label}
            </span>
          </div>
          <div
            aria-label={section.after.label}
            className="relative aspect-[16/10]"
            style={{
              backgroundColor:
                "color-mix(in srgb, var(--surface-graphite) 22%, transparent)",
            }}
          >
            <span className="absolute right-4 top-4 inline-flex items-center rounded-full bg-[color:var(--surface-ink)] px-4 py-1.5 text-mono-s text-[color:var(--surface-paper)]">
              {section.after.label}
            </span>
          </div>
        </div>
      </div>
    </figure>
  );
}
