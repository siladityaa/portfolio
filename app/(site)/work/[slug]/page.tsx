import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { loadAllCaseStudies, loadCaseStudy } from "@/lib/content";
import { MinimalCaseStudy } from "@/components/case-study/MinimalCaseStudy";
import { KeyboardNav } from "@/components/case-study/KeyboardNav";

export async function generateStaticParams() {
  const all = await loadAllCaseStudies();
  return all.map((cs) => ({ slug: cs.slug }));
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

  const all = await loadAllCaseStudies();
  const index = all.findIndex((c) => c.slug === slug);
  const prevSlug = index > 0 ? all[index - 1]?.slug : undefined;
  const nextSlug =
    index >= 0 && index < all.length - 1 ? all[index + 1]?.slug : undefined;

  return (
    <article>
      <KeyboardNav prevSlug={prevSlug} nextSlug={nextSlug} />
      <MinimalCaseStudy
        cs={cs}
        index={Math.max(index, 0)}
        total={all.length}
        prevSlug={prevSlug}
        nextSlug={nextSlug}
      />
    </article>
  );
}
