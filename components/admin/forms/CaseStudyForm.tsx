"use client";

import { useCallback } from "react";
import { useForm, FormProvider, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { caseStudySchema } from "@/content/schemas";
import type { CaseStudy } from "@/content/types";

import { TextField } from "./fields/TextField";
import { TextareaField } from "./fields/TextareaField";
import { SelectField } from "./fields/SelectField";
import { TagsField } from "./fields/TagsField";
import { ColorField } from "./fields/ColorField";
import { PathField } from "./fields/PathField";
import { ImageUploadField } from "./fields/ImageUploadField";
import { ChapterEditor } from "./ChapterEditor";
import {
  SortableList,
  SortableItem,
  DragHandle,
} from "./fields/SortableList";
import { SaveButton } from "@/components/admin/SaveButton";
import { SaveStatus } from "@/components/admin/SaveStatus";
import { ConflictModal } from "@/components/admin/ConflictModal";
import { DirtyWarning } from "@/components/admin/DirtyWarning";
import { useSaveFlow } from "@/components/admin/useSaveFlow";
import { saveCaseStudy } from "@/app/(admin)/admin/actions";

interface CaseStudyFormProps {
  defaultValues: CaseStudy;
}

const STATUS_OPTIONS = [
  { value: "public", label: "Public" },
] as const;

const TAG_OPTIONS = [
  { value: "wearables", label: "WEARABLES" },
  { value: "ai", label: "AI" },
  { value: "consumer", label: "CONSUMER" },
  { value: "concept", label: "CONCEPT" },
] as const;

/**
 * Top-level case study editor.
 *
 * Composition: frontmatter fields → chapters list → save bar.
 *
 * The chapters useFieldArray provides add/remove/up/down for chapters.
 * Each chapter renders a ChapterEditor which has its own nested
 * useFieldArray for sections, which renders SectionAccordion for each
 * section, which dispatches to the right `*Fields` subform based on kind.
 *
 * Step 3 — local state, save no-op. Step 4 wires the server action.
 */
export function CaseStudyForm({ defaultValues }: CaseStudyFormProps) {
  const methods = useForm<CaseStudy>({
    resolver: zodResolver(caseStudySchema),
    defaultValues,
    mode: "onChange",
  });

  // Bind the slug into the server action so the save flow can stay generic.
  // The URL slug is authoritative — even if the user edited the slug field,
  // we still write to the file named after the URL slug. The server action
  // rejects mismatches so we can't silently duplicate files.
  const urlSlug = defaultValues.slug;
  const action = useCallback(
    (values: CaseStudy) => saveCaseStudy(urlSlug, values),
    [urlSlug],
  );

  const flow = useSaveFlow<CaseStudy>({
    methods,
    action,
  });

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(flow.onSubmit)}
        className="flex flex-col gap-16"
      >
        <DirtyWarning />

        {/* Frontmatter — top-level case study fields */}
        <section className="flex flex-col gap-6">
          <h2 className="text-display-s italic text-[color:var(--surface-ink)]">
            Frontmatter
          </h2>

          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-6">
              <TextField
                name="slug"
                label="SLUG"
                description="URL slug — also the JSON filename. Avoid changing this on existing case studies."
              />
            </div>
            <div className="col-span-6">
              <TextField
                name="timeline"
                label="TIMELINE"
                description="e.g. 2024 — 2025"
              />
            </div>
            <div className="col-span-12">
              <TextField name="title" label="TITLE" />
            </div>
            <div className="col-span-6">
              <TextareaField
                name="role"
                label="ROLE"
                description="One role per line."
                rows={3}
              />
            </div>
            <div className="col-span-6">
              <TextField name="team" label="TEAM" />
            </div>
            <div className="col-span-12">
              <TextareaField
                name="credits"
                label="CREDITS (optional)"
                description="One credit per line — collaborator name + their title."
                rows={3}
              />
            </div>
            <div className="col-span-6">
              <SelectField
                name="status"
                label="STATUS"
                options={STATUS_OPTIONS}
              />
            </div>
            <div className="col-span-6">
              <ColorField
                name="keyColor"
                label="KEY COLOR"
                description="Used as the row hover-fill on the home selected work list."
              />
            </div>
            <div className="col-span-12">
              <TagsField
                name="tags"
                label="TAGS"
                description="Categorise the case study. Used by future filter UIs."
                options={TAG_OPTIONS}
              />
            </div>
          </div>
        </section>

        {/* Hero — single image with caption */}
        <section className="flex flex-col gap-6">
          <h2 className="text-display-s italic text-[color:var(--surface-ink)]">
            Hero
          </h2>
          <ImageUploadField
            name="hero.src"
            label="HERO IMAGE"
            uploadDir={`work/${defaultValues.slug}`}
          />
          <TextField name="hero.alt" label="ALT TEXT" />
          <TextField name="hero.caption" label="CAPTION (optional)" />
        </section>

        {/* Brief */}
        <section className="flex flex-col gap-6">
          <h2 className="text-display-s italic text-[color:var(--surface-ink)]">
            Brief
          </h2>
          <TextareaField
            name="brief"
            label="BRIEF"
            description="The framing paragraph in the case study intro. Aim for ~80 words."
            rows={5}
          />
        </section>

        {/* Bento gallery — supporting tiles in the new minimal layout */}
        <section className="flex flex-col gap-6">
          <header className="flex flex-col gap-2">
            <div className="flex items-baseline justify-between">
              <h2 className="text-display-s italic text-[color:var(--surface-ink)]">
                Bento gallery
              </h2>
              <GalleryAddButton />
            </div>
            <p className="text-body text-[color:var(--surface-graphite)]">
              The five supporting tiles around the hero in the bento grid.
              Tile shapes are fixed (s1 wide, s2 square, s3 portrait, s4/s5
              squares) — assets will fill via object-cover.
            </p>
          </header>
          <GalleryList slug={defaultValues.slug} />
        </section>

        {/* Chapters — legacy, not rendered in the new minimal layout */}
        <section className="flex flex-col gap-6 opacity-60">
          <header className="flex items-baseline justify-between">
            <h2 className="text-display-s italic text-[color:var(--surface-ink)]">
              Chapters <span className="text-mono-s text-[color:var(--surface-graphite)]">(legacy)</span>
            </h2>
            <ChaptersAddButton />
          </header>
          <p className="text-body text-[color:var(--surface-graphite)]">
            Chapters are no longer rendered in the public case-study layout.
            Edits here only affect the data file and are kept for safekeeping.
          </p>
          <ChaptersList />
        </section>

        {/* Next project */}
        <section className="flex flex-col gap-6">
          <h2 className="text-display-s italic text-[color:var(--surface-ink)]">
            Next project (optional)
          </h2>
          <p className="text-body text-[color:var(--surface-graphite)]">
            What the case study links to from its big NEXT → footer block.
          </p>
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-4">
              <TextField name="next.slug" label="SLUG" />
            </div>
            <div className="col-span-8">
              <TextField name="next.title" label="TITLE" />
            </div>
          </div>
        </section>

        {/* Save bar */}
        <div className="sticky bottom-0 -mx-[clamp(24px,4vw,64px)] flex flex-wrap items-center gap-4 border-t border-[color:color-mix(in_srgb,var(--surface-graphite)_35%,transparent)] bg-[color:var(--surface-paper)] px-[clamp(24px,4vw,64px)] py-4">
          <SaveButton status={flow.status} wired />
          <SaveStatus state={flow.inline} onSavedExpire={flow.onSavedExpire} />
        </div>
      </form>

      <ConflictModal
        open={flow.conflictOpen}
        message={flow.conflictMessage}
        onReload={flow.onConflictReload}
        onCancel={flow.onConflictCancel}
      />
    </FormProvider>
  );
}

