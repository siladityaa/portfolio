import { notFound } from "next/navigation";
import Link from "next/link";

import { loadAllCaseStudies, loadCaseStudy } from "@/lib/content";
import { CaseStudyForm } from "@/components/admin/forms/CaseStudyForm";

export async function generateStaticParams() {
  const all = await loadAllCaseStudies();
  return all.map((cs) => ({ slug: cs.slug }));
}

/**
 * Case study editor — Step 3. The full chapter-based form with the
 * 10-section discriminated union, nested useFieldArrays, and the
 * accordion section editor.
 *
 * Save flow lands in Step 4. Auth in Step 6.
 */
export default async function CaseStudyEditPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cs = await loadCaseStudy(slug);
  if (!cs) notFound();

  return (
    <div className="mx-auto max-w-[920px] px-[clamp(24px,4vw,64px)] py-[clamp(80px,12vh,160px)]">
      <Link
        href="/admin/case-studies"
        className="text-mono-s text-[color:var(--surface-graphite)] transition-opacity duration-300 ease-[var(--ease-out-soft)] hover:opacity-60"
      >
        ← CASE STUDIES
      </Link>
      <h1 className="mt-6 max-w-[24ch] text-display-l italic text-[color:var(--surface-ink)]">
        {cs.title}
      </h1>
      <p className="mt-4 max-w-[55ch] text-body text-[color:var(--surface-graphite)]">
        Edit chapters and sections below. Up/down buttons reorder.
        Add a new chapter or section from the buttons in their headers.
      </p>

      <div className="mt-16">
        <CaseStudyForm defaultValues={cs} />
      </div>
    </div>
  );
}
