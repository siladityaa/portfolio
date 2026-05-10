/**
 * Case study + content data model.
 *
 * All TypeScript types in this file are derived from the Zod schemas in
 * `content/schemas.ts` via `z.infer`. The schemas are the single source
 * of truth — change a field there and every consumer (loaders, runtime
 * validation, CMS forms) updates automatically.
 */

import type { z } from "zod";
import type {
  caseStudySchema,
  caseStudyStatusSchema,
  caseStudyTagSchema,
  caseStudyMetricSchema,
  caseStudyBodySectionSchema,
  galleryItemSchema,
  homeContentSchema,
  aboutContentSchema,
  trackSchema,
  nowEntrySchema,
  nowContentSchema,
  roleKindSchema,
  timelineRoleSchema,
  educationEntrySchema,
  awardSchema,
  timelineContentSchema,
  influenceCategorySchema,
  influenceSchema,
  influencesContentSchema,
} from "./schemas";

/* Case study ---------------------------------------------------------------- */

export type CaseStudyStatus = z.infer<typeof caseStudyStatusSchema>;
export type CaseStudyTag = z.infer<typeof caseStudyTagSchema>;
export type CaseStudyFrontmatter = z.infer<typeof caseStudySchema>;

/** Alias kept so existing imports keep working. */
export type CaseStudy = CaseStudyFrontmatter;

export type GalleryItem = z.infer<typeof galleryItemSchema>;
export type CaseStudyMetric = z.infer<typeof caseStudyMetricSchema>;
export type CaseStudyBodySection = z.infer<typeof caseStudyBodySectionSchema>;

/* Page-level content shapes ----------------------------------------------- */

export type HomeContent = z.infer<typeof homeContentSchema>;
export type AboutContent = z.infer<typeof aboutContentSchema>;
export type NowContent = z.infer<typeof nowContentSchema>;
export type TimelineContent = z.infer<typeof timelineContentSchema>;
export type InfluencesContent = z.infer<typeof influencesContentSchema>;

/* Sub-types kept for direct import by feature components ------------------ */

export type Track = z.infer<typeof trackSchema>;
export type NowEntry = z.infer<typeof nowEntrySchema>;
export type RoleKind = z.infer<typeof roleKindSchema>;
export type TimelineRole = z.infer<typeof timelineRoleSchema>;
export type EducationEntry = z.infer<typeof educationEntrySchema>;
export type Award = z.infer<typeof awardSchema>;
export type InfluenceCategory = z.infer<typeof influenceCategorySchema>;
export type Influence = z.infer<typeof influenceSchema>;
