import { timeline, education, awards } from "@/content/timeline";

const KIND_LABEL: Record<(typeof timeline)[number]["kind"], string> = {
  "full-time": "FT",
  "part-time": "PT",
  "internship": "INTERN",
  "contract": "CONTRACT",
  "service": "SERVICE",
};

function formatRange(start: string, end: string) {
  // "2024-08" → "2024". Years are the right granularity for a spec-sheet read.
  const s = start.slice(0, 4);
  const e = end === "present" ? "PRESENT" : end.slice(0, 4);
  if (s === e) return s;
  return `${s} — ${e}`;
}

/**
 * Brief §4.4 — "A timeline section styled like a hardware spec sheet:
 * 2014 — 2018 · [COMPANY] · [ROLE] in mono, with a one-line description
 * in display. No logos."
 *
 * Data source: content/timeline.ts — sourced from LinkedIn on 2026-04-10.
 */
export function Timeline() {
  return (
    <section className="hairline-top">
      <div className="mx-auto max-w-[1280px] px-[clamp(24px,4vw,64px)] py-[clamp(120px,18vh,200px)]">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
          <div className="md:col-span-3">
            <span className="text-mono-s text-[color:var(--surface-graphite)]">
              02 — TIMELINE
            </span>
          </div>

          <div className="md:col-span-9">
            <ol className="flex flex-col">
              {timeline.map((role) => (
                <li
                  key={`${role.company}-${role.start}-${role.role}`}
                  className="grid grid-cols-1 gap-4 border-t border-[color:color-mix(in_srgb,var(--surface-graphite)_25%,transparent)] py-6 md:grid-cols-12 md:gap-6"
                >
                  <span className="text-mono-s text-[color:var(--surface-graphite)] md:col-span-3">
                    {formatRange(role.start, role.end)}
                    {role.kind !== "full-time" ? (
                      <span className="opacity-70">
                        {" "}
                        · {KIND_LABEL[role.kind]}
                      </span>
                    ) : null}
                  </span>
                  <span className="text-mono-s text-[color:var(--surface-ink)] md:col-span-3">
                    {role.company.toUpperCase()}
                  </span>
                  <div className="md:col-span-6">
                    <div className="text-display-s text-[color:var(--surface-ink)]">
                      {role.role}
                    </div>
                    {role.highlight ? (
                      <div className="mt-1 text-mono-s text-[color:var(--surface-graphite)]">
                        {role.highlight}
                      </div>
                    ) : null}
                  </div>
                </li>
              ))}
            </ol>

            {/* Education */}
            <h3 className="mt-16 text-mono-s text-[color:var(--surface-graphite)]">
              EDUCATION
            </h3>
            <ul className="mt-4 flex flex-col">
              {education.map((entry) => (
                <li
                  key={entry.school}
                  className="grid grid-cols-1 gap-4 border-t border-[color:color-mix(in_srgb,var(--surface-graphite)_25%,transparent)] py-6 md:grid-cols-12 md:gap-6"
                >
                  <span className="text-mono-s text-[color:var(--surface-graphite)] md:col-span-3">
                    {entry.start} — {entry.end}
                  </span>
                  <span className="text-mono-s text-[color:var(--surface-ink)] md:col-span-3">
                    {entry.school.toUpperCase()}
                  </span>
                  <div className="md:col-span-6">
                    <div className="text-display-s text-[color:var(--surface-ink)]">
                      {entry.degree}
                    </div>
                    {entry.highlight ? (
                      <div className="mt-1 text-mono-s text-[color:var(--surface-graphite)]">
                        {entry.highlight}
                      </div>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>

            {/* Awards */}
            <h3 className="mt-16 text-mono-s text-[color:var(--surface-graphite)]">
              SELECTED AWARDS
            </h3>
            <ul className="mt-4 flex flex-col">
              {awards.map((award) => (
                <li
                  key={award.name}
                  className="border-t border-[color:color-mix(in_srgb,var(--surface-graphite)_25%,transparent)] py-4 text-body text-[color:var(--surface-ink)]"
                >
                  {award.name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
