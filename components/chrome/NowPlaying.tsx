"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { nowPlaying as curatedFallback } from "@/content/now";
import type { NowPlayingResponse } from "@/app/api/now-playing/route";

/**
 * Brief §3 + §4.1 — fixed bottom-left NowPlaying widget.
 *
 * Reads from `/api/now-playing`, which walks a 3-step fallback chain
 * (pinned → Last.fm → curated). Polls every 60s while the tab is visible
 * so a new scrobble surfaces within a minute of hitting Last.fm.
 *
 * The icon doubles as a mute/unmute control when the API returns a 30-second
 * iTunes preview URL. Tap the muted-speaker icon → preview plays unmuted;
 * tap again → silenced. The preview self-terminates after 30s and the icon
 * flips back to muted. Audio halts on route change, tab blur, or widget
 * unmount — we never leak audio into a navigation the user didn't opt into.
 *
 * First paint is seeded from the curated list imported at build time so
 * the widget never renders empty; the live fetch swaps in under a second.
 */

const POLL_INTERVAL_MS = 60_000;

/** Initial state shown between first paint and the first API response. */
const INITIAL: NowPlayingResponse = {
  source: "curated",
  track: {
    title: curatedFallback[0]?.title ?? "",
    artist: curatedFallback[0]?.artist ?? "",
    album: curatedFallback[0]?.album ?? "",
  },
  nowPlaying: false,
  playedAt: null,
  previewUrl: null,
  imageUrl: null,
};

/**
 * Humanize a scrobble timestamp into the mono-prefix copy the widget uses.
 *
 *   nowPlaying live      → "NOW PLAYING"
 *   < 2 min ago          → "JUST NOW"
 *   < 60 min ago         → "12M AGO"
 *   < 24 h ago           → "3H AGO"
 *   < 7 d ago            → "YESTERDAY" / "TUE" / etc.
 *   older (unusual)      → "APR 12"
 *   pinned override      → "ON REPEAT"
 *   curated fallback     → "LISTENING"
 */
function humanizePrefix(data: NowPlayingResponse, now: number): string {
  if (data.source === "pinned") return "ON REPEAT";
  if (data.nowPlaying) return "NOW PLAYING";
  if (data.source === "curated" || data.playedAt === null) return "LISTENING";
  const deltaSec = now - data.playedAt;
  if (deltaSec < 120) return "JUST NOW";
  if (deltaSec < 3_600) return `${Math.round(deltaSec / 60)}M AGO`;
  if (deltaSec < 86_400) return `${Math.round(deltaSec / 3_600)}H AGO`;
  if (deltaSec < 7 * 86_400) {
    const d = new Date(data.playedAt * 1000);
    const today = new Date(now * 1000);
    if (d.getDate() === today.getDate() - 1) return "YESTERDAY";
    return d.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase();
  }
  const d = new Date(data.playedAt * 1000);
  return d
    .toLocaleDateString("en-US", { month: "short", day: "numeric" })
    .toUpperCase();
}

/* -------------------------------------------------------------------------- */
/* Icons — tiny inline SVGs, inherit `currentColor`.                          */
/*                                                                            */
/* Drawn on a 16-unit grid for clean hairlines at the 14px display size. The  */
/* speaker body is the same in both states; the difference is the slash (off) */
/* vs the single wave arc (on). Single wave (not two) because a second arc    */
/* disappears into noise at 14px.                                             */
/* -------------------------------------------------------------------------- */

function SpeakerMutedIcon() {
  return (
    <svg
      aria-hidden
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 6 h2 l3 -2.5 v9 l-3 -2.5 H3 Z" fill="currentColor" />
      <path d="M10.5 6 L14 9.5 M14 6 L10.5 9.5" />
    </svg>
  );
}

