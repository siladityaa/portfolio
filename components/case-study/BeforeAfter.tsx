"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { BeforeAfterSection } from "@/content/types";

/**
 * Interactive before/after comparison slider.
 *
 * Drag the handle (or click anywhere) to reveal the after image over
 * the before. Uses clip-path for the reveal. Supports mouse, touch,
 * and keyboard (← → arrows when focused). Falls back to 50/50 split
 * when prefers-reduced-motion is active.
 *
 * Upgraded from the static side-by-side in Phase 2 to the interactive
 * slider described in the build plan Phase 5.6.
 */
export function BeforeAfter({ section }: { section: BeforeAfterSection }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(50); // percentage
  const [isDragging, setIsDragging] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  /* Detect reduced motion */
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  /* Convert a pointer X to a percentage */
  const updatePosition = useCallback((clientX: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = clientX - rect.left;
    const pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setPosition(pct);
  }, []);

  /* Pointer event handlers */
  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      setIsDragging(true);
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      updatePosition(e.clientX);
    },
    [updatePosition],
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging) return;
      updatePosition(e.clientX);
    },
    [isDragging, updatePosition],
  );

  const onPointerUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  /* Keyboard control: ← → arrows when handle is focused */
  const onKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      setPosition((p) => Math.max(0, p - 2));
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      setPosition((p) => Math.min(100, p + 2));
    }
  }, []);

  /* Reduced-motion fallback: static side-by-side */
  if (reducedMotion) {
    return <StaticFallback section={section} />;
  }

  return (
    <figure className="my-12">
      <div
        ref={containerRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        className="group relative aspect-[16/10] overflow-hidden rounded-2xl border border-[color:color-mix(in_srgb,var(--surface-graphite)_25%,transparent)]"
        style={{ touchAction: "none" }}
        data-cursor="crosshair"
      >
        {/* Before layer (full width, underneath) */}
        <div
          aria-label={section.before.label}
          className="absolute inset-0"
          style={{
            backgroundColor:
              "color-mix(in srgb, var(--surface-graphite) 14%, transparent)",
          }}
        >
          {section.before.src && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={section.before.src}
              alt={section.before.label}
              className="h-full w-full object-cover"
            />
          )}
        </div>

        {/* After layer (clipped to reveal from right) */}
        <div
          aria-label={section.after.label}
          className="absolute inset-0"
          style={{
            clipPath: `inset(0 0 0 ${position}%)`,
            backgroundColor:
              "color-mix(in srgb, var(--surface-graphite) 22%, transparent)",
          }}
        >
          {section.after.src && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={section.after.src}
              alt={section.after.label}
              className="h-full w-full object-cover"
            />
          )}
        </div>

        {/* Labels */}
        <span
          className="pointer-events-none absolute left-4 top-4 inline-flex items-center rounded-full bg-[color:color-mix(in_srgb,var(--surface-paper)_85%,transparent)] px-4 py-1.5 text-mono-s text-[color:var(--surface-ink)]"
          style={{ opacity: position > 8 ? 1 : 0 }}
        >
          {section.before.label}
        </span>
        <span
          className="pointer-events-none absolute right-4 top-4 inline-flex items-center rounded-full bg-[color:var(--surface-ink)] px-4 py-1.5 text-mono-s text-[color:var(--surface-paper)]"
          style={{ opacity: position < 92 ? 1 : 0 }}
        >
          {section.after.label}
        </span>

        {/* Drag handle — vertical line + grip circle */}
        <div
          className="absolute top-0 bottom-0 z-10 flex items-center"
          style={{ left: `${position}%`, transform: "translateX(-50%)" }}
        >
          {/* Vertical line */}
          <div className="pointer-events-none h-full w-px bg-[color:var(--surface-paper)]" />

          {/* Grip circle */}
          <button
            type="button"
            tabIndex={0}
            onKeyDown={onKeyDown}
            aria-label="Drag to compare before and after"
            aria-valuenow={Math.round(position)}
            aria-valuemin={0}
            aria-valuemax={100}
            role="slider"
            className="absolute left-1/2 top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-[color:var(--surface-paper)] bg-[color:color-mix(in_srgb,var(--surface-ink)_70%,transparent)] shadow-md backdrop-blur-sm transition-transform duration-150 hover:scale-110 focus-visible:scale-110"
          >
            {/* Double-arrow icon */}
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              className="text-[color:var(--surface-paper)]"
            >
              <path
                d="M4.5 4L1 8L4.5 12M11.5 4L15 8L11.5 12"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </figure>
  );
}

/* ------------------------------------------------------------------ */
/*  Reduced-motion fallback — static side-by-side                      */
/* ------------------------------------------------------------------ */

function StaticFallback({ section }: { section: BeforeAfterSection }) {
  return (
    <figure className="my-12">
      <div className="relative overflow-hidden rounded-2xl border border-[color:color-mix(in_srgb,var(--surface-graphite)_25%,transparent)]">
        <div className="grid grid-cols-2">
          <div
            aria-label={section.before.label}
            className="relative aspect-[16/10] border-r border-[color:color-mix(in_srgb,var(--surface-graphite)_25%,transparent)]"
            style={{
              backgroundColor:
                "color-mix(in srgb, var(--surface-graphite) 14%, transparent)",
            }}
          >
            <span className="absolute left-4 top-4 inline-flex items-center rounded-full bg-[color:color-mix(in_srgb,var(--surface-paper)_85%,transparent)] px-4 py-1.5 text-mono-s text-[color:var(--surface-ink)]">
              {section.before.label}
            </span>
          </div>
          <div
            aria-label={section.after.label}
            className="relative aspect-[16/10]"
            style={{
              backgroundColor:
                "color-mix(in srgb, var(--surface-graphite) 22%, transparent)",
            }}
          >
            <span className="absolute right-4 top-4 inline-flex items-center rounded-full bg-[color:var(--surface-ink)] px-4 py-1.5 text-mono-s text-[color:var(--surface-paper)]">
              {section.after.label}
            </span>
          </div>
        </div>
      </div>
    </figure>
  );
}
