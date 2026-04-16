/**
 * Thin JSON loader for the /about influences grid. Reads `influences.json`,
 * validates with Zod, re-exports the typed array so existing imports of
 * `influences` continue to work.
 *
 * The CMS edits `influences.json` directly via the GitHub API.
 */

import data from "./influences.json";
import { influencesContentSchema } from "./schemas";
import type { Influence } from "./types";

const parsed = influencesContentSchema.parse(data);

export const influences: Influence[] = parsed.influences;

// Keep the type re-export so consumers can `import { Influence } from "@/content/influences"`.
export type { Influence };
