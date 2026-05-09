import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { loadAllCaseStudies, loadCaseStudy } from "@/lib/content";
import { MinimalCaseStudy } from "@/components/case-study/MinimalCaseStudy";
import { KeyboardNav } from "@/components/case-study/KeyboardNav";

export async function generateStaticParams() {
  const all = await loadAllCaseStudies();
  // Only pre-render published case studies — coming-soon entries 404.
  return all
    .filter((cs) => cs.status === "public")
    .map((cs) => ({ slug: cs.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cs = await loadCaseStudy(slug);
  if (!cs) return { title: "Case study not found" };
  return {
    title: `${cs.title} — Siladityaa Sharma`,
    description: cs.brief.slice(0, 160),
  };
}

/**
 * Case study page — minimal single-viewport layout.
 *
 * Replaces the previous chapter-based long-scroll experience with a
 * single-frame summary: project info on the left, media gallery on the
 * right. The chapter components are intentionally kept around in
 * `components/case-study/` so this can be swapped back if needed.
 */
export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cs = await loadCaseStudy(slug);
  if (!cs) notFound();
  // Coming-soon entries are listed on the home page but their detail
  // pages aren't published yet — show 404 so the URL can't be deep-linked.
  if (cs.status === "comingSoon") notFound();

  // Build prev/next from published case studies only so keyboard nav
  // never lands on a 404.
  const published = (await loadAllCaseStudies()).filter(
    (c) => c.status === "public",
  );
  const index = published.findIndex((c) => c.slug === slug);
  const prevSlug = index > 0 ? published[index - 1]?.slug : undefined;
  const nextSlug =
    index >= 0 && index < published.length - 1
      ? published[index + 1]?.slug
      : undefined;

  return (
    <article>
      <KeyboardNav prevSlug={prevSlug} nextSlug={nextSlug} />
      <MinimalCaseStudy
        cs={cs}
        index={Math.max(index, 0)}
        total={published.length}
        prevSlug={prevSlug}
        nextSlug={nextSlug}
      />
    </article>
  );
}
