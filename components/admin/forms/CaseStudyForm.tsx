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
import { ImageUploadField } from "./fields/ImageUploadField";
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
  { value: "comingSoon", label: "Coming soon" },
] as const;

const TAG_OPTIONS = [
  { value: "wearables", label: "WEARABLES" },
  { value: "ai", label: "AI" },
  { value: "consumer", label: "CONSUMER" },
  { value: "concept", label: "CONCEPT" },
] as const;

/**
 * Case study editor — sized for the bento layout the public site renders.
 *
 *   Frontmatter → Hero → Brief → Bento gallery → Save
 *
 * Chapters / next-project / section editors were removed alongside the
 * old long-scroll layout; only fields the public component reads remain.
 */
export function CaseStudyForm({ defaultValues }: CaseStudyFormProps) {
  const methods = useForm<CaseStudy>({
    resolver: zodResolver(caseStudySchema),
    defaultValues,
    mode: "onChange",
  });

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

        {/* Frontmatter */}
        <section className="flex flex-col gap-6">
          <h2 className="text-display-s italic text-[color:var(--surface-ink)]">
            Frontmatter
          </h2>

          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-6">
              <TextField
                name="slug"
                label="SLUG"
                readOnly
                description="URL slug — also the JSON filename. Locked once the case study exists; to rename, delete it from the danger zone below and create a new one."
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
                label="CREDITS / PARTNERS (optional)"
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
                description="Categorise the case study."
                options={TAG_OPTIONS}
              />
            </div>
          </div>
        </section>

        {/* Hero — the dominant tile in the bento */}
        <section className="flex flex-col gap-6">
          <header className="flex flex-col gap-2">
            <h2 className="text-display-s italic text-[color:var(--surface-ink)]">
              Hero asset
            </h2>
            <p className="text-body text-[color:var(--surface-graphite)]">
              The biggest tile in the bento (3 × 4). Image, GIF, or video.
            </p>
          </header>
          <ImageUploadField
            name="hero.src"
            label="HERO ASSET"
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
            description="The short paragraph in the text card. Aim for ~60–80 words."
            rows={5}
          />
        </section>

        {/* Metrics */}
        <section className="flex flex-col gap-6">
          <header className="flex flex-col gap-2">
            <div className="flex items-baseline justify-between">
              <h2 className="text-display-s italic text-[color:var(--surface-ink)]">
                Metrics
              </h2>
              <MetricsAddButton />
            </div>
            <p className="text-body text-[color:var(--surface-graphite)]">
              Up to 4 highlight numbers — appears as a row beneath the hero
              ("BY THE NUMBERS"). Leave empty to skip the section.
            </p>
          </header>
          <MetricsList />
        </section>

        {/* Body sections */}
        <section className="flex flex-col gap-6">
          <header className="flex flex-col gap-2">
            <div className="flex items-baseline justify-between">
              <h2 className="text-display-s italic text-[color:var(--surface-ink)]">
                Body sections
              </h2>
              <BodyAddButton />
            </div>
            <p className="text-body text-[color:var(--surface-graphite)]">
              Repeating heading + paragraph blocks (Problem, Research,
              Solution, etc.). Order matters — they render top to bottom in
              the order shown.
            </p>
          </header>
          <BodyList />
        </section>

        {/* Gallery (additional assets) */}
        <section className="flex flex-col gap-6">
          <header className="flex flex-col gap-2">
            <div className="flex items-baseline justify-between">
              <h2 className="text-display-s italic text-[color:var(--surface-ink)]">
                Gallery
              </h2>
              <GalleryAddButton />
            </div>
            <p className="text-body text-[color:var(--surface-graphite)]">
              Up to 4 supporting assets, stacked vertically beneath the body
              sections under "SELECTED ASSETS".
            </p>
          </header>
          <GalleryList slug={defaultValues.slug} />
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

/* ---------- Gallery editor (bento supporting tiles) ----------------------- */

const BENTO_LABELS = [
  { label: "TILE 1 — medium square (top right)", shape: "2 × 2" },
  { label: "TILE 2 — tall portrait (right column)", shape: "1 × 2" },
  { label: "TILE 3 — small square (right column)", shape: "1 × 1" },
  { label: "TILE 4 — small square (right column)", shape: "1 × 1" },
];

const BENTO_MAX = 4;

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
          label: `TILE ${i + 1} — extra (not rendered, max ${BENTO_MAX})`,
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
  if (filled >= BENTO_MAX) return null;
  return (
    <button
      type="button"
      onClick={() =>
        gallery.append({ src: "", alt: "", caption: "" })
      }
      className="inline-flex items-center border border-[color:var(--surface-ink)] px-3 py-2 text-mono-s text-[color:var(--surface-ink)] transition-opacity duration-300 ease-[var(--ease-out-soft)] hover:opacity-60"
    >
      + ADD TILE ({filled}/{BENTO_MAX})
    </button>
  );
}

/* ---------- Metrics editor (up to 4 highlight numbers) -------------------- */

const METRICS_MAX = 4;

