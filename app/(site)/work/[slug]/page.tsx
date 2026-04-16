import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { loadAllCaseStudies, loadCaseStudy } from "@/lib/content";
import { HeroChapter } from "@/components/case-study/HeroChapter";
import { ChapterContent } from "@/components/case-study/ChapterContent";
import { ChapterSpy } from "@/components/case-study/ChapterSpy";
import { CaseStudyTOC } from "@/components/case-study/CaseStudyTOC";
import { ScrollRuler } from "@/components/case-study/ScrollRuler";
import { NextProject } from "@/components/case-study/NextProject";
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
 * Case study page — chapter-based, 3-column CSS-grid layout inspired by
 * xiangyidesign.com/tiktokweb, blended with this portfolio's serif + mono
 * language.
 *
 * Layout (≥1280px viewport):
 *   ┌─────────┬─────────────────┬───────┐
 *   │  TOC    │    content      │ ruler │
 *   │ (sticky)│ (HeroChapter +  │(sticky│
 *   │         │   chapters)     │       │
 *   └─────────┴─────────────────┴───────┘
 *
 * Below 1280px the rails collapse and the body becomes a single column.
 *
 * The whole grid is wrapped in `<ChapterSpy>` so the TOC and ruler can
 * share active-chapter state via Context without two duplicate observers.
 */
export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cs = await loadCaseStudy(slug);
  if (!cs) notFound();

  // Resolve prev/next case studies for keyboard nav.
  const all = await loadAllCaseStudies();
  const index = all.findIndex((c) => c.slug === slug);
  const prevSlug = index > 0 ? all[index - 1]?.slug : undefined;
  const nextSlug =
    index >= 0 && index < all.length - 1 ? all[index + 1]?.slug : undefined;

  const chapterSlugs = cs.chapters.map((c) => c.slug);

  return (
    <article>
      <KeyboardNav prevSlug={prevSlug} nextSlug={nextSlug} />

      <ChapterSpy chapterSlugs={chapterSlugs}>
        <div className="case-study-grid">
          {/* Left rail — TOC */}
          <div className="case-study-rail">
            <CaseStudyTOC chapters={cs.chapters} />
          </div>

          {/* Center column — hero + chapters */}
          <div>
            <HeroChapter cs={cs} index={Math.max(index, 0)} />
            {cs.chapters.map((chapter) => (
              <ChapterContent key={chapter.slug} chapter={chapter} cs={cs} />
            ))}
          </div>

          {/* Right rail — ruler */}
          <div className="case-study-rail">
            <ScrollRuler chapters={cs.chapters} />
          </div>
        </div>
      </ChapterSpy>

      <NextProject cs={cs} />
    </article>
  );
}
