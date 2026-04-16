import { about } from "@/lib/content-about";

/**
 * Brief §4.4 — top of /about. A single pulled quote in display-xl,
 * centered, lots of air. No attribution, no quotation marks — it reads
 * as the designer's own voice, not a citation.
 *
 * Copy comes from `content/about.json` via `lib/content-about.ts` so the
 * CMS can edit it.
 */
export function PulledQuote() {
  return (
    <section className="hairline-top">
      <div className="mx-auto flex max-w-[1280px] items-center justify-center px-[clamp(24px,4vw,64px)] py-[clamp(160px,24vh,280px)]">
        <h1 className="max-w-[24ch] text-center text-display-xl italic text-[color:var(--surface-ink)]">
          {about.pulledQuote}
        </h1>
      </div>
    </section>
  );
}