function MetricsList() {
  const metrics = useFieldArray<CaseStudy, "metrics">({ name: "metrics" });

  if (metrics.fields.length === 0) {
    return (
      <p className="text-body text-[color:var(--surface-graphite)]">
        No metrics yet. Use “+ Add metric” above to add up to 4.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {metrics.fields.map((field, i) => (
        <div
          key={field.id}
          className="flex flex-col gap-3 rounded-[4px] border border-[color:color-mix(in_srgb,var(--surface-graphite)_15%,transparent)] bg-[color:color-mix(in_srgb,var(--surface-graphite)_4%,transparent)] p-4"
        >
          <div className="flex items-baseline justify-between gap-3">
            <span className="text-mono-s text-[color:var(--surface-ink)]">
              METRIC {String(i + 1).padStart(2, "0")}
            </span>
            <div className="flex items-center gap-3 text-mono-s text-[color:var(--surface-graphite)]">
              {i > 0 && (
                <button
                  type="button"
                  onClick={() => metrics.move(i, i - 1)}
                  className="transition-opacity duration-300 ease-[var(--ease-out-soft)] hover:text-[color:var(--surface-ink)]"
                >
                  ↑
                </button>
              )}
              {i < metrics.fields.length - 1 && (
                <button
                  type="button"
                  onClick={() => metrics.move(i, i + 1)}
                  className="transition-opacity duration-300 ease-[var(--ease-out-soft)] hover:text-[color:var(--surface-ink)]"
                >
                  ↓
                </button>
              )}
              <button
                type="button"
                onClick={() => metrics.remove(i)}
                className="transition-opacity duration-300 ease-[var(--ease-out-soft)] hover:text-[color:var(--surface-ink)]"
              >
                REMOVE
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <TextField
              name={`metrics.${i}.value`}
              label="VALUE"
              placeholder="10M+"
            />
            <TextField
              name={`metrics.${i}.label`}
              label="LABEL"
              placeholder="users reached"
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function MetricsAddButton() {
  const metrics = useFieldArray<CaseStudy, "metrics">({ name: "metrics" });
  const filled = metrics.fields.length;
  if (filled >= METRICS_MAX) return null;
  return (
    <button
      type="button"
      onClick={() => metrics.append({ value: "", label: "" })}
      className="inline-flex items-center border border-[color:var(--surface-ink)] px-3 py-2 text-mono-s text-[color:var(--surface-ink)] transition-opacity duration-300 ease-[var(--ease-out-soft)] hover:opacity-60"
    >
      + ADD METRIC ({filled}/{METRICS_MAX})
    </button>
  );
}

/* ---------- Body sections editor ----------------------------------------- */

function BodyList() {
  const body = useFieldArray<CaseStudy, "body">({ name: "body" });

  if (body.fields.length === 0) {
    return (
      <p className="text-body text-[color:var(--surface-graphite)]">
        No body sections yet. Use “+ Add section” above to add Problem,
        Research, Solution, etc.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {body.fields.map((field, i) => (
        <div
          key={field.id}
          className="flex flex-col gap-4 rounded-[4px] border border-[color:color-mix(in_srgb,var(--surface-graphite)_15%,transparent)] bg-[color:color-mix(in_srgb,var(--surface-graphite)_4%,transparent)] p-5"
        >
          <div className="flex items-baseline justify-between gap-3">
            <span className="text-mono-s text-[color:var(--surface-ink)]">
              SECTION {String(i + 1).padStart(2, "0")}
            </span>
            <div className="flex items-center gap-3 text-mono-s text-[color:var(--surface-graphite)]">
              {i > 0 && (
                <button
                  type="button"
                  onClick={() => body.move(i, i - 1)}
                  className="transition-opacity duration-300 ease-[var(--ease-out-soft)] hover:text-[color:var(--surface-ink)]"
                >
                  ↑
                </button>
              )}
              {i < body.fields.length - 1 && (
                <button
                  type="button"
                  onClick={() => body.move(i, i + 1)}
                  className="transition-opacity duration-300 ease-[var(--ease-out-soft)] hover:text-[color:var(--surface-ink)]"
                >
                  ↓
                </button>
              )}
              <button
                type="button"
                onClick={() => body.remove(i)}
                className="transition-opacity duration-300 ease-[var(--ease-out-soft)] hover:text-[color:var(--surface-ink)]"
              >
                REMOVE
              </button>
            </div>
          </div>
          <TextField
            name={`body.${i}.heading`}
            label="HEADING"
            placeholder="Problem"
          />
          <TextareaField
            name={`body.${i}.body`}
            label="BODY"
            description="Longform paragraph. Line breaks render as paragraph breaks."
            rows={8}
          />
        </div>
      ))}
    </div>
  );
}

function BodyAddButton() {
  const body = useFieldArray<CaseStudy, "body">({ name: "body" });
  return (
    <button
      type="button"
      onClick={() => body.append({ heading: "", body: "" })}
      className="inline-flex items-center border border-[color:var(--surface-ink)] px-3 py-2 text-mono-s text-[color:var(--surface-ink)] transition-opacity duration-300 ease-[var(--ease-out-soft)] hover:opacity-60"
    >
      + ADD SECTION ({body.fields.length})
    </button>
  );
}
