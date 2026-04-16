"use client";

import { useFieldArray } from "react-hook-form";

import { PathField } from "../fields/PathField";
import { TextField } from "../fields/TextField";
import { SelectField } from "../fields/SelectField";
import { ListActions } from "../fields/ListActions";

export function ImageGridFields({ pathPrefix }: { pathPrefix: string }) {
  // useFieldArray reads `control` from the parent FormProvider context.
  // The parent path is dynamic (chapters.0.sections.3.images), so we
  // construct the field-array name from the prefix.
  const { fields, append, remove, move } = useFieldArray({
    name: `${pathPrefix}.images` as `${string}.images`,
  });

  return (
    <div className="flex flex-col gap-6">
      <SelectField
        name={`${pathPrefix}.cols`}
        label="COLUMNS"
        description="Number of columns the grid wraps to at md+."
        options={[
          { value: "1", label: "1 column" },
          { value: "2", label: "2 columns" },
          { value: "3", label: "3 columns" },
        ]}
      />

      <div className="flex items-center justify-between">
        <span className="text-mono-s text-[color:var(--surface-graphite)]">
          IMAGES
        </span>
        <button
          type="button"
          onClick={() => append({ src: "", alt: "" })}
          className="inline-flex items-center border border-[color:var(--surface-ink)] px-3 py-2 text-mono-s text-[color:var(--surface-ink)] transition-opacity duration-300 ease-[var(--ease-out-soft)] hover:opacity-60"
        >
          + ADD IMAGE
        </button>
      </div>

      <ul className="flex flex-col gap-4">
        {fields.map((field, i) => (
          <li
            key={field.id}
            className="flex items-start gap-3 border-t border-[color:color-mix(in_srgb,var(--surface-graphite)_25%,transparent)] pt-4"
          >
            <div className="flex-1 flex flex-col gap-3">
              <PathField name={`${pathPrefix}.images.${i}.src`} label="PATH" />
              <TextField
                name={`${pathPrefix}.images.${i}.alt`}
                label="ALT TEXT"
              />
              <TextField
                name={`${pathPrefix}.images.${i}.caption`}
                label="CAPTION (optional)"
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
