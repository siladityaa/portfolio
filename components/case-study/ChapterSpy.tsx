"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

/**
 * Tracks which chapter section is currently active in the viewport so
 * the sticky TOC and ruler can both highlight it. Lifted into Context so
 * the two consumer components (CaseStudyTOC, ScrollRuler) can sit in
 * different CSS-grid cells without duplicating an IntersectionObserver.
 */

const ActiveChapterContext = createContext<string>("");

export function useActiveChapter() {
  return useContext(ActiveChapterContext);
}

export function ChapterSpy({
  chapterSlugs,
  children,
}: {
  chapterSlugs: string[];
  children: ReactNode;
}) {
  const [active, setActive] = useState<string>(chapterSlugs[0] ?? "");

  // Re-run if the chapter list changes between case studies.
  const slugKey = chapterSlugs.join("|");

  useEffect(() => {
    const targets = chapterSlugs
      .map((slug) => document.getElementById(slug))
      .filter((el): el is HTMLElement => el !== null);
    if (targets.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length === 0) return;
        // Pick the chapter whose top edge is closest to the trigger band.
        visible.sort(
          (a, b) =>
            Math.abs(a.boundingClientRect.top) -
            Math.abs(b.boundingClientRect.top),
        );
        const top = visible[0]?.target as HTMLElement | undefined;
        if (top?.id) setActive(top.id);
      },
      {
        // Trigger band is the upper third of the viewport.
        rootMargin: "-25% 0px -55% 0px",
        threshold: 0,
      },
    );

    for (const target of targets) observer.observe(target);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slugKey]);

  return (
    <ActiveChapterContext.Provider value={active}>
      {children}
    </ActiveChapterContext.Provider>
  );
}
