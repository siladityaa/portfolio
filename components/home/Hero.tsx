"use client";

import { Fragment } from "react";
import { motion, useReducedMotion } from "framer-motion";

import { easeOutSoft } from "@/lib/motion";
import { MetaSymbol } from "@/components/chrome/MetaSymbol";

interface HeroProps {
  sentence: string;
  subline: string;
}

/**
 * Brief §4.1 — single sentence in display-xl filling ~80vh, mono subline,
 * bouncing ↓ SCROLL mark in the bottom-right corner.
 *
 * The hero wrapper carries `data-cursor="crosshair"` so the custom cursor
 * swaps to its CAD-style coordinate readout here.
 *
 * Copy is passed in from a server component that reads `content/home.json`
 * via `lib/content-home.ts` — keeps this client component pure and the
 * content CMS-editable. The string `{meta}` in the sentence is replaced
 * inline with the animated Meta infinity symbol (linked to Meta's AI
 * Glasses page) so the JSON stays plain text and editable.
 */
export function Hero({ sentence, subline }: HeroProps) {
  const reducedMotion = useReducedMotion();

  return (
    <section
      data-cursor="crosshair"
      className="relative flex min-h-[100svh] w-full items-start md:min-h-[88vh] md:items-end"
    >
      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-10 px-[clamp(24px,4vw,64px)] pt-[clamp(112px,16vh,220px)] pb-[clamp(120px,16vh,160px)] md:pt-[clamp(120px,20vh,220px)] md:pb-[clamp(60px,8vh,120px)]">
        <div className="flex flex-col gap-6 md:gap-10">
          {/* Each line animates independently rather than via a parent
              stagger — more resilient than relying on staggerChildren
              to cascade across mixed motion-element types. */}
          <Reveal index={0}>
            <span className="text-display-s italic text-[color:var(--surface-graphite)] max-md:text-[1.25rem]">
              Hi, I&rsquo;m Siladityaa Sharma
            </span>
          </Reveal>

          <Reveal index={1}>
            <h1 className="max-w-[34ch] text-display-l italic text-[color:var(--surface-ink)] max-md:text-[2rem] max-md:leading-[1.08]">
              {renderSentence(sentence)}
            </h1>
          </Reveal>

          <Reveal index={2}>
            <p className="text-label-s text-[color:var(--surface-graphite)]">
              {subline}
            </p>
          </Reveal>
        </div>
      </div>

      {/* ↓ SCROLL mark, bottom-right of the hero block. Hidden on mobile
          where it would overlap the subline and the centered NowPlaying
          widget. Animation pauses when reduced motion is requested. */}
      <motion.span
        aria-hidden
        className="absolute right-[clamp(24px,4vw,64px)] bottom-[clamp(80px,10vh,140px)] hidden text-label-s text-[color:var(--surface-graphite)] md:inline-block"
        animate={reducedMotion ? undefined : { y: [0, 3, 0] }}
        transition={
          reducedMotion
            ? undefined
            : { duration: 2, repeat: Infinity, ease: easeOutSoft }
        }
      >
        ↓ Scroll
      </motion.span>
    </section>
  );
}

/**
 * Per-element fade-in. Each Reveal animates from y:24/opacity:0 → resting
 * after a small index-derived delay. Independent animations dodge the
 * staggerChildren-cascade edge case that left the h1 stuck at opacity 0
 * when more than two children share a parent stagger container.
 */
function Reveal({
  index,
  children,
}: {
  index: number;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
        delay: 0.1 + index * 0.12,
      }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Splits the headline on `{meta}` and renders the animated, linked Meta
 * symbol in place of each occurrence.
 */
function renderSentence(sentence: string) {
  const parts = sentence.split("{meta}");
  return parts.map((chunk, i) => (
    <Fragment key={i}>
      {chunk}
      {i < parts.length - 1 && (
        <a
          href="https://www.meta.com/ai-glasses/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Meta AI Glasses"
          data-cursor="open"
          className="inline-block transition-opacity duration-300 ease-[var(--ease-out-soft)] hover:opacity-70"
        >
          <MetaSymbol />
        </a>
      )}
    </Fragment>
  ));
}
