"use client";

import Link from "next/link";
import { useState } from "react";
import clsx from "clsx";

export interface ProjectRowData {
  number: string; // "001"
  year: string; // "2024 — 2025"
  /** Company / org line. First line of the case study's `credits` field
   *  when present (e.g. "Meta Reality Labs — Wearables"), else a sensible
   *  default. */
  client: string;
  /** Readable project categories derived from the case study's tags
   *  (e.g. ["Wearables", "AI"]). May be empty. */
  categories?: string[];
  title: string;
  slug: string;
  status: "public" | "private";
  keyColor: string;
  /** Hero asset that previews on row hover. Image or video src. */
  heroSrc?: string;
  heroAlt?: string;
}

interface ProjectListProps {
  rows: ProjectRowData[];
}

/**
 * Brief §4.1 — the selected work list on the home page.
 *
 * Full-width rows, hover fills with keyColor, other rows dim to 40%.
 *
 * Layout note: we intentionally do NOT wrap the whole row in a Link because
 * that would nest an anchor (the NDA "REQUEST ACCESS" mailto) inside another
 * anchor. Instead the <li> owns hover state, and the title area is a Link.
 * Clicking anywhere on the title area navigates; the mailto dot in the
 * metadata column is its own separate anchor.
 */
export function ProjectRowList({ rows }: ProjectListProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <ul className="flex flex-col" role="list">
      {rows.map((row, i) => {
        const isHovered = hoveredIndex === i;
        const isDimmed = hoveredIndex !== null && !isHovered;
        const isComingSoon = row.status === "private";
        return (
          <li
            key={row.slug}
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
            className={clsx(
              "group relative hairline-top transition-opacity duration-500 ease-[var(--ease-out-soft)]",
              isDimmed && "opacity-40",
            )}
            style={
              isHovered
                ? ({ backgroundColor: row.keyColor } as React.CSSProperties)
                : undefined
            }
          >
            <div className="mx-auto flex min-h-[180px] max-w-[1280px] flex-col gap-6 px-[clamp(24px,4vw,64px)] py-8 md:min-h-[240px] md:flex-row md:items-center md:gap-12 md:py-12">
              {/* Left: metadata column — stacks above title on mobile */}
              <div
                className={clsx(
                  "flex flex-row flex-wrap gap-x-4 gap-y-1 text-label-s md:w-[220px] md:shrink-0 md:flex-col md:gap-x-0",
                  isHovered
                    ? "text-[color:rgba(246,245,241,0.85)]"
                    : "text-[color:var(--surface-graphite)]",
                )}
              >
                <span>PROJECT {row.number}</span>
                <span className="hidden md:inline">{row.year}</span>
                <span>{row.client}</span>
                <div className="mt-0 md:mt-2">
                  <span
                    className={clsx(
                      isHovered
                        ? "text-[color:rgba(246,245,241,0.85)]"
                        : "text-[color:var(--surface-graphite)]",
                    )}
                  >
                    {isComingSoon ? "[ ◯ COMING SOON ]" : "[ ● PUBLIC ]"}
                  </span>
                </div>
              </div>

              {/* Right: title + hero preview. Links to the case study only
                  when the project is public; coming-soon rows render the
                  same content but unlinked + with cursor: not-allowed. */}
              <RowBody
                row={row}
                isHovered={isHovered}
                isComingSoon={isComingSoon}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}

/**
 * The right side of the row — title + slide-in hero preview. Wrapped in
 * a Link for public projects; rendered as a plain div for coming-soon
 * projects so the row can't be clicked.
 */
function RowBody({
  row,
  isHovered,
  isComingSoon,
}: {
  row: ProjectRowData;
  isHovered: boolean;
  isComingSoon: boolean;
}) {
  const titleClass = clsx(
    "text-display-l transition-colors duration-500 ease-[var(--ease-out-soft)]",
    isHovered ? "text-[color:#f6f5f1]" : "text-[color:var(--surface-ink)]",
  );
  const previewWrapper = clsx(
    "hidden h-[180px] w-[260px] shrink-0 overflow-hidden rounded-[2px] transition-all duration-500 ease-[var(--ease-out-soft)] md:block",
    isHovered ? "translate-x-0 opacity-100" : "translate-x-6 opacity-0",
  );

  const inner = (
    <>
      <h3 className={titleClass}>{row.title}</h3>
      <div
        className={previewWrapper}
        style={{
          backgroundColor: "color-mix(in srgb, #f6f5f1 15%, transparent)",
        }}
        aria-hidden
      >
        {row.heroSrc ? (
          <HeroPreview
            src={row.heroSrc}
            alt={row.heroAlt ?? row.title}
            active={isHovered}
          />
        ) : null}
      </div>
    </>
  );

  if (isComingSoon) {
    return (
      <div
        aria-disabled="true"
        data-cursor="default"
        className="flex flex-1 cursor-not-allowed items-center justify-between gap-8"
      >
        {inner}
      </div>
    );
  }

  return (
    <Link
      href={`/work/${row.slug}`}
      data-cursor="open"
      className="flex flex-1 items-center justify-between gap-8"
    >
      {inner}
    </Link>
  );
}

/**
 * Hover-preview cell. Detects video files (.mp4/.webm/.mov) and renders
 * them as a muted autoplay loop; everything else renders as a static
 * <img>. We use a plain <img> rather than next/image because external
 * URLs (Vercel Blob, Cloudinary, etc.) aren't in the next.config
 * remotePatterns allowlist, and the local repo paths don't need
 * optimization for a 260×180 thumb.
 */
function HeroPreview({
  src,
  alt,
  active,
}: {
  src: string;
  alt: string;
  active: boolean;
}) {
  const ext = src.split("?")[0].split(".").pop()?.toLowerCase() ?? "";
  const isVideo = ext === "mp4" || ext === "webm" || ext === "mov";

  if (isVideo) {
    return (
      <video
        src={src}
        autoPlay={active}
        loop
        muted
        playsInline
        preload="metadata"
        className="h-full w-full object-cover"
      />
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className="h-full w-full object-cover"
      loading="lazy"
    />
  );
}