function SpeakerUnmutedIcon() {
  return (
    <svg
      aria-hidden
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 6 h2 l3 -2.5 v9 l-3 -2.5 H3 Z" fill="currentColor" />
      <path d="M11 5.5 a3 3 0 0 1 0 5" />
      <path d="M13 3.5 a5.5 5.5 0 0 1 0 9" />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */

export function NowPlaying() {
  const [data, setData] = useState<NowPlayingResponse>(INITIAL);
  const [isPlaying, setIsPlaying] = useState(false);
  /** `Date.now()/1000` snapshot re-read each poll so relative-time copy
   *  updates without state-churning every render. */
  const [nowSec, setNowSec] = useState(() => Math.floor(Date.now() / 1000));
  const pathname = usePathname();

  const audioRef = useRef<HTMLAudioElement | null>(null);

  /* ------------------------------------------------------------------ */
  /* Data fetch — mount + 60s poll, paused while tab hidden.            */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    let cancelled = false;
    let timer: number | null = null;

    const refresh = async () => {
      try {
        const res = await fetch("/api/now-playing", { cache: "no-store" });
        if (!res.ok) return;
        const body: NowPlayingResponse = await res.json();
        if (cancelled) return;
        setData(body);
        setNowSec(Math.floor(Date.now() / 1000));
      } catch {
        // Swallow — next poll tries again. Widget keeps rendering stale data.
      }
    };

    const start = () => {
      if (timer !== null) return;
      refresh();
      timer = window.setInterval(refresh, POLL_INTERVAL_MS);
    };
    const stop = () => {
      if (timer !== null) {
        clearInterval(timer);
        timer = null;
      }
    };

    const onVisibility = () => {
      if (document.hidden) stop();
      else start();
    };

    start();
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      cancelled = true;
      stop();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  /* ------------------------------------------------------------------ */
  /* Audio lifecycle — stop on nav, unmount, track change, tab hide.    */
  /* ------------------------------------------------------------------ */
  const muteAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
  }, []);

  // Halt audio when the route changes (widget itself lives in the site
  // layout and never unmounts across page nav).
  useEffect(() => {
    muteAudio();
  }, [pathname, muteAudio]);

  // Halt audio when the track changes — new preview URL means the old
  // `<audio>` element is stale.
  useEffect(() => {
    muteAudio();
  }, [data.previewUrl, muteAudio]);

  useEffect(() => {
    const onVisibility = () => {
      if (document.hidden) muteAudio();
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [muteAudio]);

  // Unmount cleanup.
  useEffect(() => {
    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, []);

  /* ------------------------------------------------------------------ */
  /* Tap-to-(un)mute.                                                   */
  /* ------------------------------------------------------------------ */
  const previewUrl = data.previewUrl;
  const canPlay = Boolean(previewUrl && data.track.title);

  const handleToggle = useCallback(() => {
    if (!canPlay || !previewUrl) return;
    if (isPlaying) {
      muteAudio();
      return;
    }
    // Lazy-create (or re-create on URL change). Creating the element
    // synchronously inside the click handler keeps iOS Safari's autoplay
    // policy happy — `audio.play()` returns a Promise we can .catch().
    if (!audioRef.current || audioRef.current.src !== previewUrl) {
      audioRef.current = new Audio(previewUrl);
      audioRef.current.preload = "auto";
      audioRef.current.addEventListener("ended", () => {
        setIsPlaying(false);
      });
      audioRef.current.addEventListener("error", () => {
        setIsPlaying(false);
      });
    }
    const playPromise = audioRef.current.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        setIsPlaying(false);
      });
    }
    setIsPlaying(true);
  }, [canPlay, isPlaying, muteAudio, previewUrl]);

  /* ------------------------------------------------------------------ */
  /* Render.                                                            */
  /* ------------------------------------------------------------------ */
  const prefix = useMemo(() => humanizePrefix(data, nowSec), [data, nowSec]);

  if (!data.track.title) return null;

  const trackLabel = `${data.track.title} — ${data.track.artist}`;
  const ariaLabel = isPlaying
    ? `Mute preview of ${trackLabel}`
    : `Unmute 30-second preview of ${trackLabel}`;

  return (
    <div
      aria-label="Now playing"
      className="fixed left-[clamp(24px,4vw,64px)] bottom-[clamp(24px,4vw,64px)] z-50 flex items-center gap-2 text-mono-s text-[color:var(--surface-graphite)] transition-opacity duration-300 ease-[var(--ease-out-soft)]"
    >
      {canPlay ? (
        <button
          type="button"
          onClick={handleToggle}
          aria-label={ariaLabel}
          aria-pressed={isPlaying}
          className="inline-flex items-center justify-center transition-transform duration-200 ease-[var(--ease-out-soft)] hover:scale-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--surface-ink)]"
          style={{
            // Unmuted = signal color (active beat); muted = graphite (quiet
            // affordance, blends with the "NOW PLAYING ▸" label).
            color: isPlaying
              ? "var(--surface-signal)"
              : "var(--surface-graphite)",
          }}
        >
          {isPlaying ? <SpeakerUnmutedIcon /> : <SpeakerMutedIcon />}
        </button>
      ) : (
        // Preserve the original signal dot when no preview is available,
        // so the widget's visual anchor still reads even in the fallback.
        <span
          aria-hidden
          className="inline-block h-[6px] w-[6px] rounded-full"
          style={{ background: "var(--surface-signal)" }}
        />
      )}
      <span>{prefix} ▸</span>
      <span className="text-[color:var(--surface-ink)]">
        {data.track.title.toUpperCase()} — {data.track.artist.toUpperCase()}
      </span>
    </div>
  );
}
