import { notFound } from "next/navigation";
import Link from "next/link";

import { loadAllCaseStudies, loadCaseStudy } from "@/lib/content";
import { CaseStudyForm } from "@/components/admin/forms/CaseStudyForm";
import { DeleteCaseStudyButton } from "@/components/admin/DeleteCaseStudyButton";

export async function generateStaticParams() {
  const all = await loadAllCaseStudies();
  return all.map((cs) => ({ slug: cs.slug }));
}

/**
 * Case study editor — frontmatter, hero, brief, bento gallery + danger
 * zone for permanently deleting the case study from the repo.
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
        Edit the frontmatter, hero asset, brief, and bento gallery for this
        case study. Save commits to the repo and the public site rebuilds.
      </p>

      <div className="mt-16">
        <CaseStudyForm defaultValues={cs} />
      </div>

      {/* Danger zone */}
      <section className="mt-20 flex flex-col gap-4 border-t border-[color:color-mix(in_srgb,var(--surface-graphite)_25%,transparent)] pt-10">
        <h2 className="text-display-s italic text-[color:var(--surface-signal)]">
          Danger zone
        </h2>
        <p className="max-w-[55ch] text-body text-[color:var(--surface-graphite)]">
          Permanently remove this case study from the repo. The public page
          (/work/{slug}) disappears on the next build.
        </p>
        <DeleteCaseStudyButton slug={cs.slug} title={cs.title} />
      </section>
    </div>
  );
}
