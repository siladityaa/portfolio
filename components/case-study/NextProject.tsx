import Link from "next/link";
import type { CaseStudy } from "@/content/types";

/**
 * Two-thirds viewport block with giant mono NEXT → and the next project's
 * title in display-xl. Brief §4.3 item 8.
 *
 * Keyboard arrow-key nav is Phase 3; this component ships with mouse/touch
 * navigation only.
 */
export function NextProject({ cs }: { cs: CaseStudy }) {
  if (!cs.next) return null;

  return (
    <section className="hairline-top">
      <Link
        href={`/work/${cs.next.slug}`}
        data-cursor="open"
        className="group block"
      >
        <div className="mx-auto flex min-h-[66vh] max-w-[1280px] flex-col justify-between gap-16 px-[clamp(24px,4vw,64px)] py-[clamp(80px,12vh,160px)]">
          <span className="text-mono-s text-[color:var(--surface-graphite)]">
            NEXT →
          </span>
          <h2 className="max-w-[22ch] text-display-xl italic text-[color:var(--surface-ink)] transition-opacity duration-500 ease-[var(--ease-out-soft)] group-hover:opacity-70">
            {cs.next.title}
          </h2>
        </div>
      </Link>
    </section>
  );
}
