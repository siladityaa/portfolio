/**
 * Zod schemas — single source of truth for every piece of editable content
 * in the portfolio.
 *
 * `content/types.ts` re-exports TypeScript types from these schemas via
 * `z.infer`, so the schemas and types can never drift. Loaders in
 * `lib/content*.ts` use these schemas to validate JSON files at read time.
 * The CMS in `app/(admin)` uses them via `@hookform/resolvers/zod` to
 * validate forms before saving.
 *
 * If you need to add a new field, change ONE thing in this file and
 * everything downstream — types, loaders, forms — picks it up.
 */

import { z } from "zod";

/* =============================================================================
   Case study frontmatter + bento gallery
   ============================================================================= */

export const caseStudyStatusSchema = z.enum(["public", "comingSoon"]);

export const caseStudyTagSchema = z.enum([
  "wearables",
  "ai",
  "consumer",
  "concept",
]);

export const heroSchema = z.object({
  src: z.string(),
  alt: z.string(),
  caption: z.string().optional(),
});

export const galleryItemSchema = z.object({
  src: z.string(),
  alt: z.string().optional(),
  caption: z.string().optional(),
});

export const caseStudyMetricSchema = z.object({
  value: z.string(),
  label: z.string(),
});

export const caseStudyBodySectionSchema = z.object({
  heading: z.string(),
  body: z.string(),
});

export const caseStudySchema = z.object({
  slug: z.string(),
  title: z.string(),
  timeline: z.string(),
  role: z.string(),
  team: z.string(),
  credits: z.string().optional(),
  status: caseStudyStatusSchema,
  tags: z.array(caseStudyTagSchema),
  keyColor: z.string(),
  hero: heroSchema,
  brief: z.string(),
  /** Up to 4 supporting bento tiles. */
  gallery: z.array(galleryItemSchema).max(4).optional(),
  /** Up to 4 highlight metrics (big number + label). */
  metrics: z.array(caseStudyMetricSchema).max(4).optional(),
  /** Repeating body sections — heading + paragraph. */
  body: z.array(caseStudyBodySectionSchema).optional(),
});

/* =============================================================================
   Home page (content/home.json)
   ============================================================================= */

export const homeContentSchema = z.object({
  hero: z.object({
    sentence: z.string(),
    subline: z.string(),
  }),
});

/* =============================================================================
   About page (content/about.json)
   ============================================================================= */

export const aboutContentSchema = z.object({
  pulledQuote: z.string(),
  bio: z.object({
    personal: z.string(),
    professional: z.string(),
  }),
});

/* =============================================================================
   Now block (content/now.json)
   ============================================================================= */

export const trackSchema = z.object({
  title: z.string(),
  artist: z.string(),
  album: z.string().optional(),
});

export const nowEntrySchema = z.object({
  label: z.string(),
  value: z.string(),
});

export const nowContentSchema = z.object({
  /**
   * Editorial override for the NowPlaying widget. When present, the widget
   * renders this exact track instead of querying Last.fm — useful when you
   * want to pin "the album I'm obsessing over this week" regardless of what
   * the scrobbler most recently caught. Clear it to resume live data.
   */
  pinned: trackSchema.optional(),
  /**
   * Curated fallback list. Used when Last.fm returns nothing and no
   * `pinned` override is set — e.g. in offline dev, before the scrobbler
   * has captured anything, or if the API key is unset. The widget shows
   * the first entry from this list in that case.
   */
  nowPlaying: z.array(trackSchema),
  nowFacts: z.array(nowEntrySchema),
  previouslyFacts: z.array(nowEntrySchema),
});

/* =============================================================================
   Timeline (content/timeline.json) — used on /about
   ============================================================================= */

export const roleKindSchema = z.enum([
  "full-time",
  "part-time",
  "internship",
  "contract",
  "service",
]);

export const timelineRoleSchema = z.object({
  company: z.string(),
  role: z.string(),
  kind: roleKindSchema,
  start: z.string(),
  end: z.string(), // "YYYY-MM" or "present"
  location: z.string(),
  highlight: z.string().optional(),
  current: z.boolean().optional(),
});

export const educationEntrySchema = z.object({
  school: z.string(),
  degree: z.string(),
  start: z.string(),
  end: z.string(),
  highlight: z.string().optional(),
});

export const awardSchema = z.object({
  name: z.string(),
});

export const timelineContentSchema = z.object({
  timeline: z.array(timelineRoleSchema),
  education: z.array(educationEntrySchema),
  awards: z.array(awardSchema),
});

/* =============================================================================
   Influences (content/influences.json)
   ============================================================================= */

export const influenceCategorySchema = z.enum([
  "brand",
  "person",
  "studio",
  "object",
  "musician",
  "filmmaker",
  "architect",
]);

export const influenceSchema = z.object({
  name: z.string(),
  category: influenceCategorySchema,
  why: z.string(),
});

export const influencesContentSchema = z.object({
  influences: z.array(influenceSchema),
});
