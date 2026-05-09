"use client";

import Link from "next/link";
import Image from "next/image";
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
 * Bento case study — every block (text, main asset, supporting assets)
 * lives inside the same grid. The text card and the hero are the two
 * largest tiles, the rest fill in around them.
 *
 *   ┌────────┬─────────────────┬───────────┐
 *   │  TEXT  │                 │   s1      │
 *   │  CARD  │                 │   (2x2)   │
 *   │  (2x4) │   MAIN ASSET    │           │
 *   │  full  │   (3x4 — the    ├─────┬─────┤
 *   │  height│    tallest +    │     │ s3  │
 *   │        │    biggest)     │ s2  ├─────┤
 *   │        │                 │ 1x2 │ s4  │
 *   │        │                 │     │     │
 *   └────────┴─────────────────┴─────┴─────┘
 *
 * 7-column grid balances visual weight. Text card runs full height so
 * the brief and meta never get clipped; hero claims the centre 3 cols
 * (43%); right 2 cols (29%) host four supporting tiles in mixed
 * portrait/square shapes.
 *
 * Single viewport at lg+, stacks vertically below.
 */
export function MinimalCaseStudy({
  cs,
  index,
  total,
  prevSlug,
  nextSlug,
}: MinimalCaseStudyProps) {
  const brief = (cs.brief ?? "").replace(/^TODO\(.*?\)\s*[—–-]?\s*/i, "");
  const counter = `${String(index + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`;
  const bento = (cs.gallery ?? []).slice(0, 5);

  return (
    <section
      data-cursor="default"
      className="relative mx-auto flex w-full max-w-[1640px] flex-col px-[clamp(20px,3vw,48px)] pt-[clamp(120px,15vw,180px)] pb-[clamp(72px,9vw,104px)] lg:h-[100dvh] lg:overflow-hidden"
    >
      {/* Top mono strip */}
      <motion.div
        variants={revealStaggerBlocks}
        initial="hidden"
        animate="visible"
        className="flex shrink-0 flex-wrap items-start justify-between gap-x-12 gap-y-3 pb-[clamp(12px,2vw,20px)]"
      >
        <motion.div
          variants={revealBlock}
          className="flex flex-wrap items-start gap-x-12 gap-y-3 text-mono-s text-[color:var(--surface-graphite)]"
        >
          <div className="flex flex-col">
            <span>SILADITYAA SHARMA</span>
            <span>{cs.timeline.split(" — ")[0] ?? cs.timeline}</span>
          </div>
          <div className="flex flex-col">
            <span>{cs.team?.split("·")[0]?.trim().toUpperCase() ?? "META"}</span>
            <span>LOS ANGELES, CA</span>
          </div>
          <div className="flex flex-col">
            <span>
              {cs.tags?.map((t) => t.toUpperCase()).join(" / ") ?? "PROJECT"}
            </span>
            <span>{cs.status === "public" ? "PUBLIC" : "NDA"}</span>
          </div>
        </motion.div>

        <motion.div
          variants={revealBlock}
          className="flex items-center gap-5 text-mono-s text-[color:var(--surface-graphite)]"
        >
          <Link
            href="/#work"
            data-cursor="view"
            className="transition-opacity duration-300 ease-[var(--ease-out-soft)] hover:opacity-60"
          >
            ← BACK
          </Link>
          <span className="tabular-nums">{counter}</span>
          {prevSlug ? (
            <Link
              href={`/work/${prevSlug}`}
              data-cursor="view"
              className="transition-opacity duration-300 ease-[var(--ease-out-soft)] hover:opacity-60"
            >
              ← PREV
            </Link>
          ) : (
            <span className="text-[color:color-mix(in_srgb,var(--surface-graphite)_40%,transparent)]">
              ← PREV
            </span>
          )}
          {nextSlug ? (
            <Link
              href={`/work/${nextSlug}`}
              data-cursor="view"
              className="text-[color:var(--surface-ink)] transition-opacity duration-300 ease-[var(--ease-out-soft)] hover:opacity-60"
            >
              NEXT →
            </Link>
          ) : (
            <Link
              href="/#work"
              data-cursor="view"
              className="transition-opacity duration-300 ease-[var(--ease-out-soft)] hover:opacity-60"
            >
              ALL →
            </Link>
          )}
        </motion.div>
      </motion.div>

      {/* The bento — text card + hero + supporting assets all share one grid */}
      <motion.div
        variants={revealStaggerBlocks}
        initial="hidden"
        animate="visible"
        className="grid min-h-0 flex-1 grid-cols-1 gap-3 lg:grid-cols-7 lg:grid-rows-4"
      >
        {/* TEXT CARD — cols 1-2, rows 1-4 (full height). Permanently filled
            with the project's keyColor so each case study reads as its own
            vibrant brand moment. Title + body force-locked to white so we
            don't depend on the dark/light theme variables. */}
        <motion.div
          variants={revealBlock}
          style={{
            backgroundColor: cs.keyColor,
            borderColor: cs.keyColor,
          }}
          className="flex flex-col gap-5 overflow-y-auto rounded-[4px] border p-6 pb-10 scrollbar-none lg:col-start-1 lg:col-end-3 lg:row-start-1 lg:row-end-5 lg:p-7 lg:pb-12"
        >
          <h1 className="text-display-m italic leading-tight text-white">
            {cs.title}
          </h1>

          {brief && (
            <p className="text-body text-white/85">{brief}</p>
          )}

          <dl className="flex flex-col gap-2 border-t border-white/25 pt-4 text-mono-s">
            <Row label="Role" value={cs.role} />
            {cs.team && <Row label="Team" value={cs.team} />}
            {cs.credits && <Row label="Partners" value={cs.credits} />}
          </dl>
        </motion.div>

        {/* MAIN ASSET — geometry depends on how many bento tiles exist so
            the hero claims any space the supporting tiles don't use. */}
        <BentoTile
          variants={revealBlock}
          className={heroPlacementForCount(bento.length)}
          src={cs.hero?.src}
          alt={cs.hero?.alt ?? cs.title}
          fallback="MAIN ASSET TBD"
        />

        {bentoPlacementsForCount(bento.length).map((placement, i) => (
          <BentoTile
            key={i}
            variants={revealBlock}
            className={placement}
            src={bento[i]?.src}
            alt={bento[i]?.alt ?? `${cs.title} detail ${i + 1}`}
          />
        ))}
      </motion.div>

    </section>
  );
}

