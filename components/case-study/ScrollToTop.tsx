"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

/**
 * Floating "scroll to top" button that appears on mobile after scrolling
 * past 2 viewports. Hidden on desktop (≥1280px) where the sticky TOC
 * provides navigation. Uses the same mono-s + graphite treatment as other
 * chrome elements.
 */
export function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > window.innerHeight * 2);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function scrollUp() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          onClick={scrollUp}
          type="button"
          aria-label="Scroll to top"
          data-cursor="view"
          className="fixed bottom-[clamp(80px,12vh,120px)] right-[clamp(24px,4vw,64px)] z-50 flex h-10 w-10 items-center justify-center rounded-full border border-[color:color-mix(in_srgb,var(--surface-graphite)_30%,transparent)] bg-[color:var(--surface-paper)] shadow-sm xl:hidden"
        >
          <span className="text-mono-s text-[color:var(--surface-ink)]">
            ↑
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
