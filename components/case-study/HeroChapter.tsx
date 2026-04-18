import type { CaseStudy } from "@/content/types";

/**
 * Page intro for a case study — replaces the Phase 2 CaseStudyHeader +
 * QuickFacts + Brief stack.
 *
 * Layout, top to bottom:
 *   - tiny mono breadcrumb (CASE STUDY 00X · status)
 *   - display heading (italic, display-l — quieter than the home hero)
 *   - 3-column metadata strip: ROLE · CREDITS · TIME
 *   - one-paragraph brief in display body, two-column with a label on the left
 *
 * The 60vh keyColor "hero image" from Phase 2 is gone — the new layout
 * trusts the title and the brief to set the tone, with imagery slotted
 * into chapter bodies via ImageGrid / MockupFrame / TabGroup instead.
 */
export function HeroChapter({
  cs,
  index,
}: {
  cs: CaseStudy;
  index: number;
}) {
  const number = String(index + 1).padStart(3, "0");

  return (
    <header className="pt-[clamp(140px,22vh,260px)] pb-[clamp(80px,12vh,160px)]">
      {/* Breadcrumb */}
      <div className="text-mono-s text-[color:var(--surface-graphite)]">
        <span>CASE STUDY {number}</span>
      </div>

      {/* Title — display-l, italic, generous max-width */}
      <h1 className="mt-10 max-w-[26ch] text-display-l italic text-[color:var(--surface-ink)]">
        {cs.title}
      </h1>

      {/* Metadata strip — three columns at md+, stacked below */}
      <dl className="mt-16 grid grid-cols-1 gap-10 md:grid-cols-3">
        <MetaBlock label="ROLE" value={cs.role} />
        <MetaBlock label="CREDITS" value={cs.credits ?? cs.team} />
        <MetaBlock label="TIME" value={cs.timeline} />
      </dl>

      {/* Brief — labelled left column + prose right column */}
      <div className="mt-24 grid grid-cols-1 gap-10 md:grid-cols-12">
        <span className="text-mono-s text-[color:var(--surface-graphite)] md:col-span-3">
          THE BRIEF
        </span>
        <p className="max-w-[44ch] text-display-s italic text-[color:var(--surface-ink)] md:col-span-9">
          {cs.brief}
        </p>
      </div>
    </header>
  );
}

function MetaBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-3">
      <dt className="text-mono-s text-[color:var(--surface-graphite)]">
        {label}
      </dt>
      <dd className="whitespace-pre-line text-mono-m text-[color:var(--surface-ink)]">
        {value}
      </dd>
    </div>
  );
}
