"use client";

import { TextField } from "../fields/TextField";
import { TextareaField } from "../fields/TextareaField";

export function LockedSectionFields({ pathPrefix }: { pathPrefix: string }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-3">
          <TextField name={`${pathPrefix}.number`} label="NUMBER" />
        </div>
        <div className="col-span-9">
          <TextField name={`${pathPrefix}.title`} label="TITLE" />
        </div>
      </div>
      <TextareaField
        name={`${pathPrefix}.description`}
        label="DESCRIPTION"
        description="One sentence about what lives behind the lock — what the deck would walk through."
        rows={3}
      />
    </div>
  );
}
