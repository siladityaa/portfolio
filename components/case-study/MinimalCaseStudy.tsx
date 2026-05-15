"use client";

import Link from "next/link";
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
 * Editorial long-scroll case study, sized for read-through rather than
 * single-frame consumption. Order:
 *
 *   1. Top mono nav strip
 *   2. Rich hero block — title, role pills, timeline, team, tags
 *   3. Overview paragraph (the brief, full-width body text)
 *   4. Hero asset (boxed, generous max-width)
 *   5. Optional metrics row — up to 4 big numbers
 *   6. Optional body sections — heading + paragraph repeating
 *   7. Optional gallery — additional assets stacked vertically
 *   8. Footer — back link + prev/next nav
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
  const roles = cs.role
    .split(/\n|·|·|\//)
    .map((r) => r.trim())
    .filter(Boolean);

  return (
    <article
      data-cursor="default"
      className="mx-auto w-full max-w-[1100px] px-[clamp(20px,4vw,64px)] pt-[clamp(96px,11vw,140px)] pb-[clamp(96px,12vw,160px)]"
    >
      {/* ── 1. Top nav strip ──────────────────────────────────────────── */}
      <motion.div
        variants={revealStaggerBlocks}
        initial="hidden"
        animate="visible"
        className="flex flex-wrap items-center justify-between gap-4 pb-[clamp(48px,7vw,96px)]"
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
          {counter}
        </motion.span>
      </motion.div>

      {/* ── 2. Hero block ─────────────────────────────────────────────── */}
      <motion.header
        variants={revealStaggerBlocks}
        initial="hidden"
        animate="visible"
        className="flex flex-col gap-8"
      >
        <motion.h1
          variants={revealBlock}
          className="text-display-xl italic leading-[1.02] text-[color:var(--surface-ink)]"
        >
          {cs.title}
        </motion.h1>

        {(roles.length > 0 || cs.tags?.length) && (
          <motion.div
            variants={revealBlock}
            className="flex flex-wrap gap-2"
          >
            {roles.map((r) => (
              <Pill key={`role-${r}`}>{r}</Pill>
            ))}
            {cs.tags?.map((t) => (
              <Pill key={`tag-${t}`}>{t.toUpperCase()}</Pill>
            ))}
          </motion.div>
        )}

        <motion.dl
          variants={revealBlock}
          className="grid grid-cols-1 gap-y-3 border-t border-[color:color-mix(in_srgb,var(--surface-graphite)_15%,transparent)] pt-6 text-mono-s sm:grid-cols-[120px_minmax(0,1fr)] sm:gap-x-6"
        >
          <MetaRow label="Timeline" value={cs.timeline} />
          {cs.team && <MetaRow label="Team" value={cs.team} />}
          {cs.credits && <MetaRow label="Partners" value={cs.credits} />}
        </motion.dl>
      </motion.header>

      {/* ── 3. Overview paragraph + optional asset ──────────────────── */}
      {brief && (
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mt-[clamp(64px,9vw,128px)]"
        >
          <Eyebrow>OVERVIEW</Eyebrow>
          <p className="mt-6 max-w-[68ch] text-display-s text-[color:var(--surface-ink)]">
            {brief}
          </p>
          {cs.overviewMedia?.src && (
            <MediaFigure
              src={cs.overviewMedia.src}
              alt={cs.overviewMedia.alt ?? `${cs.title} overview`}
              caption={cs.overviewMedia.caption}
              className="mt-10"
            />
          )}
        </motion.section>
      )}

      {/* ── 4. Hero asset ─────────────────────────────────────────────── */}
      {cs.hero?.src && (
        <motion.figure
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="mt-[clamp(64px,9vw,128px)] overflow-hidden rounded-[6px] bg-[color:color-mix(in_srgb,var(--surface-graphite)_8%,transparent)]"
        >
          <MediaFrame
            src={cs.hero.src}
            alt={cs.hero.alt ?? cs.title}
          />
          {cs.hero.caption && (
            <figcaption className="px-5 py-3 text-mono-s text-[color:var(--surface-graphite)]">
              {cs.hero.caption}
            </figcaption>
          )}
        </motion.figure>
      )}

      {/* ── 5. Metrics ────────────────────────────────────────────────── */}
      {cs.metrics && cs.metrics.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mt-[clamp(72px,10vw,144px)]"
        >
          <Eyebrow>BY THE NUMBERS</Eyebrow>
          <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
            {cs.metrics.map((m, i) => (
              <div key={i} className="flex flex-col gap-2">
                <span className="text-display-l italic leading-none text-[color:var(--surface-ink)]">
                  {m.value}
                </span>
                <span className="text-mono-s text-[color:var(--surface-graphite)]">
                  {m.label}
                </span>
              </div>
            ))}
          </div>
        </motion.section>
      )}

      {/* ── 6. Body sections ──────────────────────────────────────────── */}
      {cs.body && cs.body.length > 0 && (
        <div className="mt-[clamp(72px,10vw,144px)] flex flex-col gap-[clamp(56px,8vw,96px)]">
          {cs.body.map((sec, i) => (
            <motion.section
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1],
                delay: 0.05,
              }}
              className="grid grid-cols-1 gap-6 md:grid-cols-[200px_minmax(0,1fr)] md:gap-12"
            >
              <Eyebrow>{String(i + 1).padStart(2, "0")} — {sec.heading.toUpperCase()}</Eyebrow>
              <div className="flex flex-col gap-5">
                <h2 className="text-display-m italic leading-tight text-[color:var(--surface-ink)]">
                  {sec.heading}
                </h2>
                <p className="max-w-[68ch] whitespace-pre-line text-body text-[color:var(--surface-ink)]">
                  {sec.body}
                </p>
                {sec.media && sec.media.length > 0 && (
                  <div
                    className={
                      sec.media.length > 1
                        ? "mt-4 grid grid-cols-1 gap-4 md:grid-cols-2"
                        : "mt-4"
                    }
                  >
                    {sec.media
                      .filter((m) => m.src)
                      .map((m, mi) => (
                        <MediaFigure
                          key={mi}
                          src={m.src}
                          alt={m.alt ?? `${sec.heading} asset ${mi + 1}`}
                          caption={m.caption}
                        />
                      ))}
                  </div>
                )}
              </div>
            </motion.section>
          ))}
        </div>
      )}

      {/* ── 7. Gallery (additional assets) ────────────────────────────── */}
      {cs.gallery && cs.gallery.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mt-[clamp(72px,10vw,144px)]"
        >
          <Eyebrow>SELECTED ASSETS</Eyebrow>
          <div className="mt-8 flex flex-col gap-[clamp(32px,5vw,64px)]">
            {cs.gallery.map((g, i) => (
              <figure
                key={i}
                className="overflow-hidden rounded-[6px] bg-[color:color-mix(in_srgb,var(--surface-graphite)_8%,transparent)]"
              >
                <MediaFrame
                  src={g.src}
                  alt={g.alt ?? `${cs.title} detail ${i + 1}`}
                />
                {g.caption && (
                  <figcaption className="px-5 py-3 text-mono-s text-[color:var(--surface-graphite)]">
                    {g.caption}
                  </figcaption>
                )}
              </figure>
            ))}
          </div>
        </motion.section>
      )}

      {/* ── 8. Footer nav ─────────────────────────────────────────────── */}
      <motion.nav
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6 }}
        className="mt-[clamp(96px,12vw,160px)] flex flex-wrap items-center justify-between gap-4 border-t border-[color:color-mix(in_srgb,var(--surface-graphite)_15%,transparent)] pt-6"
      >
        <Link
          href="/#work"
          data-cursor="view"
          className="text-mono-s text-[color:var(--surface-graphite)] transition-opacity duration-300 ease-[var(--ease-out-soft)] hover:opacity-60"
        >
          ← ALL WORK
        </Link>
        <div className="flex items-center gap-5 text-mono-s">
          {prevSlug ? (
            <Link
              href={`/work/${prevSlug}`}
              data-cursor="view"
              className="text-[color:var(--surface-graphite)] transition-opacity duration-300 ease-[var(--ease-out-soft)] hover:opacity-60"
            >
              ← PREVIOUS
            </Link>
          ) : (
            <span className="text-[color:color-mix(in_srgb,var(--surface-graphite)_40%,transparent)]">
              ← PREVIOUS
            </span>
          )}
          {nextSlug ? (
            <Link
              href={`/work/${nextSlug}`}
              data-cursor="view"
              className="text-[color:var(--surface-ink)] transition-opacity duration-300 ease-[var(--ease-out-soft)] hover:opacity-60"
            >
              NEXT PROJECT →
            </Link>
          ) : (
            <Link
              href="/#work"
              data-cursor="view"
              className="text-[color:var(--surface-ink)] transition-opacity duration-300 ease-[var(--ease-out-soft)] hover:opacity-60"
            >
              ALL WORK →
            </Link>
          )}
        </div>
      </motion.nav>
    </article>
  );
}

