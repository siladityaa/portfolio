"use client";

import { useCallback, useRef, useState } from "react";
import { useWatch, useFormContext } from "react-hook-form";

import { uploadImage } from "@/app/(admin)/admin/actions";

interface ImageUploadFieldProps {
  name: string;
  label: string;
  /** Repo sub-directory under `public/` for this upload, e.g. `work/ambient-ai` */
  uploadDir: string;
  description?: string;
  placeholder?: string;
}

/**
 * Image path field with drag-and-drop / click-to-pick upload.
 *
 * Phase 6.5 full — replaces the manual-path-only `PathField` for image
 * fields. Dropped or picked files are uploaded to GitHub via the
 * `uploadImage` server action, then the returned public path is written
 * back into the form field.
 *
 * Keeps the manual text input as a fallback for paths that already exist.
 */
export function ImageUploadField({
  name,
  label,
  uploadDir,
  description,
  placeholder = "/work/slug/image.jpg",
}: ImageUploadFieldProps) {
  const {
    register,
    control,
    setValue,
    formState: { errors },
  } = useFormContext();
  const value = useWatch({ control, name });
  const [loadFailed, setLoadFailed] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleFile = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/")) {
        setUploadError("Only image files are allowed.");
        return;
      }
      // Max 10MB
      if (file.size > 10 * 1024 * 1024) {
        setUploadError("File must be under 10MB.");
        return;
      }

      setUploading(true);
      setUploadError(null);

      try {
        // Read file as base64
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            const result = reader.result as string;
            // Strip the data-URI prefix: "data:image/png;base64,..."
            const base64Data = result.split(",")[1];
            if (!base64Data) {
              reject(new Error("Failed to read file as base64."));
              return;
            }
            resolve(base64Data);
          };
          reader.onerror = () => reject(new Error("Failed to read file."));
          reader.readAsDataURL(file);
        });

        // Sanitize filename
        const sanitized = file.name
          .toLowerCase()
          .replace(/[^a-z0-9._-]/g, "-")
          .replace(/-+/g, "-");

        const destPath = `public/${uploadDir}/${sanitized}`;
        const result = await uploadImage(destPath, base64, file.name);

        if (result.status === "ok") {
          setValue(name, result.path, {
            shouldDirty: true,
            shouldValidate: true,
          });
          setLoadFailed(false);
        } else {
          setUploadError(result.message);
        }
      } catch (err) {
        setUploadError(
          err instanceof Error ? err.message : "Upload failed.",
        );
      } finally {
        setUploading(false);
      }
    },
    [name, uploadDir, setValue],
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  const onFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
      // Reset input so same file can be re-selected
      e.target.value = "";
    },
    [handleFile],
  );

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

      {/* Drop zone + preview */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`flex cursor-pointer items-center gap-4 rounded-lg border-2 border-dashed p-4 transition-colors duration-200 ${
          dragOver
            ? "border-[color:var(--surface-signal)] bg-[color:color-mix(in_srgb,var(--surface-signal)_5%,transparent)]"
            : "border-[color:color-mix(in_srgb,var(--surface-graphite)_30%,transparent)] hover:border-[color:var(--surface-graphite)]"
        }`}
      >
        {/* Thumbnail */}
        {showPreview ? (
          loadFailed ? (
            <span
              aria-hidden
              className="flex h-[56px] w-[80px] shrink-0 items-center justify-center rounded-md border border-[color:var(--surface-signal)] text-[10px] uppercase text-[color:var(--surface-signal)]"
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
              className="h-[56px] w-[80px] shrink-0 rounded-md border border-[color:color-mix(in_srgb,var(--surface-graphite)_35%,transparent)] object-cover"
            />
          )
        ) : (
          <span
            aria-hidden
            className="flex h-[56px] w-[80px] shrink-0 items-center justify-center rounded-md border border-dashed border-[color:color-mix(in_srgb,var(--surface-graphite)_35%,transparent)] text-mono-s text-[color:var(--surface-graphite)]"
          >
            IMG
          </span>
        )}

        {/* Upload status / prompt */}
        <div className="flex flex-1 flex-col gap-1">
          {uploading ? (
            <span className="text-mono-s text-[color:var(--surface-graphite)]">
              UPLOADING...
            </span>
          ) : (
            <>
              <span className="text-mono-s text-[color:var(--surface-graphite)]">
                DROP IMAGE OR CLICK TO UPLOAD
              </span>
              <span className="text-[11px] text-[color:color-mix(in_srgb,var(--surface-graphite)_70%,transparent)]">
                JPG, PNG, WebP — max 10MB
              </span>
            </>
          )}
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={onFileChange}
          className="hidden"
          onClick={(e) => e.stopPropagation()}
        />
      </div>

      {/* Manual path input (fallback) */}
      <input
        type="text"
        placeholder={placeholder}
        {...register(name, {
          onChange: () => setLoadFailed(false),
        })}
        className="border border-[color:color-mix(in_srgb,var(--surface-graphite)_35%,transparent)] bg-transparent px-4 py-3 font-mono text-body text-[color:var(--surface-ink)] transition-colors duration-300 ease-[var(--ease-out-soft)] focus:border-[color:var(--surface-ink)] focus:outline-none"
      />

      {/* Error messages */}
      {uploadError ? (
        <span className="text-mono-s text-[color:var(--surface-signal)]">
          {uploadError}
        </span>
      ) : null}
      {errorMessage ? (
        <span className="text-mono-s text-[color:var(--surface-signal)]">
          {errorMessage}
        </span>
      ) : null}
    </label>
  );
}
