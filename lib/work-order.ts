/**
 * Manual work order. The file `content/work-order.json` carries an array
 * of slugs in display order. Loaders use this order if present; case
 * studies missing from the list fall to the end (sorted by timeline).
 *
 * Lives outside `content/work/` so the JSON-file loader doesn't try to
 * parse it as a case study.
 */

import { promises as fs } from "node:fs";
import path from "node:path";

import { z } from "zod";

const ORDER_FILE = path.join(process.cwd(), "content", "work-order.json");

export const workOrderSchema = z.object({
  order: z.array(z.string()),
});

export type WorkOrder = z.infer<typeof workOrderSchema>;

/** Read the order list from disk. Returns an empty list if missing/malformed. */
export async function readWorkOrder(): Promise<string[]> {
  try {
    const raw = await fs.readFile(ORDER_FILE, "utf8");
    const parsed = workOrderSchema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data.order : [];
  } catch {
    return [];
  }
}

/**
 * Sort a list of {slug, ...} items by an explicit slug order. Items not
 * in the order list are pushed to the end and sorted by their second-stage
 * comparator (default: stable, no change).
 */
export function applyWorkOrder<T extends { slug: string }>(
  items: T[],
  order: string[],
  fallbackCompare: (a: T, b: T) => number = () => 0,
): T[] {
  const indexFor = new Map(order.map((slug, i) => [slug, i]));
  const sorted = [...items].sort((a, b) => {
    const ai = indexFor.has(a.slug) ? indexFor.get(a.slug)! : Infinity;
    const bi = indexFor.has(b.slug) ? indexFor.get(b.slug)! : Infinity;
    if (ai !== bi) return ai - bi;
    return fallbackCompare(a, b);
  });
  return sorted;
}
