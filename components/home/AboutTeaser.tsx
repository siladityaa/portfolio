import { nowFacts } from "@/content/now";

/**
 * Brief §4.1 — two-column home About teaser.
 * Left: ~60 words of prose in display face, body size.
 * Right: mono CURRENTLY / READING / BUILDING / LISTENING sourced from now.ts.
 */
export function AboutTeaser() {
  return (
    <section className="hairline-top mt-[clamp(120px,20vh,200px)]">
      <header className="mx-auto flex max-w-[1280px] items-baseline justify-between gap-4 px-[clamp(24px,4vw,64px)] pt-24 pb-10">
        <span className="text-mono-s text-[color:var(--surface-graphite)]">
          02 — ABOUT
        </span>
        <span className="text-mono-s text-[color:var(--surface-graphite)]">
          BIO + NOW
        </span>
      </header>

      <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-12 px-[clamp(24px,4vw,64px)] pb-24 md:grid-cols-12">
        {/* Left: prose */}
        <div className="md:col-span-7">
          {/* Bio sourced from LinkedIn (2026-04-10). A longer first-person
              version will live on /about in Phase 3. */}
          <p className="max-w-[55ch] text-display-s text-[color:var(--surface-ink)]">
            Senior Product Designer at Meta Reality Labs in Los Angeles,
            building wearables and the AI experiences around them — previously
            shipped Ray-Ban Stories and the second-generation Ray-Ban Meta
            Smart Glasses. Adjunct Instructor at ArtCenter College of Design,
            teaching Interactive Prototyping. Graduated ArtCenter with Honors
            in 2021.
          </p>
        </div>

        {/* Right: now list */}
        <dl className="flex flex-col gap-4 md:col-span-5">
          {nowFacts.map((fact) => (
            <div
              key={fact.label}
              className="flex items-baseline justify-between gap-6 hairline-bottom pb-3"
            >
              <dt className="text-mono-s text-[color:var(--surface-graphite)]">
                {fact.label}
              </dt>
              <dd className="text-mono-s text-right text-[color:var(--surface-ink)]">
                {fact.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
