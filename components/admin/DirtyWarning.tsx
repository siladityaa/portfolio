"use client";

import { useEffect } from "react";
import { useFormState } from "react-hook-form";

/**
 * Wires a `beforeunload` handler to the form's dirty state. Drop this
 * inside any FormProvider — it has no visual output. Prevents the user
 * from losing edits to a tab close, refresh, or accidental nav.
 *
 * RHF's `formState.isDirty` flips true once the user touches any field.
 * The handler is removed when the form unmounts or `isDirty` flips back
 * to false (e.g. after a successful save resets the form).
 */
export function DirtyWarning() {
  const { isDirty } = useFormState();

  useEffect(() => {
    if (!isDirty) return;

    function handleBeforeUnload(event: BeforeUnloadEvent) {
      event.preventDefault();
      // Modern browsers ignore the returnValue text, but the empty string
      // is still required to trigger the confirmation dialog.
      event.returnValue = "";
    }

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  return null;
}
