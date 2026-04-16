"use client";

import { PathField } from "../fields/PathField";
import { TextField } from "../fields/TextField";

export function BeforeAfterFields({ pathPrefix }: { pathPrefix: string }) {
  return (
    <div className="flex flex-col gap-6">
      <fieldset className="flex flex-col gap-3">
        <legend className="text-mono-s text-[color:var(--surface-graphite)]">
          BEFORE
        </legend>
        <PathField name={`${pathPrefix}.before.src`} label="IMAGE PATH" />
        <TextField name={`${pathPrefix}.before.label`} label="LABEL" />
      </fieldset>
      <fieldset className="flex flex-col gap-3">
        <legend className="text-mono-s text-[color:var(--surface-graphite)]">
          AFTER
        </legend>
        <PathField name={`${pathPrefix}.after.src`} label="IMAGE PATH" />
        <TextField name={`${pathPrefix}.after.label`} label="LABEL" />
      </fieldset>
    </div>
  );
}
