import { RequestAccessButton } from "@/components/shared/RequestAccessButton";
import type { LockedSectionSection } from "@/content/types";

/**
 * The portfolio's signature NDA treatment. Brief §6.
 *
 * Now lives inside a chapter body — the chapter's eyebrow + heading
 * already announce that this is a locked moment, so this card focuses
 * on the description + CTA without re-stating the chapter title.
 */
export function LockedSection({
  section,
  projectTitle,
}: {
  section: LockedSectionSection;
  projectTitle: string;
}) {
  return (
    <div
      data-cursor="request"
      className="my-12 flex flex-col gap-8 rounded-2xl border border-[color:color-mix(in_srgb,var(--surface-graphite)_35%,transparent)] p-[clamp(28px,5vw,64px)]"
    >
      <div className="flex items-start justify-between gap-6">
        <span className="text-mono-s text-[color:var(--surface-graphite)]">
          {section.number} · {section.title.toUpperCase()} · NDA
        </span>
        <span
          aria-hidden
          className="inline-flex h-4 w-4 items-center justify-center"
          style={{ color: "var(--surface-signal)" }}
        >
          <svg viewBox="0 0 16 16" fill="none" className="h-4 w-4">
            <rect
              x="3"
              y="7"
              width="10"
              height="7"
              stroke="currentColor"
              strokeWidth="1"
            />
            <path
              d="M5 7V5a3 3 0 0 1 6 0v2"
              stroke="currentColor"
              strokeWidth="1"
            />
          </svg>
        </span>
      </div>

      <p className="max-w-[55ch] text-body text-[color:var(--surface-graphite)]">
        {section.description}
      </p>

      <div>
        <RequestAccessButton projectTitle={projectTitle} variant="cta" />
      </div>
    </div>
  );
}
