"use client";

import { TextareaField } from "../fields/TextareaField";

export function ProseBlockFields({ pathPrefix }: { pathPrefix: string }) {
  return (
    <div className="flex flex-col gap-4">
      <TextareaField
        name={`${pathPrefix}.body`}
        label="BODY"
        description="A paragraph of body copy. Use markdown-style **bold** for inline emphasis."
        rows={6}
      />
    </div>
  );
}
