/**
 * Last.fm recent-tracks client.
 *
 * Hits the free public `user.getrecenttracks` endpoint and normalizes the
 * noisy API response (keyed-`#text` strings, string-typed booleans, mixed
 * array/object shapes) into a small typed shape the rest of the app uses.
 *
 * The widget polls this via the `/api/now-playing` route; direct imports
 * elsewhere are fine but rare. Network + parse errors return `null` so
 * callers can cleanly fall back to curated data — we never want a broken
 * third-party API to render an error in the site chrome.
 */
const API_BASE = "https://ws.audioscrobbler.com/2.0/";
const FETCH_TIMEOUT_MS = 3_500; // Stay well under Vercel's default function timeout.

export interface RecentTrack {
  /** Track title. */
  title: string;
  /** Primary artist name. */
  artist: string;
  /** Album title if Last.fm has one. May be an empty string for singles. */
  album: string;
  /** `true` when the user is actively listening right now (no `date` field on
   *  the API response). Otherwise `false` and `playedAt` is populated. */
  nowPlaying: boolean;
  /** Unix epoch seconds of the last play, `null` when `nowPlaying` is true. */
  playedAt: number | null;
  /** Best-available cover art URL, or `null` if Last.fm returned a placeholder. */
  imageUrl: string | null;
  /** Canonical Last.fm track page — useful for link-out if we ever surface one. */
  url: string;
}

interface LastFmImageEntry {
  size: "small" | "medium" | "large" | "extralarge" | "mega" | "";
  "#text": string;
}

interface LastFmTrack {
  name: string;
  artist: { "#text": string } | string;
  album?: { "#text": string } | string;
  image?: LastFmImageEntry[];
  url?: string;
  date?: { uts: string; "#text": string };
  "@attr"?: { nowplaying?: "true" | "false" };
}

interface LastFmRecentTracksResponse {
  recenttracks?: {
    track?: LastFmTrack | LastFmTrack[];
  };
  error?: number;
  message?: string;
}

/**
 * Read either the flat string or the `{#text}` wrapped variant Last.fm uses
 * interchangeably, depending on endpoint version. Returns empty string when
 * nothing's present — never throws.
 */
function unwrapText(value: unknown): string {
  if (typeof value === "string") return value;
  if (value && typeof value === "object" && "#text" in value) {
    const t = (value as { "#text": unknown })["#text"];
    return typeof t === "string" ? t : "";
  }
  return "";
}

/**
 * Prefer the largest image that isn't Last.fm's default grey silhouette
 * placeholder (URL contains `2a96cbd8b46e442fc41c2b86b821562f`).
 */
function pickImageUrl(images: LastFmImageEntry[] | undefined): string | null {
  if (!images?.length) return null;
  const order: LastFmImageEntry["size"][] = ["extralarge", "large", "medium", "small"];
  for (const size of order) {
    const match = images.find((i) => i.size === size);
    const url = match?.["#text"];
    if (url && !url.includes("2a96cbd8b46e442fc41c2b86b821562f")) return url;
  }
  return null;
}

function normalize(raw: LastFmTrack): RecentTrack {
  const nowPlaying = raw["@attr"]?.nowplaying === "true";
  const playedAt =
    !nowPlaying && raw.date?.uts ? Number.parseInt(raw.date.uts, 10) : null;
  return {
    title: raw.name ?? "",
    artist: unwrapText(raw.artist),
    album: unwrapText(raw.album),
    nowPlaying,
    playedAt: Number.isFinite(playedAt) ? playedAt : null,
    imageUrl: pickImageUrl(raw.image),
    url: raw.url ?? "",
  };
}

/**
 * Returns the single most recent Last.fm scrobble for the configured user.
 *
 * The caller (`/api/now-playing`) wraps this with Next's data cache. This
 * function itself is cache-agnostic — call it, get a fresh read or `null`.
 *
 * `null` is returned for any of: missing env vars, network error, HTTP
 * non-2xx, Last.fm-level error body, empty track list, unparseable shape.
 * Silent fallback is intentional — broken scrobbling should never surface
 * as "error" copy on the public site.
 */
export async function getRecentTrack(): Promise<RecentTrack | null> {
  const apiKey = process.env.LASTFM_API_KEY;
  const user = process.env.LASTFM_USERNAME;
  if (!apiKey || !user) return null;

  const url = new URL(API_BASE);
  url.searchParams.set("method", "user.getrecenttracks");
  url.searchParams.set("user", user);
  url.searchParams.set("api_key", apiKey);
  url.searchParams.set("limit", "1");
  url.searchParams.set("format", "json");

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
    const res = await fetch(url.toString(), {
      signal: controller.signal,
      // No `next: { revalidate }` here — the route handler owns caching.
      cache: "no-store",
      headers: { "User-Agent": "siladityaa-portfolio (+https://siladityaa.com)" },
    });
    clearTimeout(timer);
    if (!res.ok) return null;
    const body = (await res.json()) as LastFmRecentTracksResponse;
    if (body.error) return null;
    const rawTrack = body.recenttracks?.track;
    const raw = Array.isArray(rawTrack) ? rawTrack[0] : rawTrack;
    if (!raw?.name) return null;
    return normalize(raw);
  } catch {
    return null;
  }
}
