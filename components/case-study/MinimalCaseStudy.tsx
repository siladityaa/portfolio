"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";

import type { CaseStudy } from "@/content/types";
import { revealBlock, revealStaggerBlocks } from "@/lib/motion";

interface MinimalCaseStudyProps {
  cs: CaseStudy;
  index: number;
  total: number;
  prevSlug?: string;
  nextSlug?: string;
}

/**
 * Minimal single-viewport case study layout.
 *
 * Brief from Siladityaa: "very minimal and clean ... single page single
 * viewport no scrolling view ... simple description, my role and other
 * key info ... simple way to show design assets and gifs/videos."
 *
 * The page collapses everything a hiring manager actually needs into one
 * frame: title, year, role, team, status, brief, tags, plus a featured
 * media well with a thumbnail strip below it. Click a thumbnail to swap
 * the featured asset. Top strip shows the project counter + back link.
 * Bottom strip handles prev/next navigation.
 *
 * Below the lg breakpoint the layout stacks vertically and allows scroll;
 * at lg+ it's a strict 2-column grid sized to the available viewport.
 */
export function MinimalCaseStudy({
  cs,
  index,
  total,
  prevSlug,
  nextSlug,
}: MinimalCaseStudyProps) {
  // Pull every image we can find — hero + imageGrid + mockupFrame +
  // beforeAfter — into a single flat gallery for the thumbnail strip.
  const media = useMemo(() => collectMedia(cs), [cs]);
  const [activeIndex, setActiveIndex] = useState(0);
  const active = media[activeIndex];

  // Brief: drop the leading "TODO(siladityaa) — " marker if it's still
  // there so placeholder text doesn't bleed into the public layout.
  const brief = (cs.brief ?? "").replace(/^TODO\(.*?\)\s*[—–-]?\s*/i, "");

  return (
    <section
      className="relative mx-auto flex w-full max-w-[1480px] flex-col px-[clamp(20px,4vw,64px)] pt-[clamp(96px,12vw,140px)] pb-[clamp(72px,9vw,108px)] lg:h-[100dvh] lg:overflow-hidden"
      data-cursor="default"
    >
      {/* Top meta strip */}
      <motion.div
        variants={revealStaggerBlocks}
        initial="hidden"
        animate="visible"
        className="flex items-center justify-between gap-6 pb-6 lg:pb-8"
      >
        <motion.div variants={revealBlock}>
          <Link
            href="/#work"
            data-cursor="view"
            className="text-mono-s text-[color:var(--surface-graphite)] transition-opacity duration-300 ease-[var(--ease-out-soft)] hover:opacity-60"
          >
            ← BACK TO WORK
          </Link>
        </motion.div>
        <motion.span
          variants={revealBlock}
          className="text-mono-s text-[color:var(--surface-graphite)] tabular-nums"
        >
          {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </motion.span>
      </motion.div>

      {/* Two-column body — info on the left, media well on the right */}
      <motion.div
        variants={revealStaggerBlocks}
        initial="hidden"
        animate="visible"
        className="grid flex-1 grid-cols-1 gap-10 lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)] lg:gap-[clamp(40px,5vw,80px)]"
      >
        {/* INFO column */}
        <motion.div
          variants={revealBlock}
          className="flex flex-col gap-6 lg:gap-8 lg:overflow-y-auto lg:pr-2"
        >
          <div className="flex flex-col gap-2">
            <span className="text-mono-s text-[color:var(--surface-graphite)]">
              {cs.timeline}
            </span>
            <h1 className="text-display-l italic text-[color:var(--surface-ink)]">
              {cs.title}
            </h1>
          </div>

          {brief && (
            <p className="text-body text-[color:var(--surface-ink)]">
              {brief}
            </p>
          )}

          <dl className="flex flex-col gap-3 border-t border-[color:color-mix(in_srgb,var(--surface-graphite)_15%,transparent)] pt-5">
            <MetaRow label="Role" value={cs.role} />
            {cs.team && <MetaRow label="Team" value={cs.team} />}
            {cs.credits && <MetaRow label="Partners" value={cs.credits} />}
            <MetaRow
              label="Status"
              value={cs.status === "public" ? "Public" : "NDA"}
            />
          </dl>

          {cs.tags && cs.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {cs.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-[color:color-mix(in_srgb,var(--surface-graphite)_20%,transparent)] px-3 py-1 text-mono-s text-[color:var(--surface-graphite)]"
                >
                  {tag.toUpperCase()}
                </span>
              ))}
            </div>
          )}
        </motion.div>

        {/* MEDIA column — featured well + thumb strip */}
        <motion.div
          variants={revealBlock}
          className="flex min-h-0 flex-col gap-4"
        >
          {active ? (
            <div className="relative flex-1 overflow-hidden rounded-[2px] bg-[color:color-mix(in_srgb,var(--surface-graphite)_8%,transparent)]">
              <div
                className="relative h-full w-full"
                style={{
                  aspectRatio: media.length > 0 && active ? undefined : "16/10",
                }}
              >
                <MediaFrame src={active.src} alt={active.alt ?? cs.title} />
              </div>
              {active.caption && (
                <span className="pointer-events-none absolute bottom-3 left-3 rounded-full bg-[color:var(--surface-paper)]/80 px-3 py-1 text-mono-s text-[color:var(--surface-graphite)] backdrop-blur-sm">
                  {active.caption}
                </span>
              )}
            </div>
          ) : (
            <div className="flex flex-1 items-center justify-center rounded-[2px] border border-dashed border-[color:color-mix(in_srgb,var(--surface-graphite)_25%,transparent)] text-mono-s text-[color:var(--surface-graphite)]">
              MEDIA TBD
            </div>
          )}

          {media.length > 1 && (
            <div className="flex shrink-0 gap-2 overflow-x-auto pb-1 scrollbar-none">
              {media.map((m, i) => (
                <button
                  key={`${m.src}-${i}`}
                  type="button"
                  onClick={() => setActiveIndex(i)}
                  data-cursor="view"
                  aria-label={`View ${m.alt ?? `image ${i + 1}`}`}
                  aria-pressed={i === activeIndex}
                  className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-[2px] border transition-all duration-300 ease-[var(--ease-out-soft)] ${
                    i === activeIndex
                      ? "border-[color:var(--surface-ink)] opacity-100"
                      : "border-[color:color-mix(in_srgb,var(--surface-graphite)_20%,transparent)] opacity-60 hover:opacity-100"
                  }`}
                >
                  <MediaFrame src={m.src} alt={m.alt ?? ""} />
                </button>
              ))}
            </div>
          )}
        </motion.div>
      </motion.div>

      {/* Bottom prev / next */}
      <motion.div
        variants={revealStaggerBlocks}
        initial="hidden"
        animate="visible"
        className="flex items-center justify-between gap-6 pt-6 lg:pt-8"
      >
        {prevSlug ? (
          <Link
            href={`/work/${prevSlug}`}
            data-cursor="view"
            className="text-mono-s text-[color:var(--surface-graphite)] transition-opacity duration-300 ease-[var(--ease-out-soft)] hover:opacity-60"
          >
            ← PREVIOUS
          </Link>
        ) : (
          <span />
        )}
        {nextSlug ? (
          <Link
            href={`/work/${nextSlug}`}
            data-cursor="view"
            className="text-mono-s text-[color:var(--surface-ink)] transition-opacity duration-300 ease-[var(--ease-out-soft)] hover:opacity-60"
          >
            NEXT →
          </Link>
        ) : (
          <Link
            href="/#work"
            data-cursor="view"
            className="text-mono-s text-[color:var(--surface-graphite)] transition-opacity duration-300 ease-[var(--ease-out-soft)] hover:opacity-60"
          >
            ALL WORK →
          </Link>
        )}
      </motion.div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Subcomponents                                                              */
/* -------------------------------------------------------------------------- */

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[80px_minmax(0,1fr)] gap-3 text-mono-s">
      <dt className="text-[color:var(--surface-graphite)]">
        {label.toUpperCase()}
      </dt>
      <dd className="whitespace-pre-line text-[color:var(--surface-ink)]">
        {value}
      </dd>
    </div>
  );
}

/**
 * Renders an image, video, or gif depending on the file extension. All media
 * fits the parent via `object-contain` so we never crop the asset; the
 * surrounding container handles framing.
 */
function MediaFrame({ src, alt }: { src: string; alt: string }) {
  const ext = src.split(".").pop()?.toLowerCase() ?? "";
  if (ext === "mp4" || ext === "webm" || ext === "mov") {
    return (
      <video
        src={src}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-contain"
      />
    );
  }
  // Next/Image needs intrinsic sizing; using fill to let parent control it.
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes="(min-width: 1024px) 70vw, 100vw"
      className="object-contain"
      unoptimized={ext === "gif"}
      priority
    />
  );
}

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

interface MediaItem {
  src: string;
  alt?: string;
  caption?: string;
}

function collectMedia(cs: CaseStudy): MediaItem[] {
  const list: MediaItem[] = [];
  const seen = new Set<string>();
  const push = (m: MediaItem | null | undefined) => {
    if (!m || !m.src) return;
    if (seen.has(m.src)) return;
    seen.add(m.src);
    list.push(m);
  };

  push(cs.hero ?? undefined);
  for (const item of cs.gallery ?? []) push(item);
  for (const chapter of cs.chapters ?? []) {
    for (const sec of chapter.sections ?? []) {
      switch (sec.kind) {
        case "imageGrid":
          for (const item of sec.images ?? []) push(item);
          break;
        case "mockupFrame":
          push({ src: sec.src, alt: sec.alt, caption: sec.caption });
          break;
        case "beforeAfter":
          push(sec.before);
          push(sec.after);
          break;
      }
    }
  }
  return list;
}
