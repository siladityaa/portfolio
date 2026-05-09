/**
 * Manual work order. The file `content/work-order.json` carries an array
 * of slugs in display order. Loaders use this order if present; case
 * studies missing from the list fall to the end (sorted by timeline).
 *
 * Like `lib/content.ts`, this fetches via GitHub raw URL in production
 * (with cache tags so the CMS can invalidate via `revalidateTag` after
 * reordering) and reads from the local filesystem in development.
 */

import { z } from "zod";

const ORDER_FILE_REPO_PATH = "content/work-order.json";

const USE_GITHUB = process.env.NODE_ENV === "production";
const OWNER = process.env.GITHUB_REPO_OWNER ?? "siladityaa";
const REPO = process.env.GITHUB_REPO_NAME ?? "portfolio";
const BRANCH = process.env.GITHUB_REPO_BRANCH ?? "main";
const RAW_BASE = `https://raw.githubusercontent.com/${OWNER}/${REPO}/${BRANCH}`;
const REVALIDATE = 3600;

export const TAG_WORK_ORDER = "work-order";

export const workOrderSchema = z.object({
  order: z.array(z.string()),
});

export type WorkOrder = z.infer<typeof workOrderSchema>;

async function readFromGitHub(): Promise<string[]> {
  const res = await fetch(`${RAW_BASE}/${ORDER_FILE_REPO_PATH}`, {
    next: { tags: [TAG_WORK_ORDER], revalidate: REVALIDATE },
  });
  if (!res.ok) return [];
  try {
    const parsed = workOrderSchema.safeParse(await res.json());
    return parsed.success ? parsed.data.order : [];
  } catch {
    return [];
  }
}

async function readFromFs(): Promise<string[]> {
  const fs = await import("node:fs");
  const path = await import("node:path");
  const ORDER_FILE = path.join(process.cwd(), ORDER_FILE_REPO_PATH);
  try {
    const raw = await fs.promises.readFile(ORDER_FILE, "utf8");
    const parsed = workOrderSchema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data.order : [];
  } catch {
    return [];
  }
}

export async function readWorkOrder(): Promise<string[]> {
  return USE_GITHUB ? readFromGitHub() : readFromFs();
}

/**
 * Sort items by an explicit slug order. Items not in the order list are
 * pushed to the end and sorted by the secondary comparator.
 */
export function applyWorkOrder<T extends { slug: string }>(
  items: T[],
  order: string[],
  fallbackCompare: (a: T, b: T) => number = () => 0,
): T[] {
  const indexFor = new Map(order.map((slug, i) => [slug, i]));
  return [...items].sort((a, b) => {
    const ai = indexFor.has(a.slug) ? indexFor.get(a.slug)! : Infinity;
    const bi = indexFor.has(b.slug) ? indexFor.get(b.slug)! : Infinity;
    if (ai !== bi) return ai - bi;
    return fallbackCompare(a, b);
  });
}
