"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import { revealBlock, revealStaggerBlocks } from "@/lib/motion";

/**
 * WIP landing page — interactive playground while the portfolio is being built.
 *
 * Features:
 *  - Parallax mouse-follow headline
 *  - Time-of-day greeting
 *  - Ambient gradient orb
 *  - Animated progress bar
 *  - Interactive dot-grid background (click to stamp nearest dot)
 *  - Rotating status messages
 */
export function WipHero() {
  const [stamps, setStamps] = useState<Stamp[]>([]);
  const nextId = useRef(0);

  function handleStamp(e: React.MouseEvent) {
    const target = e.target as HTMLElement;
    if (target.closest("a, button, canvas, input, [data-no-stamp]")) return;

    const GRID = 24;
    const sx = Math.round(e.clientX / GRID) * GRID;
    const sy = Math.round(e.clientY / GRID) * GRID;

    if (stamps.some((s) => s.x === sx && s.y === sy)) return;

    const stamp: Stamp = { x: sx, y: sy, id: nextId.current++ };
    setStamps((prev) => [...prev.slice(-30), stamp]);

    setTimeout(() => {
      setStamps((prev) => prev.filter((s) => s.id !== stamp.id));
    }, 8000);
  }

  return (
    <>
      {/* Ambient gradient orb */}
      <AmbientOrb />

      {/* Interactive dot-grid background */}
      <DotGrid stamps={stamps} />

      <section
        onClick={handleStamp}
        className="relative z-10 flex h-[100dvh] w-full items-center justify-center pt-[clamp(56px,8vw,120px)] pb-[clamp(56px,8vw,80px)]"
      >
        <div className="mx-auto flex w-full max-w-[1280px] flex-col items-center gap-6 px-[clamp(24px,4vw,64px)] text-center md:gap-14">
          <motion.div
            variants={revealStaggerBlocks}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center gap-5 md:gap-8"
          >
            {/* Mobile clock — inline, hidden on desktop where the fixed chrome shows */}
            <motion.div
              variants={revealBlock}
              className="block text-mono-s text-[color:var(--surface-graphite)] tabular-nums md:hidden"
            >
              <MobileClock />
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={revealBlock}
              className="max-w-[20ch] text-display-xl italic text-[color:var(--surface-ink)]"
            >
              Human-centered product designer — currently focused on wearables
              and AI at Meta.
            </motion.h1>

            {/* Subline */}
            <motion.p
              variants={revealBlock}
              className="text-mono-s text-[color:var(--surface-graphite)]"
            >
              SENIOR PRODUCT DESIGNER · WEARABLES + AI · BASED IN LOS ANGELES
            </motion.p>

            {/* WIP notice + progress */}
            <motion.div
              variants={revealBlock}
              className="flex flex-col items-center gap-4 md:gap-6"
            >
              <div className="flex items-center gap-3">
                <span
                  className="text-mono-s italic text-[color:var(--surface-graphite)]"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Portfolio under construction
                </span>
                <BlinkingCursor />
              </div>
              <div className="w-full max-w-[400px]">
                <ProgressBar />
              </div>
            </motion.div>

            {/* Rotating status */}
            <motion.div variants={revealBlock}>
              <RotatingStatus />
            </motion.div>

          </motion.div>
        </div>
      </section>
    </>
  );
}


/* ================================================================== */
/*  #3 — Ambient gradient orb                                          */
/* ================================================================== */

function AmbientOrb() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* Primary warm orb */}
      <div
        className="absolute h-[80vmax] w-[80vmax] rounded-full opacity-[0.18] blur-[100px]"
        style={{
          background:
            "radial-gradient(circle, var(--surface-signal) 0%, color-mix(in srgb, var(--surface-signal) 40%, transparent) 40%, transparent 70%)",
          top: "30%",
          left: "55%",
          transform: "translate(-50%, -50%)",
          animation: "orbDrift 20s ease-in-out infinite alternate",
        }}
      />
      {/* Secondary softer accent — offset, slower */}
      <div
        className="absolute h-[50vmax] w-[50vmax] rounded-full opacity-[0.10] blur-[120px]"
        style={{
          background:
            "radial-gradient(circle, color-mix(in srgb, var(--surface-signal) 80%, #ff8800) 0%, transparent 65%)",
          top: "60%",
          left: "30%",
          transform: "translate(-50%, -50%)",
          animation: "orbDrift 28s ease-in-out infinite alternate-reverse",
        }}
      />
    </div>
  );
}

/* ================================================================== */
/*  Interactive dot-grid background                                    */
/* ================================================================== */

interface Stamp {
  x: number;
  y: number;
  id: number;
}

function DotGrid({ stamps }: { stamps: Stamp[] }) {
  return (
    <>
      {/* Dot pattern */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          backgroundImage:
            "radial-gradient(color-mix(in srgb, var(--surface-graphite) 15%, transparent) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* Stamp overlay */}
      <div className="pointer-events-none fixed inset-0 z-[5]">
        <AnimatePresence>
          {stamps.map((stamp) => (
            <motion.div
              key={stamp.id}
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: 1, opacity: 0.6 }}
              exit={{ scale: 0.5, opacity: 0, transition: { duration: 0.8 } }}
              transition={{ duration: 0.3 }}
              className="pointer-events-none absolute"
              style={{
                left: stamp.x,
                top: stamp.y,
                transform: "translate(-50%, -50%)",
              }}
            >
              <svg width="20" height="20" viewBox="0 0 20 20">
                <line
                  x1="4"
                  y1="10"
                  x2="16"
                  y2="10"
                  stroke="var(--surface-signal)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <line
                  x1="10"
                  y1="4"
                  x2="10"
                  y2="16"
                  stroke="var(--surface-signal)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </>
  );
}

/* ================================================================== */
/*  Existing sub-components                                            */
/* ================================================================== */

function BlinkingCursor() {
  return (
    <motion.span
      className="ml-1 inline-block text-[color:var(--surface-signal)]"
      animate={{ opacity: [1, 1, 0, 0] }}
      transition={{
        duration: 1.2,
        repeat: Infinity,
        times: [0, 0.49, 0.5, 1],
      }}
      aria-hidden
    >
      _
    </motion.span>
  );
}

function ProgressBar() {
  const [progress, setProgress] = useState(0);
  const target = 73;

  useEffect(() => {
    let frame: number;
    const start = performance.now();
    const duration = 2000;

    function tick(now: number) {
      const elapsed = now - start;
      const t = Math.min(elapsed / duration, 1);
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
      <AnimatePresence mode="wait">
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
      </AnimatePresence>
    </div>
  );
}

/* ================================================================== */
/*  Mobile clock — inline version for small screens                    */
/* ================================================================== */

function MobileClock() {
  const [time, setTime] = useState<string | null>(null);
  const [greeting, setGreeting] = useState("HELLO");

  useEffect(() => {
    const timeFmt = new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Los_Angeles",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    const hourFmt = new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Los_Angeles",
      hour: "numeric",
      hour12: false,
    });

    function tick() {
      setTime(timeFmt.format(new Date()));
      const hour = parseInt(hourFmt.format(new Date()), 10);
      if (hour >= 5 && hour < 12) setGreeting("GOOD MORNING");
      else if (hour >= 12 && hour < 17) setGreeting("GOOD AFTERNOON");
      else if (hour >= 17 && hour < 21) setGreeting("GOOD EVENING");
      else setGreeting("GOOD NIGHT");
    }

    tick();
    const interval = setInterval(tick, 60_000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {greeting} · LAX · {time ?? "--:--"}
    </>
  );
}
