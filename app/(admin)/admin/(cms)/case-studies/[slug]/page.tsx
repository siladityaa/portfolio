import { notFound } from "next/navigation";
import Link from "next/link";

import { loadCaseStudyAdmin } from "@/lib/content-admin";
import { CaseStudyForm } from "@/components/admin/forms/CaseStudyForm";
import { DeleteCaseStudyButton } from "@/components/admin/DeleteCaseStudyButton";

// Always render fresh from GitHub so newly-created case studies are
// reachable immediately and edits reflect the live repo state.
export const dynamic = "force-dynamic";

/**
 * Case study editor — frontmatter, hero, brief, bento gallery + danger
 * zone for permanently deleting the case study from the repo.
 *
 * Reads through `loadCaseStudyAdmin` (GitHub-backed) instead of the
 * filesystem-backed `loadCaseStudy` so the page reflects the live
 * state of the repo, not the deployed bundle.
 */
export default async function CaseStudyEditPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cs = await loadCaseStudyAdmin(slug);
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
