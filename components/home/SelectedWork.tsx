import { loadAllCaseStudies } from "@/lib/content";
import { ProjectStack } from "@/components/shared/ProjectStack";
import type { ProjectRowData } from "@/components/shared/ProjectRow";

/**
 * Brief §4.1 — "01 — SELECTED WORK" + vertical list of up to 4 projects.
 *
 * Loads real case studies from `content/work/*.mdx` at build time. The
 * dedicated `/work` index was cut (2026-04-10) — this section is now the
 * one place work lives, reachable from anywhere via the `#work` anchor
 * in the top nav.
 *
 * Convention: slugs starting with `sample-` are excluded from listings
 * so the scaffold sample-project doesn't leak into real work.
 * Individual case studies are still addressable at `/work/[slug]`.
 */
export async function SelectedWork() {
  const all = await loadAllCaseStudies();
  const featured = all
    .filter((cs) => !cs.slug.startsWith("sample-"))
    .slice(0, 4);

  // Map tag enum values to human-readable labels for the category line.
  const TAG_LABEL: Record<string, string> = {
    wearables: "Wearables",
    ai: "AI",
    consumer: "Consumer",
    concept: "Concept",
  };

  const rows: ProjectRowData[] = featured.map((cs, i) => ({
    number: String(i + 1).padStart(3, "0"),
    year: cs.timeline,
    // First line of `credits` is the org + sub-team (e.g.
    // "Meta Reality Labs — Wearables"). We shorten "Meta Reality Labs"
    // to "Meta" for the home-page row — the full org name stays on the
    // case study page itself. Falls back to a sensible default when
    // credits are missing so the row still reads.
    client: (cs.credits?.split("\n")[0]?.trim() || "Meta").replace(
      /Meta Reality Labs/gi,
      "Meta",
    ),
    categories: cs.tags.map((t) => TAG_LABEL[t] ?? t),
    title: cs.title,
    slug: cs.slug,
    status: cs.status,
    keyColor: cs.keyColor,
    heroSrc: cs.hero?.src ?? "",
    heroAlt: cs.hero?.alt ?? cs.title,
  }));

  return (
    <section id="work" className="scroll-mt-24 mt-[clamp(120px,20vh,200px)]">
      <header className="mx-auto flex max-w-[1280px] items-baseline justify-between gap-4 px-[clamp(24px,4vw,64px)] pt-24 pb-10">
        <span className="text-mono-s text-[color:var(--surface-graphite)]">
          01 — SELECTED WORK
        </span>
        <span className="text-mono-s text-[color:var(--surface-graphite)]">
          {String(rows.length).padStart(2, "0")} /{" "}
          {String(rows.length).padStart(2, "0")}
        </span>
      </header>
      <ProjectStack rows={rows} />
    </section>
  );
}
