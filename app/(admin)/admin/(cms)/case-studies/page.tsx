import Link from "next/link";

import { loadAllCaseStudies } from "@/lib/content";

/**
 * List view for the case-studies collection. Reads all .json files from
 * `content/work/`, shows each as a row with title, status, tag chips, and
 * a link to its edit page.
 */
export default async function CaseStudiesIndex() {
  const studies = await loadAllCaseStudies();

  return (
    <div className="mx-auto max-w-[920px] px-[clamp(24px,4vw,64px)] py-[clamp(80px,12vh,160px)]">
      <span className="text-mono-s text-[color:var(--surface-graphite)]">
        01 — CASE STUDIES
      </span>
      <h1 className="mt-6 max-w-[24ch] text-display-l italic text-[color:var(--surface-ink)]">
        Case studies
      </h1>
      <p className="mt-6 max-w-[55ch] text-body text-[color:var(--surface-graphite)]">
        {studies.length} {studies.length === 1 ? "case study" : "case studies"}
        . Click any row to edit its chapters and sections.
      </p>

      <ul className="mt-16 flex flex-col">
        {studies.map((cs, i) => (
          <li key={cs.slug}>
            <Link
              href={`/admin/case-studies/${cs.slug}`}
              className="group grid grid-cols-12 gap-6 border-t border-[color:color-mix(in_srgb,var(--surface-graphite)_25%,transparent)] py-8 transition-colors duration-500 ease-[var(--ease-out-soft)] last:border-b hover:bg-[color:color-mix(in_srgb,var(--surface-graphite)_8%,transparent)]"
            >
              <span className="col-span-1 text-mono-s text-[color:var(--surface-graphite)]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="col-span-7">
                <h2 className="text-display-s italic text-[color:var(--surface-ink)]">
                  {cs.title}
                </h2>
                <div className="mt-2 flex flex-wrap items-center gap-3 text-mono-s text-[color:var(--surface-graphite)]">
                  <span>{cs.timeline}</span>
                  <span>·</span>
                  <span>{cs.chapters.length} chapters</span>
                  {cs.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center rounded-full border border-[color:color-mix(in_srgb,var(--surface-graphite)_40%,transparent)] px-2 py-0.5"
                    >
                      {tag.toUpperCase()}
                    </span>
                  ))}
                </div>
              </div>
              <span className="col-span-4 self-start text-right text-mono-s text-[color:var(--surface-graphite)]">
                PUBLIC
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
