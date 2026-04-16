"use client";

import { useWatch, useFormContext } from "react-hook-form";

interface ColorFieldProps {
  name: string;
  label: string;
  description?: string;
}

/**
 * Hex color input with a live swatch preview. Used for `keyColor` on
 * case studies (the row hover-fill color).
 */
export function ColorField({ name, label, description }: ColorFieldProps) {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext();
  const value = useWatch({ control, name });

  const error = name
    .split(".")
    .reduce<Record<string, unknown> | undefined>(
      (acc, key) =>
        acc && typeof acc === "object"
          ? (acc[key] as Record<string, unknown> | undefined)
          : undefined,
      errors as unknown as Record<string, unknown>,
    );
  const errorMessage =
    error && typeof error === "object" && "message" in error
      ? String((error as { message?: unknown }).message)
      : undefined;

  const swatchColor =
    typeof value === "string" && /^#[0-9a-f]{3,8}$/i.test(value)
      ? value
      : "transparent";

  return (
    <label className="flex flex-col gap-2">
      <span className="text-mono-s text-[color:var(--surface-graphite)]">
        {label}
      </span>
      {description ? (
        <span className="text-body text-[color:var(--surface-graphite)]">
          {description}
        </span>
      ) : null}
      <div className="flex items-stretch gap-3">
        <span
          aria-hidden
          className="block h-[48px] w-[48px] shrink-0 rounded-md border border-[color:color-mix(in_srgb,var(--surface-graphite)_35%,transparent)]"
          style={{ backgroundColor: swatchColor }}
        />
        <input
          type="text"
          placeholder="#1E2E3A"
          {...register(name)}
          className="flex-1 border border-[color:color-mix(in_srgb,var(--surface-graphite)_35%,transparent)] bg-transparent px-4 py-3 font-mono text-body text-[color:var(--surface-ink)] transition-colors duration-300 ease-[var(--ease-out-soft)] focus:border-[color:var(--surface-ink)] focus:outline-none"
        />
      </div>
      {errorMessage ? (
        <span className="text-mono-s text-[color:var(--surface-signal)]">
          {errorMessage}
        </span>
      ) : null}
    </label>
  );
}
