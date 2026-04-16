"use client";

import { useCallback, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { UseFormReturn, FieldValues } from "react-hook-form";

import type { SaveResult } from "@/app/(admin)/admin/actions";
import type { SaveStatus } from "./SaveButton";
import type { InlineStatus } from "./SaveStatus";

/**
 * Shared save state machine for every admin form.
 *
 * The four forms (Home, About, Now, CaseStudy) all have the same lifecycle:
 *
 *   idle → saving → (saved | conflict | error) → idle
 *
 * They differ only in:
 *   1. which server action they call (passed in as `action`)
 *   2. what they pass as the payload (RHF form values)
 *
 * This hook takes care of:
 *   - wrapping the action in a transition so the button disables
 *   - setting the SaveButton status for the button's visual state
 *   - setting the SaveStatus inline toast state
 *   - opening the ConflictModal on a 409
 *   - calling `reset(values)` on the RHF form after a successful save so
 *     `formState.isDirty` flips back to false and DirtyWarning stands down
 *   - router.refresh() after save so the admin list views re-read from
 *     disk in local dev (the admin pages read files via server loaders)
 */
export interface UseSaveFlowArgs<TValues extends FieldValues> {
  methods: UseFormReturn<TValues>;
  action: (values: TValues) => Promise<SaveResult>;
}

export interface UseSaveFlowReturn<TValues extends FieldValues> {
  status: SaveStatus;
  inline: InlineStatus;
  conflictOpen: boolean;
  conflictMessage: string;
  onSubmit: (values: TValues) => Promise<void>;
  onConflictReload: () => void;
  onConflictCancel: () => void;
  onSavedExpire: () => void;
}

export function useSaveFlow<TValues extends FieldValues>({
  methods,
  action,
}: UseSaveFlowArgs<TValues>): UseSaveFlowReturn<TValues> {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<SaveStatus>("idle");
  const [inline, setInline] = useState<InlineStatus>({ kind: "idle" });
  const [conflictOpen, setConflictOpen] = useState(false);
  const [conflictMessage, setConflictMessage] = useState("");

  const onSubmit = useCallback(
    async (values: TValues) => {
      setStatus("saving");
      setInline({ kind: "saving" });
      startTransition(async () => {
        const result = await action(values);
        if (result.status === "ok") {
          setStatus("saved");
          setInline({ kind: "saved", commitSha: result.commitSha });
          // Reset the form baseline to the just-saved values so isDirty
          // goes back to false and DirtyWarning stops firing beforeunload.
          methods.reset(values);
          router.refresh();
          return;
        }
        if (result.status === "conflict") {
          setStatus("error");
          setInline({ kind: "idle" });
          setConflictMessage(result.message);
          setConflictOpen(true);
          return;
        }
        // Both "invalid" and "error" land here — both are unrecoverable
        // without the user editing something, so show the message inline.
        setStatus("error");
        setInline({ kind: "error", message: result.message });
      });
    },
    [action, methods, router],
  );

  const onConflictReload = useCallback(() => {
    setConflictOpen(false);
    setStatus("idle");
    router.refresh();
  }, [router]);

  const onConflictCancel = useCallback(() => {
    setConflictOpen(false);
    setStatus("idle");
  }, []);

  const onSavedExpire = useCallback(() => {
    setStatus("idle");
    setInline({ kind: "idle" });
  }, []);

  // Suppress the unused var warning — isPending is reserved for future UX.
  void isPending;

  return {
    status,
    inline,
    conflictOpen,
    conflictMessage,
    onSubmit,
    onConflictReload,
    onConflictCancel,
    onSavedExpire,
  };
}
