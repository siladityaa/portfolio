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
  const [phase, setPhase] = useState<
    "idle" | "compressing" | "uploading" | "success"
  >("idle");
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
      const isImage = file.type.startsWith("image/");
      const isVideo = file.type.startsWith("video/");
      if (!isImage && !isVideo) {
        setUploadError("Only image or video files are allowed.");
        return;
      }
      // Hard cap. Vercel rejects any function body over 4.5MB; base64 adds
      // ~33% overhead, so even after compression the payload ceiling is
      // ~3MB raw. Images compress; videos can't (locally), so videos
      // larger than this need to be hosted elsewhere and pasted as a URL
      // in the manual field below.
      const HARD_CAP = 20 * 1024 * 1024;
      if (file.size > HARD_CAP) {
        setUploadError(
          isVideo
            ? "Video too big to upload directly (Vercel function body cap is 4.5MB). Host it elsewhere — Vercel Blob, Cloudinary, etc — and paste the URL in the field below."
            : "File must be under 20MB.",
        );
        return;
      }

      // Videos can't be compressed in the browser the way images can —
      // refuse upload if the raw file is over the body limit. The user
      // can still paste a hosted URL into the manual field below.
      if (isVideo && file.size > 3 * 1024 * 1024) {
        setUploadError(
          `Video is ${(file.size / 1024 / 1024).toFixed(1)}MB — over the 3MB direct-upload limit. Host it elsewhere (Vercel Blob, Cloudinary, etc) and paste the URL below.`,
        );
        return;
      }

      setUploadError(null);

      try {
        // Compress images > 2.5MB so they fit under Vercel's 4.5MB body
        // cap. Videos pass through untouched (already gated above).
        const willCompress = isImage && file.size > 2.5 * 1024 * 1024;
        setPhase(willCompress ? "compressing" : "uploading");
        const prepared = isImage
          ? await ensureUnder(file, 2.5 * 1024 * 1024)
          : file;
        setPhase("uploading");

        // Read the (possibly compressed) file as base64
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            const result = reader.result as string;
            const base64Data = result.split(",")[1];
            if (!base64Data) {
              reject(new Error("Failed to read file as base64."));
              return;
            }
            resolve(base64Data);
          };
          reader.onerror = () => reject(new Error("Failed to read file."));
          reader.readAsDataURL(prepared);
        });

        const sanitized = prepared.name
          .toLowerCase()
          .replace(/[^a-z0-9._-]/g, "-")
          .replace(/-+/g, "-");

        const destPath = `public/${uploadDir}/${sanitized}`;
        const result = await uploadImage(destPath, base64, prepared.name);

        if (result.status === "ok") {
          setValue(name, result.path, {
            shouldDirty: true,
            shouldValidate: true,
          });
          setLoadFailed(false);
          setPhase("success");
          // Linger on the success state briefly, then return to idle.
          setTimeout(() => setPhase("idle"), 1800);
        } else {
          setUploadError(result.message);
          setPhase("idle");
        }
      } catch (err) {
        setUploadError(
          err instanceof Error ? err.message : "Upload failed.",
        );
        setPhase("idle");
      }
    },
    [name, uploadDir, setValue],
  );

  const uploading = phase === "compressing" || phase === "uploading";

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
      <span className="text-label-s text-[color:var(--surface-graphite)]">
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
          if (uploading) return;
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={uploading ? undefined : onDrop}
        onClick={() => {
          if (uploading) return;
          fileInputRef.current?.click();
        }}
        className={`flex items-center gap-4 rounded-lg border-2 border-dashed p-4 transition-colors duration-200 ${
          uploading
            ? "cursor-progress border-[color:color-mix(in_srgb,var(--surface-graphite)_30%,transparent)]"
            : "cursor-pointer"
        } ${
          phase === "success"
            ? "border-[color:#22a560] bg-[color:color-mix(in_srgb,#22a560_8%,transparent)]"
            : dragOver
              ? "border-[color:var(--surface-signal)] bg-[color:color-mix(in_srgb,var(--surface-signal)_5%,transparent)]"
              : !uploading
                ? "border-[color:color-mix(in_srgb,var(--surface-graphite)_30%,transparent)] hover:border-[color:var(--surface-graphite)]"
                : ""
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
          ) : isVideoSrc(value) ? (
            <video
              src={value}
              autoPlay
              loop
              muted
              playsInline
              onLoadedData={() => setLoadFailed(false)}
              onError={() => setLoadFailed(true)}
              className="h-[56px] w-[80px] shrink-0 rounded-md border border-[color:color-mix(in_srgb,var(--surface-graphite)_35%,transparent)] object-cover"
            />
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
            className="flex h-[56px] w-[80px] shrink-0 items-center justify-center rounded-md border border-dashed border-[color:color-mix(in_srgb,var(--surface-graphite)_35%,transparent)] text-label-s text-[color:var(--surface-graphite)]"
          >
            MEDIA
          </span>
        )}

        {/* Upload status / prompt */}
        <div className="flex flex-1 flex-col gap-1">
          {phase === "compressing" && (
            <span className="flex items-center gap-2 text-label-s text-[color:var(--surface-ink)]">
              <Spinner /> COMPRESSING IMAGE…
            </span>
          )}
          {phase === "uploading" && (
            <span className="flex items-center gap-2 text-label-s text-[color:var(--surface-ink)]">
              <Spinner /> UPLOADING TO GITHUB…
            </span>
          )}
          {phase === "success" && (
            <span className="flex items-center gap-2 text-label-s text-[color:#22a560]">
              <CheckIcon /> UPLOADED
            </span>
          )}
          {phase === "idle" && (
            <>
              <span className="text-label-s text-[color:var(--surface-graphite)]">
                {showPreview ? "REPLACE — DROP OR CLICK" : "DROP MEDIA OR CLICK TO UPLOAD"}
              </span>
              <span className="text-[11px] text-[color:color-mix(in_srgb,var(--surface-graphite)_70%,transparent)]">
                Images: JPG, PNG, WebP, GIF (auto-compressed) · Video: MP4,
                WebM up to 3MB (or paste a hosted URL below)
              </span>
            </>
          )}
        </div>

        {/* Clear button — visible when there's a saved value, idle phase. */}
        {showPreview && phase === "idle" && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setValue(name, "", {
                shouldDirty: true,
                shouldValidate: true,
              });
              setLoadFailed(false);
              setUploadError(null);
            }}
            aria-label="Clear asset"
            className="shrink-0 self-start rounded-full border border-[color:color-mix(in_srgb,var(--surface-graphite)_30%,transparent)] px-3 py-1 text-label-s text-[color:var(--surface-graphite)] transition-colors duration-200 hover:border-[color:var(--surface-signal)] hover:text-[color:var(--surface-signal)]"
          >
            CLEAR
          </button>
        )}

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/mp4,video/webm,video/quicktime"
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
      <span className="text-[11px] text-[color:color-mix(in_srgb,var(--surface-graphite)_70%,transparent)]">
        Or paste any URL: a /work/... path for files in the repo, or an
        external URL (Vercel Blob, Cloudinary, S3, anything served over
        HTTPS) for files too big to commit.
      </span>

      {/* Error messages */}
      {uploadError ? (
        <span className="text-label-s text-[color:var(--surface-signal)]">
          {uploadError}
        </span>
      ) : null}
      {errorMessage ? (
        <span className="text-label-s text-[color:var(--surface-signal)]">
          {errorMessage}
        </span>
      ) : null}
    </label>
  );
}

function isVideoSrc(src: string): boolean {
  if (!src) return false;
  const lower = src.split("?")[0].toLowerCase();
  return /\.(mp4|webm|mov)$/.test(lower);
}

function Spinner() {
  return (
    <svg
      className="h-3 w-3 animate-spin"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden
    >
      <circle cx="8" cy="8" r="6" opacity="0.25" />
      <path d="M14 8 a6 6 0 0 0 -6 -6" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M3 8.5 L6.5 12 L13 4.5" />
    </svg>
  );
}

/**
 * Browser-side image compression. Returns the original file untouched if
 * it's already under `maxBytes`. Otherwise re-encodes to JPEG with
 * progressively lower quality, then scales the dimensions down if needed,
 * until it fits under the limit. Used to keep uploads under Vercel's
 * 4.5MB serverless-function body cap.
 *
 * GIFs and SVGs are passed through (canvas re-encode would lose animation
 * / rasterise vectors) — caller's job to ensure those are already small.
 */
async function ensureUnder(file: File, maxBytes: number): Promise<File> {
  if (file.size <= maxBytes) return file;
  if (file.type === "image/gif" || file.type === "image/svg+xml") return file;

  // Decode the source image. createImageBitmap handles JPEG/PNG/WebP.
  const bitmap = await createImageBitmap(file);

  // Try progressively lower JPEG quality at original dimensions first.
  let blob = await encode(bitmap, bitmap.width, bitmap.height, 0.85);
  for (const q of [0.75, 0.6, 0.45]) {
    if (blob.size <= maxBytes) break;
    blob = await encode(bitmap, bitmap.width, bitmap.height, q);
  }

  // If still too big, scale dimensions down. Solve for the linear scale
  // so pixel area shrinks roughly in proportion to the size overshoot.
  if (blob.size > maxBytes) {
    const ratio = Math.sqrt(maxBytes / blob.size) * 0.95;
    const w = Math.max(640, Math.floor(bitmap.width * ratio));
    const h = Math.max(640, Math.floor(bitmap.height * ratio));
    blob = await encode(bitmap, w, h, 0.7);
  }

  bitmap.close?.();

  const renamed = file.name.replace(/\.[^.]+$/, "") + ".jpg";
  return new File([blob], renamed, { type: "image/jpeg" });
}

async function encode(
  bitmap: ImageBitmap,
  width: number,
  height: number,
  quality: number,
): Promise<Blob> {
  // Prefer OffscreenCanvas (works in workers + main thread).
  const canvas =
    typeof OffscreenCanvas !== "undefined"
      ? new OffscreenCanvas(width, height)
      : Object.assign(document.createElement("canvas"), { width, height });
  const ctx = (canvas as HTMLCanvasElement | OffscreenCanvas).getContext("2d");
  if (!ctx) throw new Error("Couldn't get a 2D canvas context.");
  (ctx as CanvasRenderingContext2D).drawImage(bitmap, 0, 0, width, height);
  if (canvas instanceof OffscreenCanvas) {
    return canvas.convertToBlob({ type: "image/jpeg", quality });
  }
  return new Promise<Blob>((resolve, reject) => {
    (canvas as HTMLCanvasElement).toBlob(
      (b) => (b ? resolve(b) : reject(new Error("toBlob returned null"))),
      "image/jpeg",
      quality,
    );
  });
}
