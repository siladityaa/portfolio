/**
 * iTunes Search API lookup for a track's 30-second preview URL.
 *
 * Free, auth-less public endpoint — the same one Apple's "Search in iTunes
 * Store" sheet uses. Returns `m4a` CDN URLs that play cleanly in any
 * `<audio>` element, iOS and desktop both.
 *
 * ~80% hit rate in practice. Tracks without previews: unlicensed regional
 * releases, very new releases not yet indexed, some classical/foreign.
 * `null` is the expected response for those — the widget just hides its
 * play affordance and the visitor sees metadata only.
 *
 * Rate-limit note: iTunes Search allows ~20 req/min per IP unauthenticated.
 * The `/api/now-playing` route uses Next's fetch cache with a 24h
 * revalidate on preview lookups, so in practice we hit this once per
 * unique track, not once per pageview.
 */
const API_BASE = "https://itunes.apple.com/search";
const FETCH_TIMEOUT_MS = 3_000;

interface ITunesTrackResult {
  wrapperType: string;
  trackName?: string;
  artistName?: string;
  previewUrl?: string;
}

interface ITunesSearchResponse {
  resultCount: number;
  results: ITunesTrackResult[];
}

/**
 * Loose case-insensitive fuzzy match — Last.fm sometimes returns a different
 * featuring-artist format ("A (feat. B)" vs "A feat. B"), or misses
 * punctuation. We don't need a perfect match; any track where the iTunes
 * result's `trackName` and `artistName` both appear in the query is good
 * enough for a preview lookup.
 */
function loosePick(
  query: { title: string; artist: string },
  results: ITunesTrackResult[],
): ITunesTrackResult | null {
  const normTitle = query.title.toLowerCase();
  const normArtist = query.artist.toLowerCase();
  const exact = results.find(
    (r) =>
      r.trackName?.toLowerCase() === normTitle &&
      r.artistName?.toLowerCase() === normArtist,
  );
  if (exact) return exact;
  // First result Apple ranks is almost always right when exact-match misses.
  return results[0] ?? null;
}

/**
 * Look up a 30-second preview URL for the given track. Returns `null` when
 * nothing matches or the endpoint is unreachable — callers should treat
 * `null` as "this track just isn't playable here" and render accordingly.
 */
export async function getPreviewUrl(
  title: string,
  artist: string,
): Promise<string | null> {
  if (!title || !artist) return null;

  const url = new URL(API_BASE);
  // Space-joined query; Apple's tokenizer handles the rest.
  url.searchParams.set("term", `${artist} ${title}`);
  url.searchParams.set("entity", "song");
  url.searchParams.set("limit", "5");
  url.searchParams.set("media", "music");

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
    const res = await fetch(url.toString(), {
      signal: controller.signal,
      // Next's fetch cache: reuse the same preview URL for 24h. Previews
      // don't churn, and this drops our iTunes load to ~once-per-track.
      next: { revalidate: 60 * 60 * 24 },
      headers: { "User-Agent": "siladityaa-portfolio (+https://siladityaa.com)" },
    });
    clearTimeout(timer);
    if (!res.ok) return null;
    const body = (await res.json()) as ITunesSearchResponse;
    if (!body.results?.length) return null;
    const picked = loosePick({ title, artist }, body.results);
    return picked?.previewUrl ?? null;
  } catch {
    return null;
  }
}
