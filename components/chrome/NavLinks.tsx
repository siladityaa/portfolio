"use client";

import Link from "next/link";

import { WIP_MODE } from "@/lib/wip-mode";

/**
 * Top-right corner nav. RESUME is the only in-app destination; the search
 * icon opens the command palette (⌘K shortcut also still works).
 *
 * WIP mode hides everything except RESUME and the search icon.
 */

export function NavLinks() {
  const openPalette = () => {
    window.dispatchEvent(new CustomEvent("cmdk:open"));
  };

  return (
    <nav
      aria-label="Primary"
      className="fixed right-[clamp(24px,4vw,64px)] top-[clamp(24px,4vw,64px)] z-50 flex h-[54px] items-center gap-6"
    >
      <Link
        href="/resume"
        data-cursor="view"
        className="text-label-s text-[color:var(--surface-ink)] transition-opacity duration-300 ease-[var(--ease-out-soft)] hover:opacity-60"
      >
        Resume
      </Link>

      {/* Search button — temporarily hidden. Re-enable by restoring the
          button below and removing the early return in CommandPalette. */}
      {false && !WIP_MODE && (
        <button
          type="button"
          onClick={openPalette}
          aria-label="Open search (⌘K)"
          data-cursor="view"
          className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[color:color-mix(in_srgb,var(--surface-graphite)_25%,transparent)] text-[color:var(--surface-ink)] transition-all duration-300 ease-[var(--ease-out-soft)] hover:border-[color:var(--surface-ink)] hover:bg-[color:var(--surface-ink)] hover:text-[color:var(--surface-paper)]"
        >
          <SearchIcon />
        </button>
      )}
    </nav>
  );
}

function SearchIcon() {
  return (
    <svg
      aria-hidden
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="7" cy="7" r="4.5" />
      <path d="M10.5 10.5 L13.5 13.5" />
    </svg>
  );
}
