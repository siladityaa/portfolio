import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { loadAllCaseStudies, loadCaseStudy } from "@/lib/content";
import { MinimalCaseStudy } from "@/components/case-study/MinimalCaseStudy";
import { KeyboardNav } from "@/components/case-study/KeyboardNav";
import { PreviewGate } from "@/components/case-study/PreviewGate";

const PREVIEW_COOKIE = "studio-preview";

export async function generateStaticParams() {
  const all = await loadAllCaseStudies();
  // Pre-render only public case studies. Private slugs still resolve at
  // request time (dynamic — we read cookies for the gate).
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
  if (cs.status === "private") {
    // Don't leak the case study brief into private-page metadata.
    return {
      title: `${cs.title} — Siladityaa Sharma`,
      description: "Private case study — password required to view.",
      robots: { index: false, follow: false },
    };
  }
  return {
    title: `${cs.title} — Siladityaa Sharma`,
    description: cs.brief.slice(0, 160),
  };
}

/**
 * Case study page.
 *
 * Public studies render the long-form layout directly. Private ones
 * gate behind a shared password (env: STUDIO_PREVIEW_PASSWORD) — set
 * via the `unlockPreview` server action which drops a `studio-preview`
 * cookie. Cookie present → render the study. Cookie absent → render
 * the PreviewGate password form.
 */
export default async function CaseStudyPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ bad?: string }>;
}) {
  const { slug } = await params;
  const cs = await loadCaseStudy(slug);
  if (!cs) notFound();

  if (cs.status === "private") {
    const jar = await cookies();
    const unlocked = jar.get(PREVIEW_COOKIE)?.value === "1";
    if (!unlocked) {
      const sp = (await searchParams) ?? {};
      return (
        <PreviewGate slug={slug} title={cs.title} hadBadAttempt={!!sp.bad} />
      );
    }
  }

  // Build prev/next from public case studies only so keyboard nav never
  // lands on a 404 or another locked study.
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
