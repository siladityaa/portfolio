"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
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
  { label: "Resume", hint: "/resume", href: "/resume" },
  { label: "Colophon", hint: "/colophon", href: "/colophon" },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

interface CommandPaletteProps {
  /** Live list of published case studies, passed in from the server-side
   *  layout so the palette always matches what's on the home page. */
  projects?: Array<{ slug: string; title: string }>;
}

// Temporarily disable the command palette entirely. Flip to `false`
// to bring back the ⌘K palette + search button (see NavLinks.tsx).
const PALETTE_DISABLED = true;

export function CommandPalette({ projects = [] }: CommandPaletteProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const allItems = useMemo<PaletteItem[]>(
    () => [
      ...PAGES,
      ...projects.map((p) => ({
        label: p.title,
        hint: `/work/${p.slug}`,
        href: `/work/${p.slug}`,
      })),
    ],
    [projects],
  );

  /* Filtered results */
  const results = useMemo(() => {
    if (!query.trim()) return allItems;
    const q = query.toLowerCase();
    return allItems.filter(
      (item) =>
        item.label.toLowerCase().includes(q) ||
        item.hint.toLowerCase().includes(q),
    );
  }, [query, allItems]);

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

  /* ⌘K / Ctrl-K toggle + custom event from the search button */
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
    function onCmdkOpen() {
      setOpen(true);
    }
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("cmdk:open", onCmdkOpen as EventListener);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("cmdk:open", onCmdkOpen as EventListener);
    };
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

  if (PALETTE_DISABLED) return null;

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
              <span className="text-label-s text-[color:var(--surface-graphite)]">
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
              <kbd className="rounded border border-[color:color-mix(in_srgb,var(--surface-graphite)_30%,transparent)] px-1.5 py-0.5 text-label-s text-[color:var(--surface-graphite)]">
                Esc
              </kbd>
            </div>

            {/* Results list */}
            <div
              ref={listRef}
              className="max-h-[320px] overflow-y-auto overscroll-contain py-2"
            >
              {results.length === 0 ? (
                <div className="px-5 py-6 text-center text-label-s text-[color:var(--surface-graphite)]">
                  No results
                </div>
              ) : (
                results.map((item, i) => {
                  const handleSelect = (e: React.MouseEvent) => {
                    if (item.external) {
                      e.preventDefault();
                      window.open(item.href, "_blank", "noopener,noreferrer");
                    }
                    setOpen(false);
                    setQuery("");
                  };
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      target={item.external ? "_blank" : undefined}
                      rel={item.external ? "noopener noreferrer" : undefined}
                      onClick={handleSelect}
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
                      <span className="text-label-s text-[color:var(--surface-graphite)]">
                        {item.hint}
                        {item.external ? " ↗" : ""}
                      </span>
                    </Link>
                  );
                })
              )}
            </div>

            {/* Footer hint */}
            <div className="flex items-center gap-4 border-t border-[color:color-mix(in_srgb,var(--surface-graphite)_25%,transparent)] px-5 py-3">
              <span className="text-label-s text-[color:var(--surface-graphite)]">
                ↑↓ Navigate
              </span>
              <span className="text-label-s text-[color:var(--surface-graphite)]">
                ↵ Open
              </span>
              <span className="text-label-s text-[color:var(--surface-graphite)]">
                Esc close
              </span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
