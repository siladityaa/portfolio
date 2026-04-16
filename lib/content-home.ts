/**
 * Loader for `content/home.json`. Reads + validates the home page content
 * via the Zod schema, surfaces a typed `HomeContent` to consumers.
 *
 * Imported by `components/home/Hero.tsx` (server component).
 * The CMS edits `home.json` directly via the GitHub API.
 */

import data from "@/content/home.json";
import { homeContentSchema } from "@/content/schemas";
import type { HomeContent } from "@/content/types";

const parsed = homeContentSchema.parse(data);

export const home: HomeContent = parsed;
