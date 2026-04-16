import { nowFacts, previouslyFacts } from "@/content/now";

/**
 * Brief §4.4 — Currently / Previously block that lives off the same
 * `now.ts` as the home. Read like a hardware side panel.
 */
export function CurrentlyPreviously() {
  return (
    <section className="hairline-top">
      <div className="mx-auto max-w-[1280px] px-[clamp(24px,4vw,64px)] py-[clamp(120px,18vh,200px)]">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
          <div className="md:col-span-3">
            <span className="text-mono-s text-[color:var(--surface-graphite)]">
              04 — SIDE PANEL
            </span>
          </div>

          <FactList
            label="CURRENTLY"
            facts={nowFacts}
            className="md:col-span-4"
          />
          <FactList
            label="PREVIOUSLY"
            facts={previouslyFacts}
            className="md:col-span-5"
          />
        </div>
      </div>
    </section>
  );
}

function FactList({
  label,
  facts,
  className,
}: {
  label: string;
  facts: Array<{ label: string; value: string }>;
  className?: string;
}) {
  return (
    <div className={className}>
      <span className="text-mono-s text-[color:var(--surface-graphite)]">
        {label}
      </span>
      <dl className="mt-6 flex flex-col">
        {facts.map((fact) => (
          <div
            key={fact.label}
            className="grid grid-cols-12 gap-4 border-t border-[color:color-mix(in_srgb,var(--surface-graphite)_25%,transparent)] py-4"
          >
            <dt className="col-span-4 text-mono-s text-[color:var(--surface-graphite)]">
              {fact.label}
            </dt>
            <dd className="col-span-8 text-mono-s text-[color:var(--surface-ink)]">
              {fact.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
