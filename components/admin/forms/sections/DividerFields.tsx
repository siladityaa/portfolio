"use client";

/**
 * Divider section has no fields. Just a marker so the renderer knows to
 * draw the •—• glyph between siblings.
 */
export function DividerFields() {
  return (
    <p className="text-body italic text-[color:var(--surface-graphite)]">
      No fields. Renders as a hairline + dot divider between sections.
    </p>
  );
}
