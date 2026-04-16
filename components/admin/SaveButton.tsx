"use client";

import { useFormState } from "react-hook-form";
import clsx from "clsx";

export type SaveStatus = "idle" | "saving" | "saved" | "error";

interface SaveButtonProps {
  /** Submit-button label in the idle state. */
  label?: string;
  /** Driven by the parent: form's current save state machine. */
  status: SaveStatus;
  /** Whether the save flow is wired yet (Step 4+). When false the
   *  button stays visually disabled with a tooltip explaining why. */
  wired?: boolean;
}

/**
 * Form save button with an idle / saving / saved / error state machine.
 *
 * Reads `formState.isSubmitting` and `formState.isValid` from RHF via
 * useFormState, plus an explicit `status` prop the parent updates after
 * the server action returns. The button is disabled while saving so a
 * single click can't double-fire.
 *
 * Step 3 ships with `wired=false`. Step 4 flips it on.
 */
export function SaveButton({
  label = "Save",
  status,
  wired = false,
}: SaveButtonProps) {
  const { isSubmitting, isValid, isDirty } = useFormState();

  const disabled = !wired || isSubmitting || status === "saving";

  let visibleLabel = label;
  if (status === "saving") visibleLabel = "Saving…";
  else if (status === "saved") visibleLabel = "Saved";
  else if (status === "error") visibleLabel = "Try again";

  return (
    <div className="flex items-center gap-4">
      <button
        type="submit"
        disabled={disabled}
        title={!wired ? "Save not wired yet (Step 4)" : undefined}
        className={clsx(
          "inline-flex items-center gap-2 border px-5 py-3 text-mono-s transition-colors duration-300 ease-[var(--ease-out-soft)]",
          disabled
            ? "cursor-not-allowed border-[color:color-mix(in_srgb,var(--surface-graphite)_35%,transparent)] text-[color:var(--surface-graphite)]"
            : "border-[color:var(--surface-ink)] bg-[color:var(--surface-ink)] text-[color:var(--surface-paper)] hover:opacity-90",
        )}
      >
        <span
          aria-hidden
          className={clsx(
            "inline-block h-[7px] w-[7px] rounded-full",
            status === "saving" || status === "saved"
              ? "bg-[color:var(--surface-signal)]"
              : "bg-current",
          )}
        />
        {visibleLabel.toUpperCase()}
      </button>
      {!wired ? (
        <span className="text-mono-s text-[color:var(--surface-graphite)]">
          STEP 4 WIRES SAVE · FORM IS LOCAL-STATE ONLY
        </span>
      ) : isDirty && status === "idle" ? (
        <span className="text-mono-s text-[color:var(--surface-graphite)]">
          UNSAVED CHANGES
        </span>
      ) : null}
      {/* Suppress the unused-var warning while keeping the import for Step 4. */}
      <span className="hidden">{String(isValid)}</span>
    </div>
  );
}
