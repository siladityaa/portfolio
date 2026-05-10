/**
 * Loader for `content/home.json`. In production fetches from GitHub raw
 * with a cache tag so CMS saves can `revalidateTag` to surface updates
 * without a Vercel rebuild. In development reads from the local FS.
 */

import { homeContentSchema } from "@/content/schemas";
import type { HomeContent } from "@/content/types";

const REPO_PATH = "content/home.json";

const USE_GITHUB = process.env.NODE_ENV === "production";
const OWNER = process.env.GITHUB_REPO_OWNER ?? "siladityaa";
const REPO = process.env.GITHUB_REPO_NAME ?? "portfolio";
const BRANCH = process.env.GITHUB_REPO_BRANCH ?? "main";
const API_BASE = `https://api.github.com/repos/${OWNER}/${REPO}/contents`;
const REVALIDATE = 3600;

export const TAG_HOME_CONTENT = "home-content";

const FALLBACK: HomeContent = {
  hero: { sentence: "", subline: "" },
};

export async function getHome(): Promise<HomeContent> {
  if (USE_GITHUB) {
    // Contents API instead of raw URL so CMS saves are picked up
    // immediately (raw.githubusercontent.com sits behind a CDN cache
    // that lags commits).
    const res = await fetch(`${API_BASE}/${REPO_PATH}?ref=${BRANCH}`, {
      next: { tags: [TAG_HOME_CONTENT], revalidate: REVALIDATE },
      headers: { Accept: "application/vnd.github.v3.raw" },
    });
    if (!res.ok) return FALLBACK;
    const parsed = homeContentSchema.safeParse(await res.json());
    return parsed.success ? parsed.data : FALLBACK;
  }
  const fs = await import("node:fs");
  const path = await import("node:path");
  try {
    const raw = await fs.promises.readFile(
      path.join(process.cwd(), REPO_PATH),
      "utf8",
    );
    return homeContentSchema.parse(JSON.parse(raw));
  } catch {
    return FALLBACK;
  }
}
