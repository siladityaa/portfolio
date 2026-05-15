import { cookies } from "next/headers";
import { notFound } from "next/navigation";

import { loadAllCaseStudies, loadCaseStudy } from "@/lib/content";
import { PreviewGate } from "@/components/case-study/PreviewGate";

const PREVIEW_COOKIE = "studio-preview";

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
  if (cs.status === "private") {
    const jar = await cookies();
    const unlocked = jar.get(PREVIEW_COOKIE)?.value === "1";
    if (!unlocked) {
      return <PreviewGate slug={slug} title={cs.title} hadBadAttempt={false} />;
    }
  }
  return (
    <div style={{ padding: 80, fontFamily: "monospace" }}>
      <h1>{cs.title}</h1>
      <p>unlocked: {String(true)}</p>
    </div>
  );
}
