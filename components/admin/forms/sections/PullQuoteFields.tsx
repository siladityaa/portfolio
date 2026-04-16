"use client";

import { TextareaField } from "../fields/TextareaField";
import { TextField } from "../fields/TextField";

export function PullQuoteFields({ pathPrefix }: { pathPrefix: string }) {
  return (
    <div className="flex flex-col gap-4">
      <TextareaField
        name={`${pathPrefix}.body`}
        label="QUOTE"
        description="The line itself. No quotation marks needed — they're added on render."
        rows={3}
      />
      <TextField
        name={`${pathPrefix}.attribution`}
        label="ATTRIBUTION"
        description="Who said it (optional)."
      />
    </div>
  );
}
