"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface PaletteItem {
  label: string;
  /** Mono-s secondary text */
  hint: string;
  href: string;
  external?: boolean;
}

/* ------------------------------------------------------------------ */
/*  Static items — no server data needed                               */
/* ------------------------------------------------------------------ */

const PAGES: PaletteItem[] = [
  { label: "Home", hint: "/", href: "/" },
  { label: "About", hint: "/about", href: "/about" },
  { label: "Colophon", hint: "/colophon", href: "/colophon" },
  {
    label: "Resume",
    hint: "resume.siladityaa.com",
    href: "https://resume.siladityaa.com",
    external: true,
  },
];

const PROJECTS: PaletteItem[] = [
  { label: "Ambient AI", hint: "/work/ambient-ai", href: "/work/ambient-ai" },
  {
    label: "Sensor Feedback",
    hint: "/work/sensor-feedback",
    href: "/work/sensor-feedback",
  },
  {
    label: "Tactile CLI",
    hint: "/work/tactile-cli",
    href: "/work/tactile-cli",
  },
  {
    label: "Field Notes",
    hint: "/work/field-notes",
    href: "/work/field-notes",
  },
  {
    label: "Sample Project",
    hint: "/work/sample-project",
    href: "/work/sample-project",
  },
];

const ALL_ITEMS = [...PAGES, ...PROJECTS];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  /* Filtered results */
  const results = useMemo(() => {
    if (!query.trim()) return ALL_ITEMS;
    const q = query.toLowerCase();
    return ALL_ITEMS.filter(
      (item) =>
        item.label.toLowerCase().includes(q) ||
        item.hint.toLowerCase().includes(q),
    );
  }, [query]);

  /* Keep selectedIndex in bounds */
  useEffect(() => {
    setSelectedIndex(0);
  }, [results.length]);

  /* Navigate to an item */
  const go = useCallback(
    (item: PaletteItem) => {
      setOpen(false);
      setQuery("");
      if (item.external) {
        window.open(item.href, "_blank", "noopener,noreferrer");
      } else {
        router.push(item.href);
      }
    },
    [router],
  );

  /* ⌘K / Ctrl-K toggle */
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setOpen(false);
        setQuery("");
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  /* Auto-focus input on open */
  useEffect(() => {
    if (open) {
      // Small delay for the animation to start
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  /* Keyboard nav inside the palette */
  function handleInputKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, results.length - 1));
      scrollSelectedIntoView(selectedIndex + 1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
      scrollSelectedIntoView(selectedIndex - 1);
    } else if (e.key === "Enter" && results[selectedIndex]) {
      e.preventDefault();
      go(results[selectedIndex]);
    }
  }

  function scrollSelectedIntoView(index: number) {
    requestAnimationFrame(() => {
      const el = listRef.current?.children[index] as HTMLElement | undefined;
      el?.scrollIntoView({ block: "nearest" });
    });
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={() => {
              setOpen(false);
              setQuery("");
            }}
            className="fixed inset-0 z-[999] bg-[color:color-mix(in_srgb,var(--surface-ink)_50%,transparent)] backdrop-blur-sm"
          />

          {/* Palette */}
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="fixed left-1/2 top-[min(20vh,180px)] z-[1000] w-[min(520px,calc(100vw-48px))] -translate-x-1/2 overflow-hidden rounded-xl border border-[color:color-mix(in_srgb,var(--surface-graphite)_25%,transparent)] bg-[color:var(--surface-paper)] shadow-2xl"
          >
            {/* Search input */}
            <div className="flex items-center gap-3 border-b border-[color:color-mix(in_srgb,var(--surface-graphite)_25%,transparent)] px-5 py-4">
              <span className="text-mono-s text-[color:var(--surface-graphite)]">
                {">"}
              </span>
              <input
                ref={inputRef}
                type="text"
                placeholder="Navigate to..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleInputKeyDown}
                className="flex-1 bg-transparent text-body text-[color:var(--surface-ink)] outline-none placeholder:text-[color:var(--surface-graphite)]"
              />
              <kbd className="rounded border border-[color:color-mix(in_srgb,var(--surface-graphite)_30%,transparent)] px-1.5 py-0.5 text-mono-s text-[color:var(--surface-graphite)]">
                ESC
              </kbd>
            </div>

            {/* Results list */}
            <div
              ref={listRef}
              className="max-h-[320px] overflow-y-auto overscroll-contain py-2"
            >
              {results.length === 0 ? (
                <div className="px-5 py-6 text-center text-mono-s text-[color:var(--surface-graphite)]">
                  NO RESULTS
                </div>
              ) : (
                results.map((item, i) => (
                  <button
                    key={item.href}
                    type="button"
                    onClick={() => go(item)}
                    onMouseEnter={() => setSelectedIndex(i)}
                    className={`flex w-full items-center justify-between px-5 py-3 text-left transition-colors duration-100 ${
                      i === selectedIndex
                        ? "bg-[color:color-mix(in_srgb,var(--surface-graphite)_10%,transparent)]"
                        : ""
                    }`}
                  >
                    <span className="text-body text-[color:var(--surface-ink)]">
                      {item.label}
                    </span>
                    <span className="text-mono-s text-[color:var(--surface-graphite)]">
                      {item.hint}
                      {item.external ? " ↗" : ""}
                    </span>
                  </button>
                ))
              )}
            </div>

            {/* Footer hint */}
            <div className="flex items-center gap-4 border-t border-[color:color-mix(in_srgb,var(--surface-graphite)_25%,transparent)] px-5 py-3">
              <span className="text-mono-s text-[color:var(--surface-graphite)]">
                ↑↓ NAVIGATE
              </span>
              <span className="text-mono-s text-[color:var(--surface-graphite)]">
                ↵ OPEN
              </span>
              <span className="text-mono-s text-[color:var(--surface-graphite)]">
                ESC CLOSE
              </span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
