import type { PullQuoteSection } from "@/content/types";

export function PullQuote({ section }: { section: PullQuoteSection }) {
  return (
    <blockquote className="my-12 max-w-[36ch]">
      <p className="text-display-m italic text-[color:var(--surface-ink)]">
        &ldquo;{section.body}&rdquo;
      </p>
      {section.attribution ? (
        <footer className="mt-6 text-mono-s text-[color:var(--surface-graphite)]">
          — {section.attribution.toUpperCase()}
        </footer>
      ) : null}
    </blockquote>
  );
}
