"use client";

import { useFieldArray } from "react-hook-form";

import type { CaseStudy, ChapterSection } from "@/content/types";

import { TextField } from "./fields/TextField";
import { ListActions } from "./fields/ListActions";
import { SectionAccordion } from "./sections/SectionAccordion";
import { AddSectionCombobox } from "./sections/AddSectionCombobox";
import { defaultSection } from "./sections/defaults";

interface ChapterEditorProps {
  chapterIndex: number;
  total: number;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDelete: () => void;
}

/**
 * Editor for a single chapter — chapter slug + eyebrow + title fields,
 * plus the sections list rendered as a vertical stack of accordions.
 *
 * The sections useFieldArray reads `control` from the parent CaseStudyForm
 * via FormProvider context. The path prefix used for child fields is
 * `chapters.${chapterIndex}.sections.${sectionIndex}` so RHF knows where
 * to write each value in the nested form state.
 */
export function ChapterEditor({
  chapterIndex,
  total,
  onMoveUp,
  onMoveDown,
  onDelete,
}: ChapterEditorProps) {
  const sections = useFieldArray<CaseStudy, `chapters.${number}.sections`>({
    name: `chapters.${chapterIndex}.sections`,
  });

  const chapterPath = `chapters.${chapterIndex}`;

  function appendSection(kind: ChapterSection["kind"]) {
    sections.append(defaultSection(kind));
  }

  return (
    <article className="rounded-2xl border border-[color:color-mix(in_srgb,var(--surface-graphite)_35%,transparent)] p-[clamp(20px,3vw,40px)]">
      <header className="flex items-start gap-4">
        <span className="text-mono-s text-[color:var(--surface-graphite)]">
          CHAPTER {String(chapterIndex + 1).padStart(2, "0")}
        </span>
        <div className="flex-1" />
        <ListActions
          index={chapterIndex}
          total={total}
          onMoveUp={onMoveUp}
          onMoveDown={onMoveDown}
          onDelete={onDelete}
        />
      </header>

      {/* Chapter metadata */}
      <div className="mt-6 grid grid-cols-12 gap-4">
        <div className="col-span-4">
          <TextField
            name={`${chapterPath}.slug`}
            label="SLUG"
            description="Anchor id used by the TOC, e.g. `context`."
          />
        </div>
        <div className="col-span-8">
          <TextField
            name={`${chapterPath}.eyebrow`}
            label="EYEBROW"
            description="Small italic label above the chapter heading."
          />
        </div>
        <div className="col-span-12">
          <TextField
            name={`${chapterPath}.title`}
            label="TITLE"
            description="The chapter heading. Display-m italic on the page."
          />
        </div>
      </div>

      {/* Sections list */}
      <section className="mt-10">
        <header className="mb-2 flex items-center justify-between">
          <span className="text-mono-s text-[color:var(--surface-graphite)]">
            SECTIONS · {sections.fields.length}
          </span>
        </header>

        <div className="flex flex-col">
          {sections.fields.map((field, sectionIndex) => (
            <SectionAccordion
              key={field.id}
              pathPrefix={`${chapterPath}.sections.${sectionIndex}`}
              index={sectionIndex}
              total={sections.fields.length}
              onMoveUp={() => sections.move(sectionIndex, sectionIndex - 1)}
              onMoveDown={() => sections.move(sectionIndex, sectionIndex + 1)}
              onDelete={() => sections.remove(sectionIndex)}
            />
          ))}
        </div>

        <div className="mt-6">
          <AddSectionCombobox onAdd={appendSection} />
        </div>
      </section>
    </article>
  );
}
