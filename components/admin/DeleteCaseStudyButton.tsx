"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { deleteCaseStudy } from "@/app/(admin)/admin/actions";

/**
 * Two-step confirm-then-delete button. First click reveals the confirmation
 * row with a "Yes, delete" + "Cancel" pair so the destructive action takes
 * intent. On success, navigates back to the case-study list.
 */
export function DeleteCaseStudyButton({
  slug,
  title,
}: {
  slug: string;
  title: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = () => {
    setError(null);
    startTransition(async () => {
      const res = await deleteCaseStudy(slug);
      if (res.status === "ok") {
        router.push("/admin/case-studies");
        router.refresh();
        return;
      }
      setError(res.message);
    });
  };

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="inline-flex items-center border border-[color:color-mix(in_srgb,var(--surface-signal)_60%,transparent)] px-3 py-2 text-label-s text-[color:var(--surface-signal)] transition-opacity duration-300 ease-[var(--ease-out-soft)] hover:opacity-60"
      >
        DELETE CASE STUDY
      </button>
    );
  }

  return (
    <div className="flex flex-col gap-3 rounded-[4px] border border-[color:color-mix(in_srgb,var(--surface-signal)_50%,transparent)] bg-[color:color-mix(in_srgb,var(--surface-signal)_8%,transparent)] p-4">
      <p className="text-body text-[color:var(--surface-ink)]">
        Permanently delete <strong>{title}</strong>? This will remove the
        JSON data file from the repo. Asset files in /public/work/{slug}/
        stay (delete them manually if desired).
      </p>
      {error && (
        <p className="text-label-s text-[color:var(--surface-signal)]">
          {error}
        </p>
      )}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleDelete}
          disabled={pending}
          className="inline-flex items-center bg-[color:var(--surface-signal)] px-3 py-2 text-label-s text-[color:var(--surface-paper)] transition-opacity duration-300 ease-[var(--ease-out-soft)] hover:opacity-80 disabled:opacity-40"
        >
          {pending ? "DELETING…" : "YES, DELETE"}
        </button>
        <button
          type="button"
          onClick={() => {
            setConfirming(false);
            setError(null);
          }}
          disabled={pending}
          className="inline-flex items-center border border-[color:var(--surface-ink)] px-3 py-2 text-label-s text-[color:var(--surface-ink)] transition-opacity duration-300 ease-[var(--ease-out-soft)] hover:opacity-60"
        >
          CANCEL
        </button>
      </div>
    </div>
  );
}