/**
 * Hero placement adapts to how many bento tiles exist so it claims any
 * space the supporting tiles don't fill.
 *
 *   0 tiles  → hero spans cols 3–7 (5×4) — full right side
 *   1+ tiles → hero spans cols 3–5 (3×4) — supporting tiles fill cols 6–7
 *
 * Strings are written out in full so Tailwind's JIT picks them up.
 */
function heroPlacementForCount(n: number): string {
  if (n === 0) {
    return "lg:col-start-3 lg:col-end-8 lg:row-start-1 lg:row-end-5";
  }
  return "lg:col-start-3 lg:col-end-6 lg:row-start-1 lg:row-end-5";
}

/**
 * Bento tile placements indexed by tile count. Each layout fills the
 * cols-6/7 right column completely; missing tile slots collapse so the
 * grid never shows empty cells.
 */
function bentoPlacementsForCount(n: number): string[] {
  switch (n) {
    case 0:
      return [];
    case 1:
      // Single tile fills the full right column.
      return ["lg:col-start-6 lg:col-end-8 lg:row-start-1 lg:row-end-5"];
    case 2:
      // Two equal-height stacked tiles.
      return [
        "lg:col-start-6 lg:col-end-8 lg:row-start-1 lg:row-end-3",
        "lg:col-start-6 lg:col-end-8 lg:row-start-3 lg:row-end-5",
      ];
    case 3:
      // Top wide tile + two squares below.
      return [
        "lg:col-start-6 lg:col-end-8 lg:row-start-1 lg:row-end-3",
        "lg:col-start-6 lg:col-end-7 lg:row-start-3 lg:row-end-5",
        "lg:col-start-7 lg:col-end-8 lg:row-start-3 lg:row-end-5",
      ];
    case 4:
    default:
      // Top wide tile, tall portrait, and two stacked squares.
      return [
        "lg:col-start-6 lg:col-end-8 lg:row-start-1 lg:row-end-3",
        "lg:col-start-6 lg:col-end-7 lg:row-start-3 lg:row-end-5",
        "lg:col-start-7 lg:col-end-8 lg:row-start-3 lg:row-end-4",
        "lg:col-start-7 lg:col-end-8 lg:row-start-4 lg:row-end-5",
      ];
  }
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[80px_minmax(0,1fr)] gap-3">
      <dt className="text-white/65">{label.toUpperCase()}</dt>
      <dd className="whitespace-pre-line text-white">{value}</dd>
    </div>
  );
}

interface BentoTileProps {
  src?: string;
  alt: string;
  className?: string;
  fallback?: string;
  variants?: import("framer-motion").Variants;
}

function BentoTile({
  src,
  alt,
  className = "",
  fallback = "—",
  variants,
}: BentoTileProps) {
  return (
    <motion.div
      variants={variants}
      className={`relative min-h-[200px] overflow-hidden rounded-[4px] border border-[color:color-mix(in_srgb,var(--surface-graphite)_15%,transparent)] bg-[color:color-mix(in_srgb,var(--surface-graphite)_8%,transparent)] lg:min-h-0 ${className}`}
    >
      {src ? (
        <MediaFrame src={src} alt={alt} />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-mono-s text-[color:color-mix(in_srgb,var(--surface-graphite)_50%,transparent)]">
          {fallback}
        </div>
      )}
    </motion.div>
  );
}

function MediaFrame({ src, alt }: { src: string; alt: string }) {
  // Strip query strings before sniffing extension so URLs like
  // `https://blob.vercel-storage.com/hero.mp4?token=…` still detect as video.
  const ext = src.split("?")[0].split(".").pop()?.toLowerCase() ?? "";
  if (ext === "mp4" || ext === "webm" || ext === "mov") {
    return (
      <video
        src={src}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
      />
    );
  }
  // External URLs (Vercel Blob, Cloudinary, S3, etc.) bypass Next/Image
  // since they're not in next.config's remotePatterns allowlist.
  if (/^https?:\/\//.test(src)) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        className="absolute inset-0 h-full w-full object-cover"
      />
    );
  }
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes="(min-width: 1024px) 33vw, 100vw"
      className="object-cover"
      // Skip Next.js image optimization for animated formats — re-encoding
      // would strip animation. WebP can be either, so we play it safe.
      unoptimized={ext === "gif" || ext === "webp" || ext === "apng"}
      priority
    />
  );
}