/* ---------- Chapters list ---------------------------------------------- */

function ChaptersList() {
  const chapters = useFieldArray<CaseStudy, "chapters">({ name: "chapters" });

  return (
    <SortableList
      ids={chapters.fields.map((f) => f.id)}
      onReorder={(from, to) => chapters.move(from, to)}
    >
      <div className="flex flex-col gap-6">
        {chapters.fields.map((field, i) => (
          <SortableItem key={field.id} id={field.id}>
            <div className="flex items-start gap-2">
              <div className="pt-6">
                <DragHandle className="text-[color:var(--surface-graphite)] hover:text-[color:var(--surface-ink)]" />
              </div>
              <div className="flex-1">
                <ChapterEditor
                  chapterIndex={i}
                  total={chapters.fields.length}
                  onMoveUp={() => chapters.move(i, i - 1)}
                  onMoveDown={() => chapters.move(i, i + 1)}
                  onDelete={() => chapters.remove(i)}
                />
              </div>
            </div>
          </SortableItem>
        ))}
      </div>
    </SortableList>
  );
}

function ChaptersAddButton() {
  const chapters = useFieldArray<CaseStudy, "chapters">({ name: "chapters" });

  return (
    <button
      type="button"
      onClick={() =>
        chapters.append({
          slug: "new-chapter",
          eyebrow: "",
          title: "",
          sections: [],
        })
      }
      className="inline-flex items-center border border-[color:var(--surface-ink)] px-3 py-2 text-mono-s text-[color:var(--surface-ink)] transition-opacity duration-300 ease-[var(--ease-out-soft)] hover:opacity-60"
    >
      + ADD CHAPTER
    </button>
  );
}

