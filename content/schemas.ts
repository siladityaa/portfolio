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
   Case study frontmatter + chapters + body section union
   ============================================================================= */

export const caseStudyStatusSchema = z.enum(["public", "nda"]);

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

/* --- body section discriminated union (10 kinds) ---------------------------- */

export const proseBlockSchema = z.object({
  kind: z.literal("proseBlock"),
  body: z.string(),
});

export const imageGridSchema = z.object({
  kind: z.literal("imageGrid"),
  cols: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  images: z.array(
    z.object({
      src: z.string(),
      alt: z.string(),
      caption: z.string().optional(),
    }),
  ),
});

export const pullQuoteSchema = z.object({
  kind: z.literal("pullQuote"),
  body: z.string(),
  attribution: z.string().optional(),
});

export const beforeAfterSchema = z.object({
  kind: z.literal("beforeAfter"),
  before: z.object({ src: z.string(), label: z.string() }),
  after: z.object({ src: z.string(), label: z.string() }),
});

export const lockedSectionSchema = z.object({
  kind: z.literal("lockedSection"),
  number: z.string(),
  title: z.string(),
  description: z.string(),
});

export const tabGroupSchema = z.object({
  kind: z.literal("tabGroup"),
  tabs: z.array(
    z.object({
      label: z.string(),
      body: z.string().optional(),
      image: z
        .object({ src: z.string(), alt: z.string() })
        .optional(),
    }),
  ),
});

/** Cells in an InfoTable can be either a single line or a bullet list. */
export const infoTableCellSchema = z.union([
  z.string(),
  z.array(z.string()),
]);

export const infoTableSchema = z.object({
  kind: z.literal("infoTable"),
  columns: z.array(z.string()),
  rows: z.array(
    z.object({
      label: z.string(),
      cells: z.array(infoTableCellSchema),
    }),
  ),
  footnote: z.string().optional(),
});

export const cardGridChipToneSchema = z.enum([
  "pm",
  "design",
  "engineer",
  "neutral",
]);

export const cardGridSchema = z.object({
  kind: z.literal("cardGrid"),
  cards: z.array(
    z.object({
      title: z.string(),
      body: z.string(),
      chip: z
        .object({ label: z.string(), tone: cardGridChipToneSchema })
        .optional(),
    }),
  ),
});

export const mockupFrameSchema = z.object({
  kind: z.literal("mockupFrame"),
  src: z.string(),
  alt: z.string(),
  caption: z.string().optional(),
});

export const dividerSchema = z.object({
  kind: z.literal("divider"),
});

/** All 10 body section kinds, discriminated on `kind`. */
export const chapterSectionSchema = z.discriminatedUnion("kind", [
  proseBlockSchema,
  imageGridSchema,
  pullQuoteSchema,
  beforeAfterSchema,
  lockedSectionSchema,
  tabGroupSchema,
  infoTableSchema,
  cardGridSchema,
  mockupFrameSchema,
  dividerSchema,
]);

/* --- chapter + case study --------------------------------------------------- */

export const chapterSchema = z.object({
  slug: z.string(),
  eyebrow: z.string(),
  title: z.string(),
  sections: z.array(chapterSectionSchema),
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
  chapters: z.array(chapterSchema),
  next: z
    .object({ slug: z.string(), title: z.string() })
    .optional(),
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
