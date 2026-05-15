"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import clsx from "clsx";

import type { ProjectRowData } from "@/components/shared/ProjectRow";

interface ProjectStackProps {
  rows: ProjectRowData[];
}

/**
 * Magazine-spread layout for the home "Selected Work" section.
 *
 * Each project is its own stacked unit: a big 16:9 hero (image, gif, or
 * video) at full container width, followed by the meta line and a
 * display-l title. Generous vertical spacing between projects gives the
 * page an editorial rhythm — closer to a print feature than a portfolio
 * list.
 *
 * Hover behavior: videos play on hover, pause + rewind on leave. No
 * scale, no flourish; the media is the entire point.
 */
export function ProjectStack({ rows }: ProjectStackProps) {
  return (
    <ul
      role="list"
      className="mx-auto flex max-w-[1280px] flex-col gap-[clamp(160px,24vh,260px)] px-[clamp(24px,4vw,64px)]"
    >
      {rows.map((row, i) => (
        <ProjectFeature key={row.slug} row={row} index={i} />
      ))}
    </ul>
  );
}

function ProjectFeature({ row, index }: { row: ProjectRowData; index: number }) {
  const [hovered, setHovered] = useState(false);
  const isComingSoon = row.status === "comingSoon";
  const stagger = 0.04 * index;

  const mediaBlock = (
    <div
      className="relative w-full overflow-hidden rounded-[4px]"
      style={{
        aspectRatio: "16 / 9",
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
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-[color:color-mix(in_srgb,var(--surface-ink)_45%,transparent)]">
          <span className="text-mono-s text-[color:#f6f5f1]">
            ◯ COMING SOON
          </span>
        </div>
      ) : null}
    </div>
  );

  const captionBlock = (
    <div className="mt-8 grid grid-cols-1 gap-y-4 md:grid-cols-12 md:gap-x-8">
      {/* Meta — left column on desktop, full-width on mobile.
          Two lines: company (with status inlined) and year. The category
          read is already implicit in the company sub-team string. */}
      <div className="flex flex-row flex-wrap gap-x-6 gap-y-1 text-mono-s text-[color:var(--surface-graphite)] md:col-span-4 md:flex-col md:gap-x-0">
        <span>
          {row.client.toUpperCase()}
          <span className="ml-3 text-[color:var(--surface-graphite)]">
            {isComingSoon ? "◯ COMING SOON" : "● PUBLIC"}
          </span>
        </span>
        <span>{row.year}</span>
      </div>

      {/* Title — main column on desktop, right-aligned to container edge */}
      <h3 className="text-display-l italic leading-[1.02] text-[color:var(--surface-ink)] md:col-span-8 md:text-right">
        {row.title}
      </h3>
    </div>
  );

  const inner = (
    <>
      {mediaBlock}
      {captionBlock}
    </>
  );

  return (
    <li
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        animation: `feature-rise 0.7s cubic-bezier(0.22,1,0.36,1) ${stagger}s both`,
      }}
    >
      {isComingSoon ? (
        <div
          aria-disabled="true"
          data-cursor="default"
          className="flex cursor-not-allowed flex-col"
        >
          {inner}
        </div>
      ) : (
        <Link
          href={`/work/${row.slug}`}
          data-cursor="open"
          className="flex flex-col"
        >
          {inner}
        </Link>
      )}

      <style jsx>{`
        @keyframes feature-rise {
          from {
            opacity: 0;
            transform: translateY(20px);
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
 * Plays a video on `active`, pauses + rewinds on inactive. Non-video
 * assets render as a plain <img> (GIFs autoplay by design).
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
      className={clsx("absolute inset-0 h-full w-full object-cover")}
      loading="lazy"
    />
  );
}
