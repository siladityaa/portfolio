"use client";

import { Fragment } from "react";
import { motion, useReducedMotion } from "framer-motion";

import { easeOutSoft, revealBlock, revealStaggerBlocks } from "@/lib/motion";
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
      className="relative flex min-h-[88vh] w-full items-end"
    >
      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-10 px-[clamp(24px,4vw,64px)] pt-[clamp(120px,20vh,220px)] pb-[clamp(60px,8vh,120px)]">
        <motion.div
          variants={revealStaggerBlocks}
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-10"
        >
          <motion.h1
            variants={revealBlock}
            className="max-w-[26ch] text-display-xl italic text-[color:var(--surface-ink)]"
          >
            {renderSentence(sentence)}
          </motion.h1>

          <motion.p
            variants={revealBlock}
            className="text-mono-s text-[color:var(--surface-graphite)]"
          >
            {subline}
          </motion.p>
        </motion.div>
      </div>

      {/* ↓ SCROLL mark, bottom-right of the hero block. Animation pauses
          when the user has requested reduced motion. */}
      <motion.span
        aria-hidden
        className="absolute right-[clamp(24px,4vw,64px)] bottom-[clamp(80px,10vh,140px)] text-mono-s text-[color:var(--surface-graphite)]"
        animate={reducedMotion ? undefined : { y: [0, 3, 0] }}
        transition={
          reducedMotion
            ? undefined
            : { duration: 2, repeat: Infinity, ease: easeOutSoft }
        }
      >
        ↓ SCROLL
      </motion.span>
    </section>
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
