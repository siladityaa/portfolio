"use client";

import { useReducedMotion, type Variants, type Transition } from "framer-motion";

/**
 * The one easing curve, used everywhere.
 * Source: portfolio_build_plan.md §2.5.
 * Do not inline this anywhere — import from here.
 */
export const easeOutSoft: [number, number, number, number] = [0.22, 1, 0.36, 1];

export const durations = {
  micro: 0.3,
  meso: 0.6,
  macro: 0.9,
} as const;

const baseTransition: Transition = {
  ease: easeOutSoft,
  duration: durations.meso,
};

/**
 * Text reveal — rises 12px + fades in. Stagger handled by the parent `revealStagger`.
 */
export const revealText: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: baseTransition,
  },
};

/**
 * Block reveal — bigger moves for full sections. Used for hero, section heads.
 */
export const revealBlock: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { ...baseTransition, duration: durations.macro },
  },
};

/**
 * Stagger containers — 40ms for word-level, 120ms for block-level (brief §2.5).
 */
export const revealStaggerWords: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.05,
    },
  },
};

export const revealStaggerBlocks: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

/**
 * Hook that returns motion variants respecting prefers-reduced-motion.
 * When reduced motion is on, returns a "no-op" variants object so elements
 * render in their final state immediately (no rise, no fade).
 */
export function useMotionSafe<T extends Variants>(variants: T): T {
  const reduced = useReducedMotion();
  if (!reduced) return variants;

  // Build a flattened variants object where every state is the resting state.
  const safe: Record<string, unknown> = {};
  for (const key of Object.keys(variants)) {
    safe[key] = { opacity: 1, y: 0, x: 0, transition: { duration: 0 } };
  }
  return safe as T;
}
