import { notFound } from "next/navigation";

import { loadAllCaseStudies, loadCaseStudy } from "@/lib/content";

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
  return (
    <div style={{ padding: 80, fontFamily: "monospace" }}>
      <h1>{cs.title}</h1>
      <p>status: {cs.status}</p>
      <p>slug: {cs.slug}</p>
      <p>env password set: {process.env.STUDIO_PREVIEW_PASSWORD ? "YES" : "NO"}</p>
    </div>
  );
}
