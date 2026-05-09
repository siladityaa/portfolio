/**
 * GitHub-backed loaders for the CMS admin.
 *
 * The public site reads case studies from the local filesystem (the
 * deployed bundle) — fast and cached. But the admin needs to reflect
 * the LIVE state of the repo, because:
 *
 *   - A just-created case study won't be in the bundle until Vercel
 *     rebuilds (~60s after the commit), so reading from disk would
 *     return 404 right after creation.
 *   - A just-deleted case study is still in the bundle until rebuild,
 *     so reading from disk would still show it in the list.
 *
 * These loaders go through the GitHub Contents API so the admin always
 * matches what's actually in the repo.
 */

import { caseStudySchema } from "@/content/schemas";
import type { CaseStudy } from "@/content/types";

import {
  getTokenFromSession,
  listCaseStudySlugs,
  makeOctokit,
  readJsonFile,
} from "@/lib/github";
import { applyWorkOrder } from "@/lib/work-order";

export async function loadAllCaseStudiesAdmin(): Promise<CaseStudy[]> {
  const token = await getTokenFromSession();
  if (!token) return [];

  const octokit = makeOctokit(token);
  const slugs = await listCaseStudySlugs(octokit);
  if (slugs.length === 0) return [];

  const studies = await Promise.all(
    slugs.map(async (slug) => {
      const file = await readJsonFile(octokit, `content/work/${slug}.json`);
      if (!file) return null;
      const parsed = caseStudySchema.safeParse(file.data);
      return parsed.success ? parsed.data : null;
    }),
  );

  // Pull the live order from GitHub so the admin reflects the current
  // committed state (not the deployed bundle).
  const orderFile = await readJsonFile<{ order?: string[] }>(
    octokit,
    "content/work-order.json",
  );
  const order = Array.isArray(orderFile?.data?.order)
    ? orderFile!.data.order!
    : [];

  return applyWorkOrder(
    studies.filter((cs): cs is CaseStudy => cs !== null),
    order,
    (a, b) => extractEndYear(b.timeline) - extractEndYear(a.timeline),
  );
}

export async function loadCaseStudyAdmin(
  slug: string,
): Promise<CaseStudy | null> {
  const token = await getTokenFromSession();
  if (!token) return null;

  const octokit = makeOctokit(token);
  const file = await readJsonFile(octokit, `content/work/${slug}.json`);
  if (!file) return null;
  const parsed = caseStudySchema.safeParse(file.data);
  return parsed.success ? parsed.data : null;
}

function extractEndYear(timeline: string): number {
  const matches = timeline.match(/\d{4}/g);
  if (!matches || matches.length === 0) return 0;
  return Number(matches[matches.length - 1]);
}
