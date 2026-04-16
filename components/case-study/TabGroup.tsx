"use client";

import { useState } from "react";
import clsx from "clsx";

import type { TabGroupSection } from "@/content/types";

/**
 * Pill-tab group switching between sub-views inside a chapter.
 * Each tab has an optional body line and an optional image (rendered as
 * a placeholder block in Phase 4 — real imagery later).
 */
export function TabGroup({ section }: { section: TabGroupSection }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = section.tabs[activeIndex];
  if (!active) return null;

  return (
    <div className="my-12 flex flex-col gap-8">
      <div className="flex flex-wrap items-center gap-3">
        {section.tabs.map((tab, i) => {
          const isActive = i === activeIndex;
          return (
            <button
              key={tab.label}
              type="button"
              onClick={() => setActiveIndex(i)}
              data-cursor="view"
              aria-pressed={isActive}
              className={clsx(
                "inline-flex items-center rounded-full border px-5 py-2 text-mono-s transition-colors duration-300 ease-[var(--ease-out-soft)]",
                isActive
                  ? "border-[color:var(--surface-ink)] bg-[color:var(--surface-ink)] text-[color:var(--surface-paper)]"
                  : "border-[color:color-mix(in_srgb,var(--surface-graphite)_45%,transparent)] text-[color:var(--surface-graphite)] hover:border-[color:var(--surface-ink)] hover:text-[color:var(--surface-ink)]",
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Active tab — placeholder mockup frame for Phase 4 imagery */}
      <figure className="flex flex-col gap-4">
        <div
          aria-label={active.image?.alt ?? active.label}
          className="aspect-[16/10] w-full rounded-2xl"
          style={{
            backgroundColor:
              "color-mix(in srgb, var(--surface-graphite) 22%, transparent)",
          }}
        />
        {active.body ? (
          <figcaption className="max-w-[60ch] text-body text-[color:var(--surface-graphite)]">
            {active.body}
          </figcaption>
        ) : null}
      </figure>
    </div>
  );
}