/* -------------------------------------------------------------------------- */

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-[color:color-mix(in_srgb,var(--surface-graphite)_25%,transparent)] px-3 py-1 text-mono-s text-[color:var(--surface-graphite)]">
      {children}
    </span>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-mono-s text-[color:var(--surface-graphite)]">
      {children}
    </span>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <>
      <dt className="text-[color:var(--surface-graphite)]">
        {label.toUpperCase()}
      </dt>
      <dd className="whitespace-pre-line text-[color:var(--surface-ink)]">
        {value}
      </dd>
    </>
  );
}

/**
 * Boxed media block — image, gif, or video. Used for both the hero asset
 * and the inline media inside body sections. The container handles the
 * subtle bg + rounded corners; MediaFrame handles the actual asset
 * element so it can be reused everywhere.
 */
function MediaFigure({
  src,
  alt,
  caption,
  className = "",
}: {
  src: string;
  alt: string;
  caption?: string;
  className?: string;
}) {
  return (
    <figure
      className={`overflow-hidden rounded-[6px] bg-[color:color-mix(in_srgb,var(--surface-graphite)_8%,transparent)] ${className}`}
    >
      <MediaFrame src={src} alt={alt} />
      {caption && (
        <figcaption className="px-5 py-3 text-mono-s text-[color:var(--surface-graphite)]">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

/**
 * Toggle: while we're still designing the case study layout without
 * final artwork, every MediaFrame renders as an empty 16:9 placeholder
 * (a graphite-tinted rectangle with a photo icon) regardless of what
 * `src` it was given. Flip `PLACEHOLDERS_ON` to `false` to restore the
 * real assets.
 */
const PLACEHOLDERS_ON = true;

function MediaFrame({ src, alt }: { src: string; alt: string }) {
  if (PLACEHOLDERS_ON) {
    return <PlaceholderRect alt={alt} />;
  }

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
        className="block h-auto w-full"
      />
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className="block h-auto w-full"
      loading="lazy"
    />
  );
}

/**
 * Empty 16:9 stand-in for case-study media. Subtle paper-on-graphite
 * tint + sparse dot grid + a centered photo icon, so the layout reads
 * intentionally placeholder rather than broken.
 */
function PlaceholderRect({ alt }: { alt?: string }) {
  const bg = `radial-gradient(circle, color-mix(in srgb, var(--surface-graphite) 22%, transparent) 1px, transparent 1px) 0 0 / 18px 18px,
       color-mix(in srgb, var(--surface-graphite) 8%, var(--surface-paper))`;
  return (
    <div
      role="img"
      aria-label={alt || "Image placeholder"}
      className="flex w-full items-center justify-center"
      style={{ aspectRatio: "16 / 9", background: bg }}
    >
      <PhotoIcon />
    </div>
  );
}

function PhotoIcon() {
  return (
    <svg
      aria-hidden
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      stroke="color-mix(in srgb, var(--surface-graphite) 70%, transparent)"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="5" width="18" height="14" rx="1.5" />
      <circle cx="8.5" cy="10" r="1.25" />
      <path d="m3 16 4.5-4 4 3.5L16 11l5 4.5" />
    </svg>
  );
}
