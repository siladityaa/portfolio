"use client";

import { useFormContext } from "react-hook-form";

interface TextFieldProps {
  name: string;
  label: string;
  placeholder?: string;
  description?: string;
  type?: "text" | "url" | "email";
  /** Render the input as read-only. Still submits its value, just can't be edited. */
  readOnly?: boolean;
}

/**
 * Single-line text input. Reads + writes via the parent FormProvider.
 * Errors from the Zod resolver render below the input.
 */
export function TextField({
  name,
  label,
  placeholder,
  description,
  type = "text",
  readOnly = false,
}: TextFieldProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  // Walk dot-paths in errors (e.g. "hero.src" → errors.hero?.src).
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
      <span className="text-label-s text-[color:var(--surface-graphite)]">
        {label}
      </span>
      {description ? (
        <span className="text-body text-[color:var(--surface-graphite)]">
          {description}
        </span>
      ) : null}
      <input
        type={type}
        placeholder={placeholder}
        readOnly={readOnly}
        {...register(name)}
        className={`w-full border border-[color:color-mix(in_srgb,var(--surface-graphite)_35%,transparent)] bg-transparent px-4 py-3 text-body text-[color:var(--surface-ink)] transition-colors duration-300 ease-[var(--ease-out-soft)] focus:border-[color:var(--surface-ink)] focus:outline-none ${
          readOnly
            ? "cursor-not-allowed bg-[color:color-mix(in_srgb,var(--surface-graphite)_8%,transparent)] opacity-70"
            : ""
        }`}
      />
      {errorMessage ? (
        <span className="text-label-s text-[color:var(--surface-signal)]">
          {errorMessage}
        </span>
      ) : null}
    </label>
  );
}
