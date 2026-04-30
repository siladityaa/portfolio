"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

import { easeOutSoft, revealBlock, revealStaggerBlocks } from "@/lib/motion";

/**
 * WIP landing page — keeps the design system personality while signaling
 * the site is under construction.
 *
 * Keeps:
 *  - Instrument Serif display + JetBrains Mono labels
 *  - paper/ink/graphite/signal palette
 *  - crosshair cursor zone
 *  - the four-corner chrome (Wordmark, NavLinks with RESUME, NowPlaying, Clock)
 *
 * Adds:
 *  - A blinking cursor after "under construction" (hardware-panel feel)
 *  - A progress bar with a percentage that creeps up
 *  - A playful rotating status line
 */
export function WipHero() {
  const reducedMotion = useReducedMotion();

  return (
    <section
      data-cursor="crosshair"
      className="relative flex min-h-[100vh] w-full items-center justify-center"
    >
      <div className="mx-auto flex w-full max-w-[1280px] flex-col items-center gap-16 px-[clamp(24px,4vw,64px)] text-center">
        <motion.div
          variants={revealStaggerBlocks}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center gap-10"
        >
          {/* Main heading */}
          <motion.div variants={revealBlock} className="flex flex-col items-center gap-4">
            <span className="text-mono-s text-[color:var(--surface-graphite)]">
              SILADITYAA SHARMA
            </span>
            <h1 className="max-w-[20ch] text-display-xl italic text-[color:var(--surface-ink)]">
              Portfolio under construction
              <BlinkingCursor />
            </h1>
          </motion.div>

          {/* Subline */}
          <motion.p
            variants={revealBlock}
            className="text-mono-s text-[color:var(--surface-graphite)]"
          >
            SENIOR PRODUCT DESIGNER · WEARABLES + AI · META REALITY LABS
          </motion.p>

          {/* Progress bar */}
          <motion.div variants={revealBlock} className="w-full max-w-[400px]">
            <ProgressBar />
          </motion.div>

          {/* Rotating status */}
          <motion.div variants={revealBlock}>
            <RotatingStatus />
          </motion.div>

          {/* Contact */}
          <motion.div
            variants={revealBlock}
            className="flex flex-col items-center gap-3"
          >
            <a
              href="mailto:siladityaa@gmail.com"
              data-cursor="open"
              className="inline-flex items-center gap-2 border border-[color:var(--surface-ink)] px-6 py-3 text-mono-s text-[color:var(--surface-ink)] transition-colors duration-300 ease-[var(--ease-out-soft)] hover:bg-[color:var(--surface-ink)] hover:text-[color:var(--surface-paper)]"
            >
              <span
                className="inline-block h-[7px] w-[7px] rounded-full"
                style={{ backgroundColor: "var(--surface-signal)" }}
              />
              SAY HELLO
            </a>
            <span className="text-mono-s text-[color:color-mix(in_srgb,var(--surface-graphite)_60%,transparent)]">
              OR CHECK BACK SOON
            </span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

/** Blinking underscore cursor — hardware terminal vibes */
function BlinkingCursor() {
  return (
    <motion.span
      className="ml-1 inline-block text-[color:var(--surface-signal)]"
      animate={{ opacity: [1, 1, 0, 0] }}
      transition={{ duration: 1.2, repeat: Infinity, times: [0, 0.49, 0.5, 1] }}
      aria-hidden
    >
      _
    </motion.span>
  );
}

/** Creeping progress bar with a percentage readout */
function ProgressBar() {
  const [progress, setProgress] = useState(0);
  const target = 73; // intentionally not 100 — site is WIP

  useEffect(() => {
    let frame: number;
    const start = performance.now();
    const duration = 2000;

    function tick(now: number) {
      const elapsed = now - start;
      const t = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - t, 3);
      setProgress(Math.round(eased * target));
      if (t < 1) frame = requestAnimationFrame(tick);
    }

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between text-mono-s text-[color:var(--surface-graphite)]">
        <span>BUILD PROGRESS</span>
        <span>{progress}%</span>
      </div>
      <div className="h-[3px] w-full overflow-hidden rounded-full bg-[color:color-mix(in_srgb,var(--surface-graphite)_20%,transparent)]">
        <motion.div
          className="h-full rounded-full bg-[color:var(--surface-signal)]"
          initial={{ width: "0%" }}
          animate={{ width: `${target}%` }}
          transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </div>
  );
}

/** Rotating engineer-style status messages */
function RotatingStatus() {
  const messages = [
    "CALIBRATING DESIGN TOKENS...",
    "ALIGNING PIXELS TO GRID...",
    "REFINING CASE STUDIES...",
    "KERNING INSTRUMENT SERIF...",
    "LOADING INFLUENCES...",
    "TUNING MICRO-INTERACTIONS...",
    "OBSESSING OVER WHITESPACE...",
    "SHIPPING SOON™...",
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % messages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [messages.length]);

  return (
    <div className="flex items-center gap-3">
      <motion.span
        className="inline-block h-2 w-2 rounded-full bg-[color:var(--surface-signal)]"
        animate={{ scale: [1, 1.3, 1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
      <motion.span
        key={index}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.3 }}
        className="text-mono-s text-[color:var(--surface-graphite)]"
      >
        {messages[index]}
      </motion.span>
    </div>
  );
}
