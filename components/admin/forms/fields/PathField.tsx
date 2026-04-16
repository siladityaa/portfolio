"use client";

import { useState } from "react";
import { useWatch, useFormContext } from "react-hook-form";

interface PathFieldProps {
  name: string;
  label: string;
  description?: string;
  placeholder?: string;
}

/**
 * Image-path text input with an inline `<img>` preview. The preview
 * loads the path from `/public` (paths starting with `/work/...`) and
 * shows a 4xx state if the file is missing — cheap visual validation
 * since v1 doesn't include image upload.
 *
 * Phase 5 polish item: replace this with a proper image upload field
 * that pushes to /public/work/[slug]/ via the GitHub API.
 */
export function PathField({
  name,
  label,
  description,
  placeholder = "/work/slug/image.jpg",
}: PathFieldProps) {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext();
  const value = useWatch({ control, name });
  const [loadFailed, setLoadFailed] = useState(false);

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

  const showPreview = typeof value === "string" && value.length > 0;

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
        {showPreview ? (
          loadFailed ? (
            <span
              aria-hidden
              className="flex h-[48px] w-[64px] shrink-0 items-center justify-center rounded-md border border-[color:var(--surface-signal)] text-[10px] uppercase text-[color:var(--surface-signal)]"
            >
              404
            </span>
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={value}
              alt=""
              onLoad={() => setLoadFailed(false)}
              onError={() => setLoadFailed(true)}
              className="h-[48px] w-[64px] shrink-0 rounded-md border border-[color:color-mix(in_srgb,var(--surface-graphite)_35%,transparent)] object-cover"
            />
          )
        ) : (
          <span
            aria-hidden
            className="block h-[48px] w-[64px] shrink-0 rounded-md border border-dashed border-[color:color-mix(in_srgb,var(--surface-graphite)_35%,transparent)]"
          />
        )}
        <input
          type="text"
          placeholder={placeholder}
          {...register(name, {
            onChange: () => setLoadFailed(false),
          })}
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
