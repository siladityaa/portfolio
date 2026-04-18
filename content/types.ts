/**
 * Case study + content data model.
 *
 * All TypeScript types in this file are derived from the Zod schemas in
 * `content/schemas.ts` via `z.infer`. The schemas are the single source
 * of truth — change a field there and every consumer (loaders, runtime
 * validation, CMS forms) updates automatically.
 *
 * Inspired by xiangyidesign.com/tiktokweb chapter layout, blended with
 * this portfolio's serif + mono visual language.
 */

import type { z } from "zod";
import type {
  caseStudySchema,
  caseStudyStatusSchema,
  caseStudyTagSchema,
  chapterSchema,
  chapterSectionSchema,
  proseBlockSchema,
  imageGridSchema,
  pullQuoteSchema,
  beforeAfterSchema,
  tabGroupSchema,
  infoTableSchema,
  cardGridSchema,
  mockupFrameSchema,
  dividerSchema,
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

/* Case study + chapter union ---------------------------------------------- */

export type CaseStudyStatus = z.infer<typeof caseStudyStatusSchema>;
export type CaseStudyTag = z.infer<typeof caseStudyTagSchema>;
export type CaseStudyFrontmatter = z.infer<typeof caseStudySchema>;

/** Backwards-compat alias for the prior MDX-era shape. The MDX `body`
 * field is gone post-Phase-6 migration, so CaseStudy === CaseStudyFrontmatter. */
export type CaseStudy = CaseStudyFrontmatter;

export type Chapter = z.infer<typeof chapterSchema>;
export type ChapterSection = z.infer<typeof chapterSectionSchema>;

export type ProseBlockSection = z.infer<typeof proseBlockSchema>;
export type ImageGridSection = z.infer<typeof imageGridSchema>;
export type PullQuoteSection = z.infer<typeof pullQuoteSchema>;
export type BeforeAfterSection = z.infer<typeof beforeAfterSchema>;
export type TabGroupSection = z.infer<typeof tabGroupSchema>;
export type InfoTableSection = z.infer<typeof infoTableSchema>;
export type CardGridSection = z.infer<typeof cardGridSchema>;
export type MockupFrameSection = z.infer<typeof mockupFrameSchema>;
export type DividerSection = z.infer<typeof dividerSchema>;

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
