"use client";

import clsx from "clsx";

import type { Chapter } from "@/content/types";
import { useActiveChapter } from "./ChapterSpy";

/**
 * Sticky right-rail ruler. One tick per chapter. Active tick is wider
 * and brighter. Clicking a tick jumps to that chapter.
 *
 * Reads as a hardware spec ruler — the brief's "every UI chrome element
 * looks like it was labeled by an engineer" applied literally.
 */
export function ScrollRuler({ chapters }: { chapters: Chapter[] }) {
  const active = useActiveChapter();

  function jumpTo(slug: string) {
    const el = document.getElementById(slug);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div
      aria-hidden
      className="sticky top-[40vh] flex -translate-y-1/2 flex-col items-end gap-4"
    >
      {chapters.map((chapter) => {
        const isActive = chapter.slug === active;
        return (
          <button
            key={chapter.slug}
            type="button"
            onClick={() => jumpTo(chapter.slug)}
            data-cursor="view"
            aria-label={`Jump to ${chapter.title}`}
            className="group flex h-6 items-center"
          >
            <span
              className={clsx(
                "block h-px transition-all duration-500 ease-[var(--ease-out-soft)]",
                isActive
                  ? "w-12 bg-[color:var(--surface-ink)]"
                  : "w-6 bg-[color:color-mix(in_srgb,var(--surface-graphite)_50%,transparent)] group-hover:w-9",
              )}
            />
          </button>
        );
      })}
    </div>
  );
}
