/**
 * Loader for `content/about.json`. Reads + validates the about page
 * content via the Zod schema, surfaces a typed `AboutContent` to
 * consumers.
 *
 * Imported by `components/about/PulledQuote.tsx` and
 * `components/about/BioColumns.tsx` (both server components).
 * The CMS edits `about.json` directly via the GitHub API.
 */

import data from "@/content/about.json";
import { aboutContentSchema } from "@/content/schemas";
import type { AboutContent } from "@/content/types";

const parsed = aboutContentSchema.parse(data);

export const about: AboutContent = parsed;
