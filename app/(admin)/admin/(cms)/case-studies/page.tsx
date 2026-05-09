import { loadAllCaseStudiesAdmin } from "@/lib/content-admin";
import { NewCaseStudyForm } from "@/components/admin/NewCaseStudyForm";
import {
  CaseStudyReorderList,
  type CaseStudyRow,
} from "@/components/admin/CaseStudyReorderList";

// Always render fresh from GitHub — never cache so deletes/creates show
// up immediately in the admin list.
export const dynamic = "force-dynamic";

export default async function CaseStudiesIndex() {
  const studies = await loadAllCaseStudiesAdmin();
  const rows: CaseStudyRow[] = studies.map((cs) => ({
    slug: cs.slug,
    title: cs.title,
    timeline: cs.timeline,
    galleryCount: cs.gallery?.length ?? 0,
    tags: cs.tags ?? [],
  }));

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
        . Click any row to edit, reorder with the arrows, or add a new one
        below.
      </p>

      <div className="mt-10">
        <NewCaseStudyForm />
      </div>

      <div className="mt-12">
        <CaseStudyReorderList rows={rows} />
      </div>
    </div>
  );
}
