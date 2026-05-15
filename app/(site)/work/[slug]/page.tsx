import { notFound } from "next/navigation";

import { loadAllCaseStudies, loadCaseStudy } from "@/lib/content";
import { PreviewGate } from "@/components/case-study/PreviewGate";

export async function generateStaticParams() {
  const all = await loadAllCaseStudies();
  return all
    .filter((cs) => cs.status === "public")
    .map((cs) => ({ slug: cs.slug }));
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cs = await loadCaseStudy(slug);
  if (!cs) notFound();
  return <PreviewGate slug={slug} title={cs.title} hadBadAttempt={false} />;
}
