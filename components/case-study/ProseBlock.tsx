import type { ProseBlockSection } from "@/content/types";

export function ProseBlock({ section }: { section: ProseBlockSection }) {
  return (
    <p className="my-8 max-w-[60ch] text-body text-[color:var(--surface-ink)]">
      {section.body}
    </p>
  );
}
