import { promises as fs } from "node:fs";
import path from "node:path";

import { caseStudySchema } from "@/content/schemas";
import type { CaseStudy } from "@/content/types";

const WORK_DIR = path.join(process.cwd(), "content", "work");

/**
 * Case study loader.
 *
 * Phase 6 migration: case studies live as `.json` files (Zod-validated)
 * instead of MDX with YAML frontmatter. The bodies were always empty —
 * the section schema drives every render. JSON makes the CMS round-trip
 * (GitHub API → JSON.parse → form → JSON.stringify → GitHub API) lossless.
 *
 * Loaders run in server components at request time. On Vercel the local
 * filesystem is a read-only mirror of the repo at build time, so reads
 * always reflect the latest committed state. CMS writes go to GitHub via
 * Octokit and trigger a Vercel rebuild.
 */
export async function loadAllCaseStudies(): Promise<CaseStudy[]> {
  let entries: string[] = [];
  try {
    entries = await fs.readdir(WORK_DIR);
  } catch {
    return [];
  }

  const jsonFiles = entries.filter((name) => name.endsWith(".json"));

  const studies = await Promise.all(
    jsonFiles.map(async (file) => {
      const fullPath = path.join(WORK_DIR, file);
      const raw = await fs.readFile(fullPath, "utf8");
      const parsed = JSON.parse(raw);
      return caseStudySchema.parse(parsed);
    }),
  );

  // Sort: most recent first, by timeline end year if parseable.
  return studies.sort((a, b) => {
    const aYear = extractEndYear(a.timeline);
    const bYear = extractEndYear(b.timeline);
    return bYear - aYear;
  });
}

export async function loadCaseStudy(slug: string): Promise<CaseStudy | null> {
  const all = await loadAllCaseStudies();
  return all.find((cs) => cs.slug === slug) ?? null;
}

function extractEndYear(timeline: string): number {
  const matches = timeline.match(/\d{4}/g);
  if (!matches || matches.length === 0) return 0;
  return Number(matches[matches.length - 1]);
}
