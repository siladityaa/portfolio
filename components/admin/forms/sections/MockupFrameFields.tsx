"use client";

import { PathField } from "../fields/PathField";
import { TextField } from "../fields/TextField";

export function MockupFrameFields({ pathPrefix }: { pathPrefix: string }) {
  return (
    <div className="flex flex-col gap-4">
      <PathField
        name={`${pathPrefix}.src`}
        label="IMAGE PATH"
        description="Path under /public, e.g. /work/sample/full-mock.jpg"
      />
      <TextField
        name={`${pathPrefix}.alt`}
        label="ALT TEXT"
        description="Required for accessibility — describe the image briefly."
      />
      <TextField
        name={`${pathPrefix}.caption`}
        label="CAPTION"
        description="Mono-s caption rendered below the frame (optional)."
      />
    </div>
  );
}
