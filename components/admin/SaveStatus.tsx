"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";

/**
 * Transient inline status line shown next to the Save button after a save
 * completes. Fades out on its own after a few seconds so it doesn't clutter
 * the editor. The parent form drives `state` via the server-action return
 * value — this component just renders it.
 *
 * Copy rules:
 *   - `saved`:    "SAVED · LIVE IN ~60s"  (Vercel rebuild from cms-test branch)
 *   - `conflict`: shown as a modal, not here (see ConflictModal.tsx)
 *   - `invalid`:  shouldn't happen — client-side Zod should catch first
 *   - `error`:    red signal, shows the server-returned message verbatim
 */
export type InlineStatus =
  | { kind: "idle" }
  | { kind: "saving" }
  | { kind: "saved"; commitSha?: string }
  | { kind: "error"; message: string };

interface SaveStatusProps {
  state: InlineStatus;
  /** Called after the saved state auto-fades, so the parent can reset. */
  onSavedExpire?: () => void;
}

export function SaveStatus({ state, onSavedExpire }: SaveStatusProps) {
  const [visible, setVisible] = useState(state.kind !== "idle");

  useEffect(() => {
    if (state.kind === "idle") {
      setVisible(false);
      return;
    }
    setVisible(true);
    if (state.kind !== "saved") return;
    // Auto-fade the saved confirmation after 6s so the editor goes quiet again.
    const timer = window.setTimeout(() => {
      setVisible(false);
      onSavedExpire?.();
    }, 6000);
    return () => window.clearTimeout(timer);
  }, [state, onSavedExpire]);

  if (state.kind === "idle" || !visible) return null;

  if (state.kind === "saving") {
    return (
      <span className="text-mono-s text-[color:var(--surface-graphite)]">
        SAVING TO GITHUB…
      </span>
    );
  }

  if (state.kind === "saved") {
    return (
      <span className="flex items-center gap-2 text-mono-s text-[color:var(--surface-graphite)]">
        <span
          aria-hidden
          className="inline-block h-[7px] w-[7px] rounded-full bg-[color:var(--surface-signal)]"
        />
        SAVED · LIVE IN ~60s
        {state.commitSha ? (
          <span className="opacity-60">· {state.commitSha.slice(0, 7)}</span>
        ) : null}
      </span>
    );
  }

  return (
    <span
      className={clsx(
        "flex items-center gap-2 text-mono-s",
        "text-[color:var(--surface-signal)]",
      )}
    >
      <span
        aria-hidden
        className="inline-block h-[7px] w-[7px] rounded-full bg-[color:var(--surface-signal)]"
      />
      {state.message.toUpperCase()}
    </span>
  );
}
