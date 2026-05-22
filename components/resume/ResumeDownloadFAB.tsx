"use client";

import { useCallback, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type Phase = "idle" | "working" | "done";

/** Minimum time the "working" state is shown, so the orange sweep always
 *  reads even when PDF generation finishes near-instantly. */
const MIN_WORKING_MS = 1100;
/** How long the "SAVED" confirmation holds before resetting to idle. */
const DONE_HOLD_MS = 1600;

/**
 * Floating "Download PDF" button with a two-part micro-interaction:
 *
 *   1. Arrow drop  — on click the ↓ icon detaches and slides out the
 *      bottom of the pill (clipped by overflow-hidden).
 *   2. Sweep → check — a signal-orange fill sweeps the pill left-to-right
 *      while the PDF generates, then the icon resolves to a checkmark
 *      with a tick-pop and the label flips to SAVED.
 *
 * The sweep doubles as genuine status feedback — PDF generation is the
 * thing actually happening underneath.
 */
export function ResumeDownloadFAB() {
  const [phase, setPhase] = useState<Phase>("idle");

  const handleDownload = useCallback(async () => {
    if (phase !== "idle") return;
    setPhase("working");

    const minDelay = new Promise((r) => setTimeout(r, MIN_WORKING_MS));
    try {
      const { generateResumePDF } = await import("@/lib/resume-pdf");
      generateResumePDF();
    } catch (err) {
      console.error("PDF generation failed:", err);
      await minDelay;
      setPhase("idle");
      return;
    }
    await minDelay;
    setPhase("done");
    setTimeout(() => setPhase("idle"), DONE_HOLD_MS);
  }, [phase]);

  const label =
    phase === "working"
      ? "GENERATING"
      : phase === "done"
        ? "SAVED"
        : "DOWNLOAD PDF";

  return (
    <motion.button
      type="button"
      onClick={handleDownload}
      disabled={phase !== "idle"}
      data-cursor="open"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="fixed bottom-[calc(clamp(24px,4vw,64px)+40px)] right-[clamp(24px,4vw,64px)] z-40 flex items-center gap-2.5 overflow-hidden rounded-full bg-[color:var(--surface-ink)] px-5 py-3 text-mono-s text-[color:var(--surface-paper)] shadow-lg transition-transform duration-300 ease-[var(--ease-out-soft)] hover:scale-105 active:scale-95 disabled:cursor-default"
    >
      {/* Signal-orange progress sweep — fills L→R while working, holds
          through done, fades out on reset. */}
      <motion.span
        aria-hidden
        className="pointer-events-none absolute inset-0 origin-left bg-[color:var(--surface-signal)]"
        initial={false}
        animate={{
          scaleX: phase === "idle" ? 0 : 1,
          opacity: phase === "idle" ? 0 : 1,
        }}
        transition={{
          scaleX: {
            duration: phase === "working" ? MIN_WORKING_MS / 1000 : 0,
            ease: [0.4, 0, 0.2, 1],
          },
          opacity: { duration: 0.35, ease: "easeOut" },
        }}
      />

      {/* Icon slot — fixed size so the label never shifts. */}
      <span className="relative z-10 inline-flex h-[14px] w-[14px] items-center justify-center">
        <AnimatePresence mode="wait" initial={false}>
          {phase === "idle" && (
            <motion.span
              key="download"
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 22, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            >
              <DownloadIcon />
            </motion.span>
          )}
          {phase === "working" && (
            <motion.span
              key="spinner"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Spinner />
            </motion.span>
          )}
          {phase === "done" && (
            <motion.span
              key="check"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 520, damping: 13 }}
            >
              <CheckIcon />
            </motion.span>
          )}
        </AnimatePresence>
      </span>

      {/* Label — swaps with a small cross-fade per phase. */}
      <span className="relative z-10 inline-block">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={label}
            initial={{ y: 6, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -6, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="block whitespace-nowrap"
          >
            {label}
          </motion.span>
        </AnimatePresence>
      </span>
    </motion.button>
  );
}

function DownloadIcon() {
  return (
    <svg
      aria-hidden
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 2 v8 M4.5 7.5 L8 11 L11.5 7.5" />
      <path d="M3 13 h10" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      aria-hidden
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3.5 8.5 L6.5 11.5 L12.5 4.5" />
    </svg>
  );
}

/** Minimal rotating-arc spinner, sized to the 14px icon slot. */
function Spinner() {
  return (
    <motion.svg
      aria-hidden
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      animate={{ rotate: 360 }}
      transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }}
    >
      <circle
        cx="8"
        cy="8"
        r="6"
        stroke="currentColor"
        strokeOpacity="0.3"
        strokeWidth="1.75"
      />
      <path
        d="M8 2 a6 6 0 0 1 6 6"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </motion.svg>
  );
}
