"use client";

import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { aboutContentSchema } from "@/content/schemas";
import type { AboutContent } from "@/content/types";

import { TextareaField } from "./fields/TextareaField";
import { SaveButton } from "@/components/admin/SaveButton";
import { SaveStatus } from "@/components/admin/SaveStatus";
import { ConflictModal } from "@/components/admin/ConflictModal";
import { DirtyWarning } from "@/components/admin/DirtyWarning";
import { useSaveFlow } from "@/components/admin/useSaveFlow";
import { saveAbout } from "@/app/(admin)/admin/actions";

interface AboutFormProps {
  defaultValues: AboutContent;
}

/**
 * About page editor — three text areas: pulled quote + personal +
 * professional bio. Wired in Step 4 to the `saveAbout` server action.
 *
 * Note: `/about` also reads `content/timeline.json` and
 * `content/influences.json`. Those get their own editors as a Phase 6.5
 * follow-on (or piled into this form once the basic v1 ships).
 */
export function AboutForm({ defaultValues }: AboutFormProps) {
  const methods = useForm<AboutContent>({
    resolver: zodResolver(aboutContentSchema),
    defaultValues,
    mode: "onChange",
  });

  const flow = useSaveFlow<AboutContent>({
    methods,
    action: saveAbout,
  });

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(flow.onSubmit)}
        className="flex flex-col gap-12"
      >
        <DirtyWarning />

        <TextareaField
          name="pulledQuote"
          label="PULLED QUOTE"
          description="The single line in display-xl at the top of /about. Centered, no quotation marks. Reads as your own voice."
          rows={3}
        />

        <TextareaField
          name="bio.personal"
          label="PERSONAL BIO"
          description="The left column of the bio block. ~60 words in your own voice."
          rows={6}
        />

        <TextareaField
          name="bio.professional"
          label="PROFESSIONAL BIO"
          description="The right column. Sourced from LinkedIn — tweak as needed."
          rows={6}
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
