"use client";

import {
  useForm,
  FormProvider,
  useFieldArray,
  useFormContext,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { timelineContentSchema } from "@/content/schemas";
import type { TimelineContent } from "@/content/types";

import { TextField } from "./fields/TextField";
import { SelectField } from "./fields/SelectField";
import { ListActions } from "./fields/ListActions";
import { SaveButton } from "@/components/admin/SaveButton";
import { SaveStatus } from "@/components/admin/SaveStatus";
import { ConflictModal } from "@/components/admin/ConflictModal";
import { DirtyWarning } from "@/components/admin/DirtyWarning";
import { useSaveFlow } from "@/components/admin/useSaveFlow";
import { saveTimeline } from "@/app/(admin)/admin/actions";

interface TimelineFormProps {
  defaultValues: TimelineContent;
}

const ROLE_KIND_OPTIONS = [
  { value: "full-time", label: "Full-time" },
  { value: "part-time", label: "Part-time" },
  { value: "internship", label: "Internship" },
  { value: "contract", label: "Contract" },
  { value: "service", label: "Service" },
] as const;

/**
 * Timeline editor — three lists:
 *   - timeline:  work history rows (company, role, kind, dates, etc.)
 *   - education: degrees
 *   - awards:    flat list of award names
 *
 * Lists are reorder-able via up/down buttons (useFieldArray.move) and
 * deletable via window.confirm. Adding a new row appends a minimally-
 * valid default so the Zod resolver doesn't throw immediately.
 */
export function TimelineForm({ defaultValues }: TimelineFormProps) {
  const methods = useForm<TimelineContent>({
    resolver: zodResolver(timelineContentSchema),
    defaultValues,
    mode: "onChange",
  });

  const flow = useSaveFlow<TimelineContent>({
    methods,
    action: saveTimeline,
  });

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(flow.onSubmit)}
        className="flex flex-col gap-16"
      >
        <DirtyWarning />

        <WorkSection />
        <EducationSection />
        <AwardsSection />

        <div className="flex flex-wrap items-center gap-4 pt-4">
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

/* ---------- Work timeline --------------------------------------------- */

function WorkSection() {
  const { fields, append, remove, move } = useFieldArray<
    TimelineContent,
    "timeline"
  >({
    name: "timeline",
  });

  return (
    <section className="flex flex-col gap-4">
      <header className="flex items-baseline justify-between gap-4">
        <div>
          <h2 className="text-display-s italic text-[color:var(--surface-ink)]">
            Work
          </h2>
          <p className="mt-1 text-body text-[color:var(--surface-graphite)]">
            Roles listed newest-first on /about. Use <code>YYYY-MM</code> for
            dates, or the literal string <code>present</code> in the end field
            for the current role.
          </p>
        </div>
        <button
          type="button"
          onClick={() =>
            append({
              company: "",
              role: "",
              kind: "full-time",
              start: "",
              end: "",
              location: "",
              highlight: "",
              current: false,
            })
          }
          className="inline-flex items-center border border-[color:var(--surface-ink)] px-3 py-2 text-mono-s text-[color:var(--surface-ink)] transition-opacity duration-300 ease-[var(--ease-out-soft)] hover:opacity-60"
        >
          + ADD ROLE
        </button>
      </header>

      <ul className="flex flex-col gap-8">
        {fields.map((field, i) => (
          <li
            key={field.id}
            className="flex flex-col gap-4 border-t border-[color:color-mix(in_srgb,var(--surface-graphite)_25%,transparent)] pt-6"
          >
            <div className="flex items-center justify-between gap-3">
              <span className="text-mono-s text-[color:var(--surface-graphite)]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <ListActions
                index={i}
                total={fields.length}
                onMoveUp={() => move(i, i - 1)}
                onMoveDown={() => move(i, i + 1)}
                onDelete={() => remove(i)}
              />
            </div>

            <div className="grid grid-cols-12 gap-3">
              <div className="col-span-6">
                <TextField name={`timeline.${i}.company`} label="COMPANY" />
              </div>
              <div className="col-span-6">
                <TextField name={`timeline.${i}.role`} label="ROLE" />
              </div>
              <div className="col-span-4">
                <SelectField
                  name={`timeline.${i}.kind`}
                  label="KIND"
                  options={ROLE_KIND_OPTIONS}
                />
              </div>
              <div className="col-span-4">
                <TextField
                  name={`timeline.${i}.start`}
                  label="START (YYYY-MM)"
                />
              </div>
              <div className="col-span-4">
                <TextField
                  name={`timeline.${i}.end`}
                  label="END (YYYY-MM | present)"
                />
              </div>
              <div className="col-span-6">
                <TextField name={`timeline.${i}.location`} label="LOCATION" />
              </div>
              <div className="col-span-6 flex items-end">
                <CurrentCheckbox name={`timeline.${i}.current`} />
              </div>
              <div className="col-span-12">
                <TextField
                  name={`timeline.${i}.highlight`}
                  label="HIGHLIGHT"
                  description="One short line shown under the role. Optional."
                />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ---------- Education -------------------------------------------------- */

function EducationSection() {
  const { fields, append, remove, move } = useFieldArray<
    TimelineContent,
    "education"
  >({
    name: "education",
  });

  return (
    <section className="flex flex-col gap-4">
      <header className="flex items-baseline justify-between gap-4">
        <div>
          <h2 className="text-display-s italic text-[color:var(--surface-ink)]">
            Education
          </h2>
          <p className="mt-1 text-body text-[color:var(--surface-graphite)]">
            Degrees and programs. Newest-first.
          </p>
        </div>
        <button
          type="button"
          onClick={() =>
            append({
              school: "",
              degree: "",
              start: "",
              end: "",
              highlight: "",
            })
          }
          className="inline-flex items-center border border-[color:var(--surface-ink)] px-3 py-2 text-mono-s text-[color:var(--surface-ink)] transition-opacity duration-300 ease-[var(--ease-out-soft)] hover:opacity-60"
        >
          + ADD SCHOOL
        </button>
      </header>

      <ul className="flex flex-col gap-8">
        {fields.map((field, i) => (
          <li
            key={field.id}
            className="flex flex-col gap-4 border-t border-[color:color-mix(in_srgb,var(--surface-graphite)_25%,transparent)] pt-6"
          >
            <div className="flex items-center justify-between gap-3">
              <span className="text-mono-s text-[color:var(--surface-graphite)]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <ListActions
                index={i}
                total={fields.length}
                onMoveUp={() => move(i, i - 1)}
                onMoveDown={() => move(i, i + 1)}
                onDelete={() => remove(i)}
              />
            </div>

            <div className="grid grid-cols-12 gap-3">
              <div className="col-span-6">
                <TextField name={`education.${i}.school`} label="SCHOOL" />
              </div>
              <div className="col-span-6">
                <TextField name={`education.${i}.degree`} label="DEGREE" />
              </div>
              <div className="col-span-6">
                <TextField
                  name={`education.${i}.start`}
                  label="START (YYYY-MM)"
                />
              </div>
              <div className="col-span-6">
                <TextField
                  name={`education.${i}.end`}
                  label="END (YYYY-MM | present)"
                />
              </div>
              <div className="col-span-12">
                <TextField
                  name={`education.${i}.highlight`}
                  label="HIGHLIGHT"
                  description="Optional one-line note."
                />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ---------- Awards ---------------------------------------------------- */

function AwardsSection() {
  const { fields, append, remove, move } = useFieldArray<
    TimelineContent,
    "awards"
  >({
    name: "awards",
  });

  return (
    <section className="flex flex-col gap-4">
      <header className="flex items-baseline justify-between gap-4">
        <div>
          <h2 className="text-display-s italic text-[color:var(--surface-ink)]">
            Awards
          </h2>
          <p className="mt-1 text-body text-[color:var(--surface-graphite)]">
            Short flat list. One name per row.
          </p>
        </div>
        <button
          type="button"
          onClick={() => append({ name: "" })}
          className="inline-flex items-center border border-[color:var(--surface-ink)] px-3 py-2 text-mono-s text-[color:var(--surface-ink)] transition-opacity duration-300 ease-[var(--ease-out-soft)] hover:opacity-60"
        >
          + ADD AWARD
        </button>
      </header>

      <ul className="flex flex-col gap-4">
        {fields.map((field, i) => (
          <li
            key={field.id}
            className="grid grid-cols-12 items-end gap-3 border-t border-[color:color-mix(in_srgb,var(--surface-graphite)_25%,transparent)] pt-4"
          >
            <div className="col-span-11">
              <TextField name={`awards.${i}.name`} label="NAME" />
            </div>
            <div className="col-span-1 flex justify-end pb-3">
              <ListActions
                index={i}
                total={fields.length}
                onMoveUp={() => move(i, i - 1)}
                onMoveDown={() => move(i, i + 1)}
                onDelete={() => remove(i)}
              />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ---------- Inline checkbox for `current` boolean --------------------- */

/**
 * Minimal RHF-bound checkbox, inlined rather than hoisted into a shared
 * field primitive because `current` is the only boolean in the CMS today.
 * If another one appears, lift this into `fields/CheckboxField.tsx`.
 */
function CurrentCheckbox({ name }: { name: string }) {
  const { register } = useFormContext();
  return (
    <label className="flex items-center gap-2 pb-3">
      <input
        type="checkbox"
        {...register(name)}
        className="h-4 w-4 border-[color:color-mix(in_srgb,var(--surface-graphite)_35%,transparent)] text-[color:var(--surface-ink)] accent-[color:var(--surface-ink)]"
      />
      <span className="text-mono-s text-[color:var(--surface-graphite)]">
        CURRENT ROLE
      </span>
    </label>
  );
}
