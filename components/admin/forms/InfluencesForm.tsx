"use client";

import { useForm, FormProvider, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { influencesContentSchema } from "@/content/schemas";
import type { InfluencesContent } from "@/content/types";

import { TextField } from "./fields/TextField";
import { TextareaField } from "./fields/TextareaField";
import { SelectField } from "./fields/SelectField";
import { ListActions } from "./fields/ListActions";
import { SaveButton } from "@/components/admin/SaveButton";
import { SaveStatus } from "@/components/admin/SaveStatus";
import { ConflictModal } from "@/components/admin/ConflictModal";
import { DirtyWarning } from "@/components/admin/DirtyWarning";
import { useSaveFlow } from "@/components/admin/useSaveFlow";
import { saveInfluences } from "@/app/(admin)/admin/actions";

interface InfluencesFormProps {
  defaultValues: InfluencesContent;
}

const CATEGORY_OPTIONS = [
  { value: "brand", label: "Brand" },
  { value: "person", label: "Person" },
  { value: "studio", label: "Studio" },
  { value: "object", label: "Object" },
  { value: "musician", label: "Musician" },
  { value: "filmmaker", label: "Filmmaker" },
  { value: "architect", label: "Architect" },
] as const;

/**
 * Influences editor — flat array of { name, category, why }.
 *
 * Reordering via ListActions up/down buttons. Delete via confirm prompt.
 * The `why` field is long-form and lives on its own row so longer copy
 * doesn't crowd the grid.
 */
export function InfluencesForm({ defaultValues }: InfluencesFormProps) {
  const methods = useForm<InfluencesContent>({
    resolver: zodResolver(influencesContentSchema),
    defaultValues,
    mode: "onChange",
  });

  const flow = useSaveFlow<InfluencesContent>({
    methods,
    action: saveInfluences,
  });

  const { fields, append, remove, move } = useFieldArray<
    InfluencesContent,
    "influences"
  >({
    control: methods.control,
    name: "influences",
  });

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(flow.onSubmit)}
        className="flex flex-col gap-12"
      >
        <DirtyWarning />

        <section className="flex flex-col gap-4">
          <header className="flex items-baseline justify-between gap-4">
            <div>
              <h2 className="text-display-s italic text-[color:var(--surface-ink)]">
                Influences
              </h2>
              <p className="mt-1 text-body text-[color:var(--surface-graphite)]">
                Shown on /about as a single grid. Category drives the small
                mono label next to each entry.
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                append({ name: "", category: "brand", why: "" })
              }
              className="inline-flex items-center border border-[color:var(--surface-ink)] px-3 py-2 text-mono-s text-[color:var(--surface-ink)] transition-opacity duration-300 ease-[var(--ease-out-soft)] hover:opacity-60"
            >
              + ADD INFLUENCE
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
                  <div className="col-span-7">
                    <TextField
                      name={`influences.${i}.name`}
                      label="NAME"
                    />
                  </div>
                  <div className="col-span-5">
                    <SelectField
                      name={`influences.${i}.category`}
                      label="CATEGORY"
                      options={CATEGORY_OPTIONS}
                    />
                  </div>
                  <div className="col-span-12">
                    <TextareaField
                      name={`influences.${i}.why`}
                      label="WHY"
                      description="Short, first-person. 1–2 sentences."
                      rows={3}
                    />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>

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
