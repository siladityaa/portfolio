"use client";

import clsx from "clsx";

import type { Chapter } from "@/content/types";
import { useActiveChapter } from "./ChapterSpy";

/**
 * Sticky left-rail TOC. Sits in the `toc` column of the case-study CSS grid.
 * Inactive chapters are dim graphite at body size; the active chapter
 * brightens to ink and lifts to display-s. Click jumps via smooth scroll.
 */
export function CaseStudyTOC({ chapters }: { chapters: Chapter[] }) {
  const active = useActiveChapter();

  function jumpTo(slug: string) {
    const el = document.getElementById(slug);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <nav
      aria-label="Case study contents"
      className="sticky top-[40vh] flex -translate-y-1/2 flex-col gap-3"
    >
      {chapters.map((chapter) => {
        const isActive = chapter.slug === active;
        return (
          <button
            key={chapter.slug}
            type="button"
            onClick={() => jumpTo(chapter.slug)}
            data-cursor="view"
            className={clsx(
              "group block max-w-[180px] text-left transition-colors duration-500 ease-[var(--ease-out-soft)]",
              isActive
                ? "text-[color:var(--surface-ink)]"
                : "text-[color:color-mix(in_srgb,var(--surface-graphite)_65%,transparent)] hover:text-[color:var(--surface-graphite)]",
            )}
          >
            <span
              className={clsx(
                "italic transition-all duration-500 ease-[var(--ease-out-soft)]",
                isActive ? "text-display-s" : "text-body",
              )}
              style={{ fontFamily: "var(--font-display)" }}
            >
              {chapter.title}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
