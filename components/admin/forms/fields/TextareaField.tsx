"use client";

import { useFormContext } from "react-hook-form";

interface TextareaFieldProps {
  name: string;
  label: string;
  placeholder?: string;
  description?: string;
  rows?: number;
}

/**
 * Multi-line text input. Used for prose blocks, brief, bio paragraphs,
 * pull quotes, and any other long-form copy.
 */
export function TextareaField({
  name,
  label,
  placeholder,
  description,
  rows = 4,
}: TextareaFieldProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

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
      <textarea
        rows={rows}
        placeholder={placeholder}
        {...register(name)}
        className="w-full resize-y border border-[color:color-mix(in_srgb,var(--surface-graphite)_35%,transparent)] bg-transparent px-4 py-3 text-body text-[color:var(--surface-ink)] transition-colors duration-300 ease-[var(--ease-out-soft)] focus:border-[color:var(--surface-ink)] focus:outline-none"
      />
      {errorMessage ? (
        <span className="text-mono-s text-[color:var(--surface-signal)]">
          {errorMessage}
        </span>
      ) : null}
    </label>
  );
}
