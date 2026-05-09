/**
 * Loader for `content/about.json`. In production fetches from GitHub
 * raw with a cache tag so CMS saves can `revalidateTag` to surface
 * updates without a Vercel rebuild. In development reads from the
 * local FS.
 */

import { aboutContentSchema } from "@/content/schemas";
import type { AboutContent } from "@/content/types";

const REPO_PATH = "content/about.json";

const USE_GITHUB = process.env.NODE_ENV === "production";
const OWNER = process.env.GITHUB_REPO_OWNER ?? "siladityaa";
const REPO = process.env.GITHUB_REPO_NAME ?? "portfolio";
const BRANCH = process.env.GITHUB_REPO_BRANCH ?? "main";
const RAW_BASE = `https://raw.githubusercontent.com/${OWNER}/${REPO}/${BRANCH}`;
const REVALIDATE = 3600;

export const TAG_ABOUT_CONTENT = "about-content";

const FALLBACK: AboutContent = {
  pulledQuote: "",
  bio: { personal: "", professional: "" },
};

export async function getAbout(): Promise<AboutContent> {
  if (USE_GITHUB) {
    const res = await fetch(`${RAW_BASE}/${REPO_PATH}`, {
      next: { tags: [TAG_ABOUT_CONTENT], revalidate: REVALIDATE },
    });
    if (!res.ok) return FALLBACK;
    const parsed = aboutContentSchema.safeParse(await res.json());
    return parsed.success ? parsed.data : FALLBACK;
  }
  const fs = await import("node:fs");
  const path = await import("node:path");
  try {
    const raw = await fs.promises.readFile(
      path.join(process.cwd(), REPO_PATH),
      "utf8",
    );
    return aboutContentSchema.parse(JSON.parse(raw));
  } catch {
    return FALLBACK;
  }
}
