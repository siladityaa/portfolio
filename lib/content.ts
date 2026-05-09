/**
 * Public-site content loader.
 *
 * In production this fetches case-study JSON from the public GitHub
 * repo's raw URLs, with Next.js fetch-cache tags so individual entries
 * can be invalidated by the CMS via `revalidateTag` after a save —
 * meaning content updates surface in seconds without a Vercel rebuild.
 *
 * In development we still read from the local filesystem so editing
 * `content/work/*.json` reflects instantly on the dev server without
 * waiting on a GitHub round trip.
 */

import { caseStudySchema } from "@/content/schemas";
import type { CaseStudy } from "@/content/types";

import { applyWorkOrder, readWorkOrder } from "@/lib/work-order";

/* -------------------------------------------------------------------------- */
/* Cache tag helpers — exported so the CMS save actions can target them.       */
/* -------------------------------------------------------------------------- */

export const TAG_CASE_STUDIES_INDEX = "case-studies-index";
export function tagCaseStudy(slug: string) {
  return `case-study-${slug}`;
}

/* -------------------------------------------------------------------------- */
/* Source switch                                                              */
/* -------------------------------------------------------------------------- */

const USE_GITHUB = process.env.NODE_ENV === "production";
const OWNER = process.env.GITHUB_REPO_OWNER ?? "siladityaa";
const REPO = process.env.GITHUB_REPO_NAME ?? "portfolio";
const BRANCH = process.env.GITHUB_REPO_BRANCH ?? "main";

const RAW_BASE = `https://raw.githubusercontent.com/${OWNER}/${REPO}/${BRANCH}`;
const API_BASE = `https://api.github.com/repos/${OWNER}/${REPO}/contents`;

/** 1 hour TTL — content cache also gets invalidated explicitly via tags. */
const REVALIDATE = 3600;

/* -------------------------------------------------------------------------- */
/* GitHub readers                                                             */
/* -------------------------------------------------------------------------- */

async function listSlugsFromGitHub(): Promise<string[]> {
  const res = await fetch(`${API_BASE}/content/work?ref=${BRANCH}`, {
    next: { tags: [TAG_CASE_STUDIES_INDEX], revalidate: REVALIDATE },
    headers: { Accept: "application/vnd.github+json" },
  });
  if (!res.ok) return [];
  const arr = (await res.json()) as Array<{ name: string; type: string }>;
  return arr
    .filter((e) => e.type === "file" && e.name.endsWith(".json"))
    .map((e) => e.name.replace(/\.json$/, ""));
}

async function loadCaseStudyFromGitHub(
  slug: string,
): Promise<CaseStudy | null> {
  const res = await fetch(`${RAW_BASE}/content/work/${slug}.json`, {
    next: { tags: [tagCaseStudy(slug)], revalidate: REVALIDATE },
  });
  if (!res.ok) return null;
  const parsed = caseStudySchema.safeParse(await res.json());
  return parsed.success ? parsed.data : null;
}

/* -------------------------------------------------------------------------- */
/* Local FS readers (dev)                                                     */
/* -------------------------------------------------------------------------- */

async function loadAllFromFs(): Promise<CaseStudy[]> {
  const fs = await import("node:fs");
  const path = await import("node:path");
  const WORK_DIR = path.join(process.cwd(), "content", "work");
  let entries: string[] = [];
  try {
    entries = await fs.promises.readdir(WORK_DIR);
  } catch {
    return [];
  }
  const jsonFiles = entries.filter((n) => n.endsWith(".json"));
  return Promise.all(
    jsonFiles.map(async (file) => {
      const raw = await fs.promises.readFile(
        path.join(WORK_DIR, file),
        "utf8",
      );
      return caseStudySchema.parse(JSON.parse(raw));
    }),
  );
}

async function loadCaseStudyFromFs(slug: string): Promise<CaseStudy | null> {
  const all = await loadAllFromFs();
  return all.find((cs) => cs.slug === slug) ?? null;
}

/* -------------------------------------------------------------------------- */
/* Public API                                                                 */
/* -------------------------------------------------------------------------- */

export async function loadAllCaseStudies(): Promise<CaseStudy[]> {
  let studies: CaseStudy[];
  if (USE_GITHUB) {
    const slugs = await listSlugsFromGitHub();
    const fetched = await Promise.all(slugs.map(loadCaseStudyFromGitHub));
    studies = fetched.filter((cs): cs is CaseStudy => cs !== null);
  } else {
    studies = await loadAllFromFs();
  }
  const order = await readWorkOrder();
  return applyWorkOrder(
    studies,
    order,
    (a, b) => extractEndYear(b.timeline) - extractEndYear(a.timeline),
  );
}

export async function loadCaseStudy(slug: string): Promise<CaseStudy | null> {
  return USE_GITHUB
    ? loadCaseStudyFromGitHub(slug)
    : loadCaseStudyFromFs(slug);
}

function extractEndYear(timeline: string): number {
  const matches = timeline.match(/\d{4}/g);
  if (!matches || matches.length === 0) return 0;
  return Number(matches[matches.length - 1]);
}
