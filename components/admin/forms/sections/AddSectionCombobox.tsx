"use client";

import { useState } from "react";
import clsx from "clsx";

import type { ChapterSection } from "@/content/types";
import { SECTION_KIND_META } from "./defaults";

interface AddSectionComboboxProps {
  onAdd: (kind: ChapterSection["kind"]) => void;
}

/**
 * "Add section" picker — opens a popover listing the 10 section kinds
 * with a one-line description each. Picking a kind calls `onAdd(kind)`,
 * which the parent uses to append a default-shaped section to the
 * chapter's sections list.
 */
export function AddSectionCombobox({ onAdd }: AddSectionComboboxProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((o) => !o)}
        aria-expanded={isOpen}
        className="inline-flex items-center border border-[color:var(--surface-ink)] px-4 py-3 text-mono-s text-[color:var(--surface-ink)] transition-opacity duration-300 ease-[var(--ease-out-soft)] hover:opacity-60"
      >
        + ADD SECTION
      </button>

      {isOpen ? (
        <>
          {/* Click-outside backdrop */}
          <button
            type="button"
            aria-label="Close"
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-40 cursor-default"
          />
          <ul
            className={clsx(
              "absolute left-0 top-full z-50 mt-2 flex max-h-[60vh] w-[420px] flex-col overflow-auto",
              "rounded-2xl border border-[color:color-mix(in_srgb,var(--surface-graphite)_35%,transparent)] bg-[color:var(--surface-paper)] shadow-lg",
            )}
          >
            {SECTION_KIND_META.map((meta) => (
              <li key={meta.kind}>
                <button
                  type="button"
                  onClick={() => {
                    onAdd(meta.kind);
                    setIsOpen(false);
                  }}
                  className="flex w-full flex-col items-start gap-1 border-b border-[color:color-mix(in_srgb,var(--surface-graphite)_15%,transparent)] px-5 py-4 text-left transition-colors duration-200 last:border-b-0 hover:bg-[color:color-mix(in_srgb,var(--surface-graphite)_8%,transparent)]"
                >
                  <span className="text-display-s italic text-[color:var(--surface-ink)]">
                    {meta.label}
                  </span>
                  <span className="text-mono-s text-[color:var(--surface-graphite)]">
                    {meta.description}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </div>
  );
}
