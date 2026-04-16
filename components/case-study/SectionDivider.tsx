/**
 * The •—• section-divider glyph from brief §2.4.
 * Sits between sections inside a chapter body — quiet pause, not a hard break.
 */
export function SectionDivider() {
  return (
    <div className="my-12 flex items-center justify-center gap-3" aria-hidden>
      <span className="block h-px w-16 bg-[color:color-mix(in_srgb,var(--surface-graphite)_35%,transparent)]" />
      <span className="block h-1 w-1 rounded-full bg-[color:var(--surface-graphite)]" />
      <span className="block h-px w-16 bg-[color:color-mix(in_srgb,var(--surface-graphite)_35%,transparent)]" />
    </div>
  );
}
