"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import clsx from "clsx";

import type { ProjectRowData } from "@/components/shared/ProjectRow";

interface ProjectGridProps {
  rows: ProjectRowData[];
}

/**
 * Media-forward 2-column grid for the home page "Selected Work" section.
 *
 * Each tile leads with a large hero asset (16:10) so the project's visual
 * identity is the primary read. Title and meta sit below the media in the
 * compact "01 · CLIENT · 2024" line + display title pattern used elsewhere
 * on the site.
 *
 * Hover behavior: if the hero is a video/gif, it plays on tile hover and
 * resets on leave. No scale, no other ornamentation — the asset is meant
 * to do the talking.
 */
export function ProjectGrid({ rows }: ProjectGridProps) {
  return (
    <ul
      role="list"
      className="mx-auto grid max-w-[1280px] grid-cols-1 gap-x-[clamp(24px,3vw,48px)] gap-y-[clamp(56px,8vh,96px)] px-[clamp(24px,4vw,64px)] md:grid-cols-2"
    >
      {rows.map((row, i) => (
        <ProjectTile key={row.slug} row={row} index={i} />
      ))}
    </ul>
  );
}

function ProjectTile({ row, index }: { row: ProjectRowData; index: number }) {
  const [hovered, setHovered] = useState(false);
  const isComingSoon = row.status === "private";

  // Stagger the first paint a touch so the grid lays in instead of slamming
  // — same easing curve as the rest of the site.
  const stagger = 0.05 * index;

  const tileInner = (
    <>
      <div
        className="relative w-full overflow-hidden rounded-[3px]"
        style={{
          aspectRatio: "16 / 10",
          backgroundColor: row.keyColor
            ? `color-mix(in srgb, ${row.keyColor} 18%, transparent)`
            : "color-mix(in srgb, var(--surface-graphite) 12%, transparent)",
        }}
      >
        {row.heroSrc ? (
          <HoverMedia
            src={row.heroSrc}
            alt={row.heroAlt ?? row.title}
            active={hovered}
          />
        ) : null}

        {isComingSoon ? (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-[color:color-mix(in_srgb,var(--surface-ink)_50%,transparent)]">
            <span className="text-label-s text-[color:#f6f5f1]">
              ◯ COMING SOON
            </span>
          </div>
        ) : null}
      </div>

      <div className="mt-5 flex items-baseline justify-between gap-4">
        <span className="text-label-s text-[color:var(--surface-graphite)]">
          {row.number} · {row.client.toUpperCase()} · {row.year}
        </span>
        <span className="text-label-s text-[color:var(--surface-graphite)]">
          {isComingSoon ? "◯" : "●"}
        </span>
      </div>

      <h3 className="mt-3 text-display-m leading-[1.05] text-[color:var(--surface-ink)]">
        {row.title}
      </h3>
    </>
  );

  const sharedClass = clsx(
    "group flex flex-col transition-opacity duration-500 ease-[var(--ease-out-soft)]",
  );

  return (
    <li
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        animation: `tile-rise 0.7s cubic-bezier(0.22,1,0.36,1) ${stagger}s both`,
      }}
    >
      {isComingSoon ? (
        <div
          aria-disabled="true"
          data-cursor="default"
          className={clsx(sharedClass, "cursor-not-allowed")}
        >
          {tileInner}
        </div>
      ) : (
        <Link
          href={`/work/${row.slug}`}
          data-cursor="open"
          className={sharedClass}
        >
          {tileInner}
        </Link>
      )}

      <style jsx>{`
        @keyframes tile-rise {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          li {
            animation: none !important;
          }
        }
      `}</style>
    </li>
  );
}

/**
 * Plays a video on `active`, pauses + rewinds on inactive. Falls back to
 * a plain <img> for non-video assets (GIFs included — they autoplay by
 * design, which is fine; the appearance still matches the design).
 */
function HoverMedia({
  src,
  alt,
  active,
}: {
  src: string;
  alt: string;
  active: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const ext = src.split("?")[0].split(".").pop()?.toLowerCase() ?? "";
  const isVideo = ext === "mp4" || ext === "webm" || ext === "mov";

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (active) {
      // .play() returns a promise that may reject if the browser blocks
      // autoplay — we swallow it, the muted+playsInline combo is allowed
      // basically everywhere.
      const p = v.play();
      if (p) p.catch(() => {});
    } else {
      v.pause();
      v.currentTime = 0;
    }
  }, [active]);

  if (isVideo) {
    return (
      <video
        ref={videoRef}
        src={src}
        loop
        muted
        playsInline
        preload="metadata"
        aria-label={alt}
        className="absolute inset-0 h-full w-full object-cover"
      />
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className="absolute inset-0 h-full w-full object-cover"
      loading="lazy"
    />
  );
}
