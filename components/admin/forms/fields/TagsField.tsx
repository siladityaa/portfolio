"use client";

import { Controller, useFormContext } from "react-hook-form";
import clsx from "clsx";

interface TagsFieldProps {
  name: string;
  label: string;
  options: ReadonlyArray<{ value: string; label: string }>;
  description?: string;
}

/**
 * Checkbox group rendered as toggleable pill chips. Used for case study
 * tags (wearables / ai / consumer / concept). Stores the selected values
 * as a string array in the form state via Controller.
 */
export function TagsField({
  name,
  label,
  options,
  description,
}: TagsFieldProps) {
  const { control } = useFormContext();

  return (
    <div className="flex flex-col gap-3">
      <span className="text-mono-s text-[color:var(--surface-graphite)]">
        {label}
      </span>
      {description ? (
        <span className="text-body text-[color:var(--surface-graphite)]">
          {description}
        </span>
      ) : null}
      <Controller
        control={control}
        name={name}
        render={({ field }) => {
          const selected: string[] = Array.isArray(field.value)
            ? field.value
            : [];
          return (
            <div className="flex flex-wrap gap-2">
              {options.map((opt) => {
                const isOn = selected.includes(opt.value);
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      if (isOn) {
                        field.onChange(selected.filter((v) => v !== opt.value));
                      } else {
                        field.onChange([...selected, opt.value]);
                      }
                    }}
                    aria-pressed={isOn}
                    className={clsx(
                      "inline-flex items-center rounded-full border px-4 py-2 text-mono-s transition-colors duration-300 ease-[var(--ease-out-soft)]",
                      isOn
                        ? "border-[color:var(--surface-ink)] bg-[color:var(--surface-ink)] text-[color:var(--surface-paper)]"
                        : "border-[color:color-mix(in_srgb,var(--surface-graphite)_40%,transparent)] text-[color:var(--surface-graphite)] hover:border-[color:var(--surface-ink)] hover:text-[color:var(--surface-ink)]",
                    )}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          );
        }}
      />
    </div>
  );
}
