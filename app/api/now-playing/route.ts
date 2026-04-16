/**
 * GET /api/now-playing
 *
 * Resolves the single track to show in the site-chrome NowPlaying widget.
 *
 * Fallback chain (first hit wins):
 *   1. `pinned` in content/now.json    → editorial override ("album of the week")
 *   2. Last.fm most-recent scrobble     → live data
 *   3. content/now.json `nowPlaying[0]` → curated fallback (offline dev, no key, etc.)
 *
 * Whichever source wins, we enrich with a 30-second iTunes preview URL
 * when one is available. The widget uses that to make the signal dot a
 * tap-to-play affordance; tracks with no preview render as metadata-only.
 *
 * Caching:
 *   - Whole route: `revalidate: 60`. New scrobbles show up within a minute
 *     without hammering Last.fm.
 *   - iTunes preview lookup: 24h via the fetch cache (see lib/itunes-preview.ts).
 *     Previews don't change, so one lookup per unique track is plenty.
 *
 * Never 500s — upstream failures collapse into the curated fallback and
 * the widget keeps rendering.
 */

import { NextResponse } from "next/server";

import { getPreviewUrl } from "@/lib/itunes-preview";
import { getRecentTrack } from "@/lib/last-fm";
import { nowPlaying as curatedFallback } from "@/content/now";
import nowData from "@/content/now.json";
import { nowContentSchema } from "@/content/schemas";

export const revalidate = 60;

type Source = "pinned" | "live" | "curated";

export interface NowPlayingResponse {
  /** Which branch of the fallback chain won. Exposed mostly for debugging /
   *  curiosity — the UI doesn't read this today. */
  source: Source;
  /** The track itself — always populated; never null. */
  track: {
    title: string;
    artist: string;
    album: string;
  };
  /** True only when Last.fm says we're actively listening right now. The
   *  widget swaps its copy from "LAST PLAYED" to "NOW PLAYING" on this. */
  nowPlaying: boolean;
  /** Unix epoch seconds of the scrobble, `null` when live or curated. */
  playedAt: number | null;
  /** 30-second m4a preview URL from the iTunes Search API, or `null`. */
  previewUrl: string | null;
  /** Last.fm cover-art URL if we have one (live source only). `null` otherwise. */
  imageUrl: string | null;
}

/**
 * Pull the pinned override out of `now.json` if one exists. Parsed through
 * Zod so a bad hand-edit never crashes the route.
 */
function readPinned(): { title: string; artist: string; album: string } | null {
  const parsed = nowContentSchema.safeParse(nowData);
  if (!parsed.success) return null;
  const p = parsed.data.pinned;
  if (!p) return null;
  return { title: p.title, artist: p.artist, album: p.album ?? "" };
}

export async function GET() {
  const pinned = readPinned();
  if (pinned) {
    const previewUrl = await getPreviewUrl(pinned.title, pinned.artist);
    return NextResponse.json<NowPlayingResponse>({
      source: "pinned",
      track: pinned,
      nowPlaying: false,
      playedAt: null,
      previewUrl,
      imageUrl: null,
    });
  }

  const live = await getRecentTrack();
  if (live) {
    const previewUrl = await getPreviewUrl(live.title, live.artist);
    return NextResponse.json<NowPlayingResponse>({
      source: "live",
      track: {
        title: live.title,
        artist: live.artist,
        album: live.album,
      },
      nowPlaying: live.nowPlaying,
      playedAt: live.playedAt,
      previewUrl,
      imageUrl: live.imageUrl,
    });
  }

  const fallback = curatedFallback[0];
  if (!fallback) {
    // Truly nothing to render — extremely edge-case (empty curated list and
    // every upstream down). Return a 204-ish empty payload; the widget
    // hides itself when `track.title` is empty.
    return NextResponse.json<NowPlayingResponse>({
      source: "curated",
      track: { title: "", artist: "", album: "" },
      nowPlaying: false,
      playedAt: null,
      previewUrl: null,
      imageUrl: null,
    });
  }

  const previewUrl = await getPreviewUrl(fallback.title, fallback.artist);
  return NextResponse.json<NowPlayingResponse>({
    source: "curated",
    track: {
      title: fallback.title,
      artist: fallback.artist,
      album: fallback.album ?? "",
    },
    nowPlaying: false,
    playedAt: null,
    previewUrl,
    imageUrl: null,
  });
}
