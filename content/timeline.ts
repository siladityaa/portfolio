/**
 * Thin JSON loader for the /about timeline. Reads `timeline.json`,
 * validates with Zod, re-exports the typed arrays so the /about
 * component imports stay unchanged.
 *
 * The CMS edits `timeline.json` directly via the GitHub API.
 */

import data from "./timeline.json";
import { timelineContentSchema } from "./schemas";
import type {
  TimelineRole,
  EducationEntry,
  Award,
  RoleKind,
} from "./types";

const parsed = timelineContentSchema.parse(data);

export const timeline: TimelineRole[] = parsed.timeline;
export const education: EducationEntry[] = parsed.education;
export const awards: Award[] = parsed.awards;

// Keep the type re-exports so existing imports continue to work.
export type { TimelineRole, EducationEntry, Award, RoleKind };
