"use client";

import { useFieldArray } from "react-hook-form";

import { TextField } from "../fields/TextField";
import { TextareaField } from "../fields/TextareaField";
import { SelectField } from "../fields/SelectField";
import { ListActions } from "../fields/ListActions";

const CHIP_TONES = [
  { value: "pm", label: "PM (purple)" },
  { value: "design", label: "Design (blue)" },
  { value: "engineer", label: "Engineer (black)" },
  { value: "neutral", label: "Neutral (graphite)" },
] as const;

export function CardGridFields({ pathPrefix }: { pathPrefix: string }) {
  const { fields, append, remove, move } = useFieldArray({
    name: `${pathPrefix}.cards` as `${string}.cards`,
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <span className="text-mono-s text-[color:var(--surface-graphite)]">
          CARDS
        </span>
        <button
          type="button"
          onClick={() => append({ title: "", body: "" })}
          className="inline-flex items-center border border-[color:var(--surface-ink)] px-3 py-2 text-mono-s text-[color:var(--surface-ink)] transition-opacity duration-300 ease-[var(--ease-out-soft)] hover:opacity-60"
        >
          + ADD CARD
        </button>
      </div>

      <ul className="flex flex-col gap-6">
        {fields.map((field, i) => (
          <li
            key={field.id}
            className="flex items-start gap-3 border-t border-[color:color-mix(in_srgb,var(--surface-graphite)_25%,transparent)] pt-4"
          >
            <div className="flex flex-1 flex-col gap-3">
              <TextField
                name={`${pathPrefix}.cards.${i}.title`}
                label={`CARD ${i + 1} TITLE`}
              />
              <TextareaField
                name={`${pathPrefix}.cards.${i}.body`}
                label="BODY"
                rows={3}
              />
              <div className="grid grid-cols-12 gap-3">
                <div className="col-span-6">
                  <TextField
                    name={`${pathPrefix}.cards.${i}.chip.label`}
                    label="CHIP LABEL (optional)"
                  />
                </div>
                <div className="col-span-6">
                  <SelectField
                    name={`${pathPrefix}.cards.${i}.chip.tone`}
                    label="CHIP TONE"
                    options={CHIP_TONES}
                  />
                </div>
              </div>
            </div>
            <div className="pt-7">
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
    </div>
  );
}
