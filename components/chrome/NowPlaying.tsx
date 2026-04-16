"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { nowPlaying } from "@/content/now";

/**
 * Brief §3 + §4.1 — fixed bottom-left. Cycles through a curated playlist
 * every ~8s, pauses on hover, signal-colored dot ahead of the title.
 */
export function NowPlaying() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const pausedRef = useRef(paused);
  pausedRef.current = paused;
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (nowPlaying.length === 0 || reducedMotion) return;
    const interval = window.setInterval(() => {
      if (pausedRef.current) return;
      setIndex((i) => (i + 1) % nowPlaying.length);
    }, 8000);
    return () => window.clearInterval(interval);
  }, [reducedMotion]);

  if (nowPlaying.length === 0) return null;
  const track = nowPlaying[index];

  return (
    <div
      aria-label="Now playing"
      className="fixed left-[clamp(24px,4vw,64px)] bottom-[clamp(24px,4vw,64px)] z-50 flex items-center gap-2 text-mono-s text-[color:var(--surface-graphite)] transition-opacity duration-300 ease-[var(--ease-out-soft)]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <span
        className="inline-block h-[6px] w-[6px] rounded-full"
        style={{ backgroundColor: "var(--surface-signal)" }}
        aria-hidden
      />
      <span>NOW PLAYING ▸</span>
      <span className="text-[color:var(--surface-ink)]">
        {track.title.toUpperCase()} — {track.artist.toUpperCase()}
      </span>
    </div>
  );
}
