import { about } from "@/lib/content-about";

/**
 * Brief §4.4 — below the pulled quote. Two columns: one personal, one
 * professional. Both use the display face at body size — no separate
 * sans-serif. The split is tonal, not structural.
 *
 * Copy comes from `content/about.json` via `lib/content-about.ts`.
 */
export function BioColumns() {
  return (
    <section className="hairline-top">
      <div className="mx-auto max-w-[1280px] px-[clamp(24px,4vw,64px)] py-[clamp(120px,18vh,200px)]">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
          <div className="md:col-span-3">
            <span className="text-mono-s text-[color:var(--surface-graphite)]">
              01 — ABOUT
            </span>
          </div>

          {/* Personal column */}
          <div className="md:col-span-4">
            <span className="text-mono-s text-[color:var(--surface-graphite)]">
              PERSONAL
            </span>
            <p className="mt-6 max-w-[36ch] text-body text-[color:var(--surface-ink)]">
              {about.bio.personal}
            </p>
          </div>

          {/* Professional column */}
          <div className="md:col-span-5">
            <span className="text-mono-s text-[color:var(--surface-graphite)]">
              PROFESSIONAL
            </span>
            <p className="mt-6 max-w-[42ch] text-body text-[color:var(--surface-ink)]">
              {about.bio.professional}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
