"use client";

import Link from "next/link";
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
      className="mx-auto flex max-w-[1280px] flex-col gap-[clamp(96px,14vh,160px)] px-[clamp(24px,4vw,64px)]"
    >
      {rows.map((row, i) => (
        <ProjectFeature key={row.slug} row={row} index={i} />
      ))}
    </ul>
  );
}

function ProjectFeature({ row, index }: { row: ProjectRowData; index: number }) {
  const stagger = 0.04 * index;

  // Media fills its 16:9 container directly — no backdrop, no frame.
  // Empty rows get a tinted card with a faint dot grid so they read as
  // deliberate placeholders rather than blank gaps.
  const isEmpty = !row.heroSrc;
  const emptyBg = `radial-gradient(circle, color-mix(in srgb, var(--surface-graphite) 22%, transparent) 1px, transparent 1px) 0 0 / 16px 16px,
       color-mix(in srgb, var(--surface-graphite) 9%, var(--surface-paper))`;

  const mediaBlock = (
    <div
      className="relative flex w-full items-center justify-center overflow-hidden rounded-[4px]"
      style={{
        aspectRatio: "16 / 9",
        background: isEmpty ? emptyBg : undefined,
      }}
    >
      {row.heroSrc ? (
        <AlwaysPlayingMedia src={row.heroSrc} alt={row.heroAlt ?? row.title} />
      ) : (
        <ComingSoonPlaceholder />
      )}
    </div>
  );

  const captionBlock = (
    <div className="mt-8 grid grid-cols-1 gap-y-4 md:grid-cols-12 md:gap-x-8">
      <div className="flex flex-row flex-wrap gap-x-6 gap-y-1 text-label-s text-[color:var(--surface-graphite)] md:col-span-4 md:flex-col md:gap-x-0">
        <span>{row.client.toUpperCase()}</span>
        <span>{row.year}</span>
      </div>

      {/* Title — main column on desktop, right-aligned to container edge */}
      <h3 className="text-display-l italic leading-[1.02] text-[color:var(--surface-ink)] md:col-span-8 md:text-right">
        {row.title}
      </h3>
    </div>
  );

  return (
    <li
      style={{
        animation: `feature-rise 0.7s cubic-bezier(0.22,1,0.36,1) ${stagger}s both`,
      }}
    >
      <Link
        href={`/work/${row.slug}`}
        data-cursor="open"
        className="flex flex-col"
      >
        {mediaBlock}
        {captionBlock}
      </Link>

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
 * Empty-state badge shown inside the inset frame when a project has no
 * hero asset yet. Hollow dot + mono label, hairline divider, italic
 * serif "Coming soon" tagline — quiet placeholder that still reads like
 * deliberate composition.
 */
function ComingSoonPlaceholder() {
  return (
    <div className="flex flex-col items-center gap-3 px-6 py-8 text-center">
      <span className="text-label-s text-[color:var(--surface-graphite)]">
        ◯ COMING SOON
      </span>
      <span className="block h-[1px] w-10 bg-[color:color-mix(in_srgb,var(--surface-graphite)_35%,transparent)]" />
      <span className="text-display-s italic text-[color:var(--surface-graphite)]">
        Documenting in progress
      </span>
    </div>
  );
}

/**
 * Auto-playing media. Videos autoplay muted+looped on mount across
 * every tile so the grid feels alive; non-video assets render as a
 * plain <img> (GIFs autoplay by design).
 */
function AlwaysPlayingMedia({ src, alt }: { src: string; alt: string }) {
  const ext = src.split("?")[0].split(".").pop()?.toLowerCase() ?? "";
  const isVideo = ext === "mp4" || ext === "webm" || ext === "mov";

  if (isVideo) {
    return (
      <video
        src={src}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
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
