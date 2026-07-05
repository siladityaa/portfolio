"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import clsx from "clsx";

import type { ProjectRowData } from "@/components/shared/ProjectRow";

interface ProjectListProps {
  rows: ProjectRowData[];
}

/**
 * Editorial list view of selected work. Each project is a single row of
 * type; on hover a floating thumbnail of that project's hero asset
 * trails the cursor.
 *
 * Performance: the floating preview is positioned with a raw
 * `transform` updated inside a rAF lerp loop (no React state per frame,
 * no animation library) — the same approach as CustomCursor. Only the
 * "which row is hovered" bit lives in React state.
 *
 * The preview is gated on `(hover: hover)` so touch devices get a clean
 * static list with no trailing image. Reduced motion snaps the preview
 * to the cursor instead of easing.
 */
export function ProjectList({ rows }: ProjectListProps) {
  const [hovered, setHovered] = useState<number | null>(null);
  const [supported, setSupported] = useState(false);

  const previewRef = useRef<HTMLDivElement>(null);
  // target (raw cursor) + current (eased) positions, kept out of React state
  const target = useRef({ x: 0, y: 0 });
  const pos = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);
  const reduced = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setSupported(window.matchMedia("(hover: hover)").matches);
    reduced.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
  }, []);

  // rAF lerp loop — eases the preview toward the cursor for the trailing feel.
  useEffect(() => {
    if (!supported) return;

    const onMove = (e: MouseEvent) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    const tick = () => {
      const ease = reduced.current ? 1 : 0.14;
      pos.current.x += (target.current.x - pos.current.x) * ease;
      pos.current.y += (target.current.y - pos.current.y) * ease;
      const el = previewRef.current;
      if (el) {
        // Offset up-and-right of the cursor, centered on the preview.
        el.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0) translate(-50%, -50%)`;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [supported]);

  const active = hovered !== null ? rows[hovered] : null;

  return (
    <div
      className="relative"
      onMouseLeave={() => setHovered(null)}
    >
      <ul className="mx-auto max-w-[1280px] px-[clamp(24px,4vw,64px)]" role="list">
        {rows.map((row, i) => {
          const dimmed = hovered !== null && hovered !== i;
          const isPrivate = row.status === "private";
          return (
            <li key={row.slug} className="hairline-top">
              <Link
                href={`/work/${row.slug}`}
                data-cursor="view"
                onMouseEnter={() => setHovered(i)}
                className={clsx(
                  "group flex items-center justify-between gap-6 py-[clamp(20px,3.2vw,40px)] transition-opacity duration-500 ease-[var(--ease-out-soft)]",
                  dimmed ? "opacity-35" : "opacity-100",
                )}
              >
                {/* Left — index + title */}
                <div className="flex items-center gap-[clamp(16px,3vw,48px)]">
                  <span className="hidden shrink-0 text-label-s text-[color:var(--surface-graphite)] sm:inline">
                    {row.number}
                  </span>
                  <h3 className="flex items-baseline gap-3 text-display-m italic leading-[1.05] text-[color:var(--surface-ink)]">
                    <span
                      aria-hidden
                      className={clsx(
                        "inline-block text-[color:var(--surface-signal)] transition-all duration-500 ease-[var(--ease-out-soft)]",
                        hovered === i
                          ? "w-[0.85em] opacity-100"
                          : "w-0 -translate-x-2 opacity-0",
                      )}
                    >
                      →
                    </span>
                    {row.title}
                  </h3>
                </div>

                {/* Right — meta */}
                <div className="flex shrink-0 items-center gap-[clamp(12px,2vw,28px)] text-label-s text-[color:var(--surface-graphite)]">
                  <span className="hidden md:inline">
                    {row.client}
                  </span>
                  <span>{row.year}</span>
                  <span aria-hidden>{isPrivate ? "◯" : "●"}</span>
                </div>
              </Link>
            </li>
          );
        })}
        {/* Bottom hairline to close the list */}
        <li className="hairline-top" aria-hidden />
      </ul>

      {/* Floating cursor-trailing preview */}
      {supported && (
        <div
          ref={previewRef}
          aria-hidden
          className={clsx(
            "pointer-events-none fixed left-0 top-0 z-[60] hidden w-[clamp(220px,22vw,340px)] overflow-hidden rounded-[4px] shadow-[0_18px_44px_-16px_rgba(11,11,12,0.4)] transition-[opacity,scale] duration-300 ease-[var(--ease-out-soft)] md:block",
            active
              ? "scale-100 opacity-100"
              : "scale-90 opacity-0",
          )}
          style={{ aspectRatio: "16 / 10" }}
        >
          {rows.map((row, i) => (
            <PreviewMedia
              key={row.slug}
              row={row}
              visible={hovered === i}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * One media layer in the floating preview stack. All rows' media are
 * mounted and cross-faded by opacity so the hovered project's asset is
 * ready instantly (no per-hover load flash). Videos autoplay muted.
 */
function PreviewMedia({
  row,
  visible,
}: {
  row: ProjectRowData;
  visible: boolean;
}) {
  const src = row.heroSrc ?? "";
  const ext = src.split("?")[0].split(".").pop()?.toLowerCase() ?? "";
  const isVideo = ext === "mp4" || ext === "webm" || ext === "mov";

  const common = clsx(
    "absolute inset-0 h-full w-full object-cover transition-opacity duration-200 ease-[var(--ease-out-soft)]",
    visible ? "opacity-100" : "opacity-0",
  );

  if (!src) {
    return (
      <div
        className={clsx(
          common,
          "flex items-center justify-center bg-[color:color-mix(in_srgb,var(--surface-graphite)_12%,var(--surface-paper))] text-label-s text-[color:var(--surface-graphite)]",
        )}
      >
        {row.title}
      </div>
    );
  }

  if (isVideo) {
    return (
      <video
        src={src}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        aria-label={row.heroAlt ?? row.title}
        className={common}
      />
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={row.heroAlt ?? row.title}
      className={common}
      loading="lazy"
    />
  );
}
