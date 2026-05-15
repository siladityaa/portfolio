import { cookies } from "next/headers";
import { notFound } from "next/navigation";

import { loadAllCaseStudies, loadCaseStudy } from "@/lib/content";

export const dynamic = "force-dynamic";

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
  const jar = await cookies();
  const has = jar.get("studio-preview")?.value === "1";
  return (
    <div style={{ padding: 80, fontFamily: "monospace" }}>
      <h1>{cs.title}</h1>
      <p>cookie ok: {String(has)}</p>
    </div>
  );
}
