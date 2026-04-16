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
import { ChapterEditor } from "./ChapterEditor";
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
  { value: "nda", label: "NDA — ask for deck" },
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
          <PathField name="hero.src" label="IMAGE PATH" />
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

        {/* Chapters */}
        <section className="flex flex-col gap-6">
          <header className="flex items-baseline justify-between">
            <h2 className="text-display-s italic text-[color:var(--surface-ink)]">
              Chapters
            </h2>
            <ChaptersAddButton />
          </header>
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
    <div className="flex flex-col gap-6">
      {chapters.fields.map((field, i) => (
        <ChapterEditor
          key={field.id}
          chapterIndex={i}
          total={chapters.fields.length}
          onMoveUp={() => chapters.move(i, i - 1)}
          onMoveDown={() => chapters.move(i, i + 1)}
          onDelete={() => chapters.remove(i)}
        />
      ))}
    </div>
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
