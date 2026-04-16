/**
 * Thin JSON loader for the home/about "now" content. Reads `now.json` at
 * import time, validates with the Zod schema, and re-exports each typed
 * array so all existing call sites keep working unchanged.
 *
 * The CMS edits `now.json` directly via the GitHub API.
 */

import data from "./now.json";
import { nowContentSchema } from "./schemas";
import type { Track, NowEntry } from "./types";

const parsed = nowContentSchema.parse(data);

/** Brief §4.1 — cycles in the bottom-left chrome, pauses on hover. */
export const nowPlaying: Track[] = parsed.nowPlaying;

/** Brief §4.1 — right column of the home-page About teaser. */
export const nowFacts: NowEntry[] = parsed.nowFacts;

/** Brief §4.4 — /about "Previously" block (paired with nowFacts). */
export const previouslyFacts: NowEntry[] = parsed.previouslyFacts;

// Keep the type re-exports so existing imports of `Track` / `NowEntry`
// from `@/content/now` continue to work.
export type { Track, NowEntry };
