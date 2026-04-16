import clsx from "clsx";

const CONTACT_EMAIL = "siladityaa@gmail.com"; // TODO(siladityaa): confirm canonical address

type Variant = "inline" | "cta" | "row-dot";

interface RequestAccessButtonProps {
  projectTitle: string;
  variant?: Variant;
  className?: string;
}

/**
 * Three visual forms of the same action (brief §5.3).
 * Phase 1: all three open a pre-filled `mailto:` because the contact backend
 * was scoped to mailto. When/if a form backend lands, swap the anchor for a
 * modal trigger in one place and all three variants update automatically.
 */
export function RequestAccessButton({
  projectTitle,
  variant = "cta",
  className,
}: RequestAccessButtonProps) {
  const subject = `Full case study — ${projectTitle}`;
  const body = `Hi Siladityaa,\n\nI saw "${projectTitle}" on your portfolio and would love to hear more.\n\n—\nName:\nCompany:\nRole:\nWhat caught your eye:\n`;
  const href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  if (variant === "row-dot") {
    return (
      <a
        href={href}
        data-cursor="request"
        aria-label={`Request full case study: ${projectTitle}`}
        className={clsx(
          "group inline-flex items-center gap-2 text-mono-s text-[color:var(--surface-graphite)]",
          className,
        )}
      >
        <span
          className="inline-block h-[7px] w-[7px] rounded-full"
          style={{ backgroundColor: "var(--surface-signal)" }}
        />
        <span className="transition-opacity duration-300 ease-[var(--ease-out-soft)] group-hover:opacity-100">
          REQUEST ACCESS
        </span>
      </a>
    );
  }

  if (variant === "inline") {
    return (
      <a
        href={href}
        data-cursor="request"
        className={clsx(
          "text-mono-s underline decoration-[color:var(--surface-signal)] decoration-2 underline-offset-4 text-[color:var(--surface-ink)]",
          className,
        )}
      >
        [● REQUEST ACCESS]
      </a>
    );
  }

  // CTA — the loudest variant, used at the end of case-study locked sections
  // and in the primary call-to-action slot.
  return (
    <a
      href={href}
      data-cursor="request"
      className={clsx(
        "inline-flex items-center gap-2 border border-[color:var(--surface-ink)] px-4 py-3 text-mono-s text-[color:var(--surface-ink)] transition-colors duration-300 ease-[var(--ease-out-soft)] hover:bg-[color:var(--surface-ink)] hover:text-[color:var(--surface-paper)]",
        className,
      )}
    >
      <span
        className="inline-block h-[7px] w-[7px] rounded-full"
        style={{ backgroundColor: "var(--surface-signal)" }}
      />
      REQUEST FULL CASE STUDY ↗
    </a>
  );
}
