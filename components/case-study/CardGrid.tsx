import clsx from "clsx";

import type { CardGridSection } from "@/content/types";

const CHIP_TONE: Record<
  NonNullable<CardGridSection["cards"][number]["chip"]>["tone"],
  string
> = {
  pm: "bg-[#7C5BFF] text-white",
  design: "bg-[#3B82F6] text-white",
  engineer: "bg-[#111113] text-white",
  neutral:
    "bg-[color:color-mix(in_srgb,var(--surface-graphite)_30%,transparent)] text-[color:var(--surface-ink)]",
};

/**
 * 3-up illustrated card grid — the PM / Design / Engineer pattern from
 * the xiangyi case study, blended with this portfolio's hairline + paper
 * language. Each card is a light surface with a category chip in the
 * corner, holding a placeholder for an illustration that Phase 4 fills in.
 */
export function CardGrid({ section }: { section: CardGridSection }) {
  return (
    <div className="my-12 grid grid-cols-1 gap-6 md:grid-cols-3">
      {section.cards.map((card, i) => (
        <div
          key={i}
          className="relative flex flex-col gap-4 overflow-hidden rounded-2xl border border-[color:color-mix(in_srgb,var(--surface-graphite)_25%,transparent)] bg-[color:color-mix(in_srgb,var(--surface-paper)_60%,#ffffff_40%)] p-6"
        >
          {/* Illustration placeholder — drop a real svg here in Phase 4 */}
          <div
            aria-hidden
            className="aspect-square w-full rounded-xl"
            style={{
              backgroundColor:
                "color-mix(in srgb, var(--surface-graphite) 14%, transparent)",
            }}
          />
          <div className="flex flex-col gap-2">
            <h4 className="text-display-s text-[color:var(--surface-ink)]">
              {card.title}
            </h4>
            <p className="text-body text-[color:var(--surface-graphite)]">
              {card.body}
            </p>
          </div>
          {card.chip ? (
            <span
              className={clsx(
                "absolute right-4 top-4 inline-flex items-center rounded-full px-3 py-1 text-mono-s",
                CHIP_TONE[card.chip.tone],
              )}
            >
              {card.chip.label}
            </span>
          ) : null}
        </div>
      ))}
    </div>
  );
}
