"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { useActiveChapter } from "./ChapterSpy";
import type { Chapter } from "@/content/types";

/**
 * Brief §5.7 — Sticky-collapse eyebrow.
 *
 * When the user scrolls past the hero, the active chapter title compacts
 * into a small fixed pill at the top-center of the viewport. Stays out of
 * the way of Wordmark (top-left) and NavLinks (top-right).
 *
 * Hidden on mobile where the MobileChapterNav strip already serves this
 * purpose.
 */
export function StickyChapterPill({ chapters }: { chapters: Chapter[] }) {
  const active = useActiveChapter();
  const [pastHero, setPastHero] = useState(false);

  useEffect(() => {
    function onScroll() {
      setPastHero(window.scrollY > window.innerHeight * 0.7);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const activeChapter = chapters.find((c) => c.slug === active);

  return (
    <AnimatePresence>
      {pastHero && activeChapter && (
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="fixed left-1/2 top-[clamp(24px,4vw,64px)] z-40 hidden -translate-x-1/2 xl:block"
        >
          <button
            type="button"
            onClick={() => {
              const el = document.getElementById(activeChapter.slug);
              el?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
            data-cursor="view"
            className="flex items-center gap-2 rounded-full border border-[color:color-mix(in_srgb,var(--surface-graphite)_25%,transparent)] bg-[color:color-mix(in_srgb,var(--surface-paper)_90%,transparent)] px-4 py-2 shadow-sm backdrop-blur-md transition-colors duration-300 ease-[var(--ease-out-soft)] hover:border-[color:var(--surface-graphite)]"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--surface-signal)]" />
            <span className="text-mono-s text-[color:var(--surface-ink)]">
              {activeChapter.title}
            </span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
