"use client";

import { useFieldArray } from "react-hook-form";

import { TextField } from "../fields/TextField";
import { TextareaField } from "../fields/TextareaField";
import { PathField } from "../fields/PathField";
import { ListActions } from "../fields/ListActions";

export function TabGroupFields({ pathPrefix }: { pathPrefix: string }) {
  const { fields, append, remove, move } = useFieldArray({
    name: `${pathPrefix}.tabs` as `${string}.tabs`,
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <span className="text-mono-s text-[color:var(--surface-graphite)]">
          TABS
        </span>
        <button
          type="button"
          onClick={() => append({ label: "" })}
          className="inline-flex items-center border border-[color:var(--surface-ink)] px-3 py-2 text-mono-s text-[color:var(--surface-ink)] transition-opacity duration-300 ease-[var(--ease-out-soft)] hover:opacity-60"
        >
          + ADD TAB
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
                name={`${pathPrefix}.tabs.${i}.label`}
                label={`TAB ${i + 1} LABEL`}
              />
              <TextareaField
                name={`${pathPrefix}.tabs.${i}.body`}
                label="BODY (optional)"
                rows={3}
              />
              <PathField
                name={`${pathPrefix}.tabs.${i}.image.src`}
                label="IMAGE PATH (optional)"
              />
              <TextField
                name={`${pathPrefix}.tabs.${i}.image.alt`}
                label="IMAGE ALT TEXT"
              />
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
