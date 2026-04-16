"use client";

import { useForm, FormProvider, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { nowContentSchema } from "@/content/schemas";
import type { NowContent } from "@/content/types";

import { TextField } from "./fields/TextField";
import { ListActions } from "./fields/ListActions";
import { SaveButton } from "@/components/admin/SaveButton";
import { SaveStatus } from "@/components/admin/SaveStatus";
import { ConflictModal } from "@/components/admin/ConflictModal";
import { DirtyWarning } from "@/components/admin/DirtyWarning";
import { useSaveFlow } from "@/components/admin/useSaveFlow";
import { saveNow } from "@/app/(admin)/admin/actions";

interface NowFormProps {
  defaultValues: NowContent;
}

/**
 * Now block editor — three lists:
 *   - nowPlaying:    array of { title, artist, album? }
 *   - nowFacts:      array of { label, value }   (CURRENTLY / READING / etc.)
 *   - previouslyFacts: array of { label, value } (PREVIOUSLY / BEFORE THAT / etc.)
 *
 * No nesting beyond one level. Each list uses useFieldArray for
 * add/remove/up/down via ListActions.
 *
 * Step 3 — local state only, save no-op. Step 4 wires the server action.
 */
export function NowForm({ defaultValues }: NowFormProps) {
  const methods = useForm<NowContent>({
    resolver: zodResolver(nowContentSchema),
    defaultValues,
    mode: "onChange",
  });

  const flow = useSaveFlow<NowContent>({
    methods,
    action: saveNow,
  });

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(flow.onSubmit)}
        className="flex flex-col gap-16"
      >
        <DirtyWarning />

        <NowPlayingSection />
        <FactList
          title="CURRENTLY"
          arrayName="nowFacts"
          description="Right column of the home About teaser. ~4 entries."
        />
        <FactList
          title="PREVIOUSLY"
          arrayName="previouslyFacts"
          description="Side panel on /about. ~4 entries."
        />

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

/* ---------- Now playing list ------------------------------------------- */

function NowPlayingSection() {
  // useFieldArray pulls `control` from the parent FormProvider via
  // useFormContext automatically — no explicit prop needed.
  const { fields, append, remove, move } = useFieldArray<
    NowContent,
    "nowPlaying"
  >({
    name: "nowPlaying",
  });

  return (
    <section className="flex flex-col gap-4">
      <header className="flex items-baseline justify-between gap-4">
        <div>
          <h2 className="text-display-s italic text-[color:var(--surface-ink)]">
            Now playing
          </h2>
          <p className="mt-1 text-body text-[color:var(--surface-graphite)]">
            Cycles in the bottom-left chrome every ~8s. 3–5 tracks works well.
          </p>
        </div>
        <button
          type="button"
          onClick={() => append({ title: "", artist: "", album: undefined })}
          className="inline-flex items-center border border-[color:var(--surface-ink)] px-3 py-2 text-mono-s text-[color:var(--surface-ink)] transition-opacity duration-300 ease-[var(--ease-out-soft)] hover:opacity-60"
        >
          + ADD TRACK
        </button>
      </header>

      <ul className="flex flex-col gap-4">
        {fields.map((field, i) => (
          <li
            key={field.id}
            className="grid grid-cols-12 items-end gap-3 border-t border-[color:color-mix(in_srgb,var(--surface-graphite)_25%,transparent)] pt-4"
          >
            <div className="col-span-4">
              <TextField name={`nowPlaying.${i}.title`} label="TITLE" />
            </div>
            <div className="col-span-4">
              <TextField name={`nowPlaying.${i}.artist`} label="ARTIST" />
            </div>
            <div className="col-span-3">
              <TextField name={`nowPlaying.${i}.album`} label="ALBUM" />
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

/* ---------- Fact list (used by both nowFacts and previouslyFacts) ------ */

function FactList({
  title,
  arrayName,
  description,
}: {
  title: string;
  arrayName: "nowFacts" | "previouslyFacts";
  description: string;
}) {
  const { fields, append, remove, move } = useFieldArray<
    NowContent,
    "nowFacts" | "previouslyFacts"
  >({
    name: arrayName,
  });

  return (
    <section className="flex flex-col gap-4">
      <header className="flex items-baseline justify-between gap-4">
        <div>
          <h2 className="text-display-s italic text-[color:var(--surface-ink)]">
            {title}
          </h2>
          <p className="mt-1 text-body text-[color:var(--surface-graphite)]">
            {description}
          </p>
        </div>
        <button
          type="button"
          onClick={() => append({ label: "", value: "" })}
          className="inline-flex items-center border border-[color:var(--surface-ink)] px-3 py-2 text-mono-s text-[color:var(--surface-ink)] transition-opacity duration-300 ease-[var(--ease-out-soft)] hover:opacity-60"
        >
          + ADD ROW
        </button>
      </header>

      <ul className="flex flex-col gap-4">
        {fields.map((field, i) => (
          <li
            key={field.id}
            className="grid grid-cols-12 items-end gap-3 border-t border-[color:color-mix(in_srgb,var(--surface-graphite)_25%,transparent)] pt-4"
          >
            <div className="col-span-4">
              <TextField name={`${arrayName}.${i}.label`} label="LABEL" />
            </div>
            <div className="col-span-7">
              <TextField name={`${arrayName}.${i}.value`} label="VALUE" />
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
