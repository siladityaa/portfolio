"use client";

import { useEffect } from "react";

/**
 * Shown when the save server action returns `{ status: "conflict" }` —
 * i.e. GitHub rejected the PUT because the file SHA we loaded is stale.
 * That happens when the file was edited elsewhere (another tab, a git push,
 * another admin session) between loading the editor and hitting save.
 *
 * The only safe thing to do is reload the editor so the user re-opens the
 * latest version and re-applies their changes. "Merge" is not something we
 * want to invent — git already has that, and our forms don't have the right
 * shape for a three-way merge.
 *
 * Pressing ESC or clicking the backdrop cancels (same as "Keep editing").
 */
interface ConflictModalProps {
  open: boolean;
  message: string;
  onReload: () => void;
  onCancel: () => void;
}

export function ConflictModal({
  open,
  message,
  onReload,
  onCancel,
}: ConflictModalProps) {
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onCancel();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="conflict-modal-title"
      className="fixed inset-0 z-[var(--z-modal,100)] flex items-center justify-center"
    >
      <button
        type="button"
        aria-label="Close"
        onClick={onCancel}
        className="absolute inset-0 bg-[color:color-mix(in_srgb,var(--surface-ink)_60%,transparent)]"
      />
      <div className="relative mx-6 w-full max-w-[520px] border border-[color:var(--surface-ink)] bg-[color:var(--surface-paper)] p-[clamp(24px,3vw,40px)]">
        <span className="text-mono-s text-[color:var(--surface-graphite)]">
          CONFLICT
        </span>
        <h2
          id="conflict-modal-title"
          className="mt-3 text-display-s italic text-[color:var(--surface-ink)]"
        >
          This file changed on GitHub.
        </h2>
        <p className="mt-4 text-body text-[color:var(--surface-graphite)]">
          {message} Your in-progress edits are still in the form — reload to
          pull the latest file and re-apply your changes on top of it.
        </p>
        <div className="mt-8 flex items-center gap-3">
          <button
            type="button"
            onClick={onReload}
            className="inline-flex items-center border border-[color:var(--surface-ink)] bg-[color:var(--surface-ink)] px-4 py-3 text-mono-s text-[color:var(--surface-paper)] transition-opacity duration-300 ease-[var(--ease-out-soft)] hover:opacity-90"
          >
            RELOAD LATEST
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center border border-[color:var(--surface-ink)] px-4 py-3 text-mono-s text-[color:var(--surface-ink)] transition-opacity duration-300 ease-[var(--ease-out-soft)] hover:opacity-60"
          >
            KEEP EDITING
          </button>
        </div>
      </div>
    </div>
  );
}