/* ---------- Gallery editor (bento supporting tiles) ----------------------- */

const BENTO_LABELS = [
  { label: "TILE 1 — wide landscape (under text card)", shape: "2 × 1" },
  { label: "TILE 2 — medium square (top right)", shape: "2 × 2" },
  { label: "TILE 3 — tall portrait (bottom-mid right)", shape: "1 × 2" },
  { label: "TILE 4 — small square (right column)", shape: "1 × 1" },
  { label: "TILE 5 — small square (right column)", shape: "1 × 1" },
];

function GalleryList({ slug }: { slug: string }) {
  const gallery = useFieldArray<CaseStudy, "gallery">({ name: "gallery" });

  if (gallery.fields.length === 0) {
    return (
      <p className="text-body text-[color:var(--surface-graphite)]">
        No bento tiles yet. Use “+ Add tile” above to add up to 5 supporting
        assets.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {gallery.fields.map((field, i) => {
        const meta = BENTO_LABELS[i] ?? {
          label: `TILE ${i + 1} — extra (not rendered, max 5)`,
          shape: "—",
        };
        return (
          <div
            key={field.id}
            className="flex flex-col gap-4 rounded-[4px] border border-[color:color-mix(in_srgb,var(--surface-graphite)_15%,transparent)] bg-[color:color-mix(in_srgb,var(--surface-graphite)_4%,transparent)] p-5"
          >
            <header className="flex items-baseline justify-between gap-3">
              <div className="flex flex-col gap-1">
                <span className="text-mono-s text-[color:var(--surface-ink)]">
                  {meta.label}
                </span>
                <span className="text-mono-s text-[color:var(--surface-graphite)]">
                  Span: {meta.shape}
                </span>
              </div>
              <div className="flex items-center gap-3">
                {i > 0 && (
                  <button
                    type="button"
                    onClick={() => gallery.move(i, i - 1)}
                    className="text-mono-s text-[color:var(--surface-graphite)] transition-opacity duration-300 ease-[var(--ease-out-soft)] hover:text-[color:var(--surface-ink)]"
                  >
                    ↑
                  </button>
                )}
                {i < gallery.fields.length - 1 && (
                  <button
                    type="button"
                    onClick={() => gallery.move(i, i + 1)}
                    className="text-mono-s text-[color:var(--surface-graphite)] transition-opacity duration-300 ease-[var(--ease-out-soft)] hover:text-[color:var(--surface-ink)]"
                  >
                    ↓
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => gallery.remove(i)}
                  className="text-mono-s text-[color:var(--surface-graphite)] transition-opacity duration-300 ease-[var(--ease-out-soft)] hover:text-[color:var(--surface-ink)]"
                >
                  REMOVE
                </button>
              </div>
            </header>

            <div className="flex flex-col gap-4">
              <ImageUploadField
                name={`gallery.${i}.src`}
                label="ASSET (image / gif / video)"
                uploadDir={`work/${slug}`}
              />
              <TextField name={`gallery.${i}.alt`} label="ALT TEXT" />
              <TextField
                name={`gallery.${i}.caption`}
                label="CAPTION (optional)"
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function GalleryAddButton() {
  const gallery = useFieldArray<CaseStudy, "gallery">({ name: "gallery" });
  const filled = gallery.fields.length;
  if (filled >= 5) return null;
  return (
    <button
      type="button"
      onClick={() =>
        gallery.append({ src: "", alt: "", caption: "" })
      }
      className="inline-flex items-center border border-[color:var(--surface-ink)] px-3 py-2 text-mono-s text-[color:var(--surface-ink)] transition-opacity duration-300 ease-[var(--ease-out-soft)] hover:opacity-60"
    >
      + ADD TILE ({filled}/5)
    </button>
  );
}
