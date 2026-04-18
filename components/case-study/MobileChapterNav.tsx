"use client";

import clsx from "clsx";
import { useEffect, useRef, useState } from "react";

import type { Chapter } from "@/content/types";
import { useActiveChapter } from "./ChapterSpy";

/**
 * Horizontal scrollable chapter nav for mobile/tablet (< 1280px).
 * Appears as a sticky bar below the hero once the user scrolls past it.
 * Hidden on desktop where the sidebar TOC serves the same purpose.
 *
 * Brief §5.14 — "scroll to top" affordance on long pages + tighter
 * vertical rhythm below 1280px.
 */
export function MobileChapterNav({ chapters }: { chapters: Chapter[] }) {
  const active = useActiveChapter();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [pastHero, setPastHero] = useState(false);

  /* Show the bar once the user scrolls past the hero section */
  useEffect(() => {
    function onScroll() {
      setPastHero(window.scrollY > window.innerHeight * 0.6);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Auto-scroll the active chapter into view in the strip */
  useEffect(() => {
    if (!scrollRef.current) return;
    const activeEl = scrollRef.current.querySelector("[data-active='true']");
    if (activeEl) {
      activeEl.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, [active]);

  function jumpTo(slug: string) {
    const el = document.getElementById(slug);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <nav
      aria-label="Chapter navigation"
      className={clsx(
        "sticky top-0 z-40 border-b border-[color:color-mix(in_srgb,var(--surface-graphite)_20%,transparent)] bg-[color:var(--surface-paper)] transition-all duration-300 ease-[var(--ease-out-soft)] xl:hidden",
        pastHero
          ? "translate-y-0 opacity-100"
          : "pointer-events-none -translate-y-full opacity-0",
      )}
    >
      <div
        ref={scrollRef}
        className="flex gap-1 overflow-x-auto overscroll-x-contain px-[clamp(20px,4vw,48px)] py-3 scrollbar-none"
      >
        {chapters.map((chapter) => {
          const isActive = chapter.slug === active;
          return (
            <button
              key={chapter.slug}
              type="button"
              onClick={() => jumpTo(chapter.slug)}
              data-active={isActive}
              className={clsx(
                "shrink-0 rounded-full px-4 py-1.5 text-mono-s transition-colors duration-200",
                isActive
                  ? "bg-[color:var(--surface-ink)] text-[color:var(--surface-paper)]"
                  : "text-[color:var(--surface-graphite)] hover:text-[color:var(--surface-ink)]",
              )}
            >
              {chapter.title}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
