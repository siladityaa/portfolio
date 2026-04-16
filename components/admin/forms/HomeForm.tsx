"use client";

import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { homeContentSchema } from "@/content/schemas";
import type { HomeContent } from "@/content/types";

import { TextareaField } from "./fields/TextareaField";
import { TextField } from "./fields/TextField";
import { SaveButton } from "@/components/admin/SaveButton";
import { SaveStatus } from "@/components/admin/SaveStatus";
import { ConflictModal } from "@/components/admin/ConflictModal";
import { DirtyWarning } from "@/components/admin/DirtyWarning";
import { useSaveFlow } from "@/components/admin/useSaveFlow";
import { saveHome } from "@/app/(admin)/admin/actions";

interface HomeFormProps {
  defaultValues: HomeContent;
}

/**
 * Home page editor — two fields (hero sentence + mono subline).
 *
 * Wired in Step 4 to the `saveHome` server action, which commits
 * `content/home.json` to the GitHub repo's `cms-test` branch (Step 5
 * flips it to `main`). Save state machine lives in `useSaveFlow`.
 */
export function HomeForm({ defaultValues }: HomeFormProps) {
  const methods = useForm<HomeContent>({
    resolver: zodResolver(homeContentSchema),
    defaultValues,
    mode: "onChange",
  });

  const flow = useSaveFlow<HomeContent>({
    methods,
    action: saveHome,
  });

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(flow.onSubmit)}
        className="flex flex-col gap-10"
      >
        <DirtyWarning />

        <TextareaField
          name="hero.sentence"
          label="HERO SENTENCE"
          description="The single sentence that fills the home hero. Aim for ~15–20 words."
          rows={4}
        />

        <TextField
          name="hero.subline"
          label="MONO SUBLINE"
          description="The mono subline below the hero. Uppercase, separated by ·"
        />

        <div className="flex flex-wrap items-center gap-4 pt-4">
          <SaveButton status={flow.status} wired />
          <SaveStatus state={flow.inline} onSavedExpire={flow.onSavedExpire} />
        </div>
      </form>

      <ConflictModal
        open={flow.conflictOpen}
        message={flow.conflictMessage}
        onReload={flow.onConflictReload}
        onCancel={flow.onConflictCancel}
      />
    </FormProvider>
  );
}
