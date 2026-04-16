import { influences } from "@/content/influences";

/**
 * Brief §4.4 — "A grid of 12 small cards, each representing an influence.
 * Each card is monochrome with a single sentence about *why*. Not a mood
 * board — a curation with opinions. This section is the portfolio's
 * secret weapon — it's the part hiring managers will screenshot."
 *
 * No logos, no images. Just type + hairlines. The whole point of the
 * section is that the opinions do the work.
 */
export function InfluencesGrid() {
  return (
    <section className="hairline-top">
      <div className="mx-auto max-w-[1280px] px-[clamp(24px,4vw,64px)] py-[clamp(120px,18vh,200px)]">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
          <div className="md:col-span-3">
            <span className="text-mono-s text-[color:var(--surface-graphite)]">
              03 — INFLUENCES
            </span>
            <p className="mt-6 max-w-[28ch] text-body text-[color:var(--surface-graphite)]">
              Twelve things I keep coming back to — one sentence on each.
            </p>
          </div>

          <ul className="grid grid-cols-1 gap-x-10 gap-y-12 md:col-span-9 md:grid-cols-2 lg:grid-cols-3">
            {influences.map((inf, i) => (
              <li
                key={inf.name}
                className="flex flex-col gap-4 border-t border-[color:color-mix(in_srgb,var(--surface-graphite)_25%,transparent)] pt-6"
              >
                <div className="flex items-baseline justify-between gap-4">
                  <span className="text-mono-s text-[color:var(--surface-graphite)]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-mono-s text-[color:var(--surface-graphite)]">
                    {inf.category.toUpperCase()}
                  </span>
                </div>
                <h3 className="text-display-s text-[color:var(--surface-ink)]">
                  {inf.name}
                </h3>
                <p className="max-w-[32ch] text-body text-[color:var(--surface-graphite)]">
                  {inf.why}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
