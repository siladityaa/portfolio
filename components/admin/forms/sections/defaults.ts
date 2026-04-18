import type { ChapterSection } from "@/content/types";

/**
 * Returns a minimally-valid empty `ChapterSection` for each kind.
 *
 * Used by `AddSectionCombobox` when the user picks a kind from the
 * picker — the new section is appended to the chapter's sections list
 * with this default value.
 *
 * Every shape here MUST satisfy the corresponding Zod schema in
 * `content/schemas.ts`. If a section is added or its schema changes,
 * update this factory in lockstep.
 */
export function defaultSection(kind: ChapterSection["kind"]): ChapterSection {
  switch (kind) {
    case "proseBlock":
      return { kind: "proseBlock", body: "" };
    case "imageGrid":
      return {
        kind: "imageGrid",
        cols: 2,
        images: [{ src: "", alt: "" }],
      };
    case "pullQuote":
      return { kind: "pullQuote", body: "" };
    case "beforeAfter":
      return {
        kind: "beforeAfter",
        before: { src: "", label: "Before" },
        after: { src: "", label: "After" },
      };
    case "tabGroup":
      return {
        kind: "tabGroup",
        tabs: [{ label: "Tab one" }],
      };
    case "infoTable":
      return {
        kind: "infoTable",
        columns: ["Column", "Column"],
        rows: [
          { label: "Row label", cells: ["", ""] },
        ],
      };
    case "cardGrid":
      return {
        kind: "cardGrid",
        cards: [{ title: "", body: "" }],
      };
    case "mockupFrame":
      return { kind: "mockupFrame", src: "", alt: "" };
    case "divider":
      return { kind: "divider" };
    default: {
      // Exhaustive switch — TypeScript errors if a new kind is missed.
      const _exhaustive: never = kind;
      throw new Error(`Unknown section kind: ${_exhaustive}`);
    }
  }
}

/** Human-readable label + one-line description for the AddSectionCombobox. */
export const SECTION_KIND_META: ReadonlyArray<{
  kind: ChapterSection["kind"];
  label: string;
  description: string;
}> = [
  {
    kind: "proseBlock",
    label: "Prose block",
    description: "A paragraph of body copy. Use markdown-style **bold** for emphasis.",
  },
  {
    kind: "imageGrid",
    label: "Image grid",
    description: "1, 2, or 3 columns of images with optional captions.",
  },
  {
    kind: "pullQuote",
    label: "Pull quote",
    description: "A short highlighted line in display italic with optional attribution.",
  },
  {
    kind: "beforeAfter",
    label: "Before / After",
    description: "Side-by-side comparison with labelled pill chips.",
  },
  {
    kind: "tabGroup",
    label: "Tab group",
    description: "Pill-tabs that switch between sub-views in a single content slot.",
  },
  {
    kind: "infoTable",
    label: "Info table",
    description: "Bordered comparison table with rows of single-line or bullet-list cells.",
  },
  {
    kind: "cardGrid",
    label: "Card grid",
    description: "3-up cards with category chips. Good for team / role / responsibility splits.",
  },
  {
    kind: "mockupFrame",
    label: "Mockup frame",
    description: "Full-bleed dark rounded frame for a single big production mockup.",
  },
  {
    kind: "divider",
    label: "Divider",
    description: "A •—• section divider. No fields.",
  },
];
