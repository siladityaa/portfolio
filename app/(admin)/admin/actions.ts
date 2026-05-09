"use server";

/**
 * Server actions for the CMS save flow.
 *
 * One action per collection. Each action:
 *   1. Validates the incoming payload via the collection's Zod schema
 *      (re-parse on the server — never trust client-validated data).
 *   2. Writes it to the target file in the GitHub repo via Octokit.
 *   3. Revalidates the public route so the site reflects the change once
 *      Vercel's next build ships. Local dev picks it up instantly via ISR.
 *
 * Octokit pulls `node:crypto`, `node:fs`, etc. — not Edge-compatible. Server
 * actions in standalone `actions.ts` files don't accept a `runtime` segment
 * export; instead, the admin pages that import them stay on the default Node
 * runtime (which is what we want). If you ever flip any admin page to Edge,
 * this action will fail to bundle — that's the intentional tripwire.
 */

import { revalidatePath } from "next/cache";

import {
  aboutContentSchema,
  caseStudySchema,
  homeContentSchema,
  influencesContentSchema,
  nowContentSchema,
  timelineContentSchema,
} from "@/content/schemas";
import type {
  AboutContent,
  CaseStudy,
  HomeContent,
  InfluencesContent,
  NowContent,
  TimelineContent,
} from "@/content/types";
import {
  ConflictError,
  GitHubSaveError,
  deleteFile,
  getTokenFromSession,
  makeOctokit,
  readJsonFile,
  writeBinaryFile,
  writeJsonFile,
} from "@/lib/github";

/**
 * Discriminated result the client forms switch on to drive the SaveStatus
 * state machine. Returning a typed object rather than throwing is kinder to
 * the form layer — a thrown server-action error shows up as a generic
 * `Error: An unexpected error occurred` without the message.
 */
export type SaveResult =
  | { status: "ok"; commitSha?: string }
  | { status: "invalid"; message: string }
  | { status: "conflict"; message: string }
  | { status: "error"; message: string };

async function runSave<T>(
  path: string,
  data: T,
  collectionLabel: string,
  slug: string,
): Promise<SaveResult> {
  try {
    // Proxy already gated the admin route to a valid session, but server
    // actions can in theory be hit via a stale RSC round-trip so we re-check
    // at the action boundary too. Belt + suspenders — the auth check is
    // always cheap, writing bad data is not.
    const token = await getTokenFromSession();
    if (!token) {
      return {
        status: "error",
        message:
          "Not authenticated. Your session may have expired — please sign in again.",
      };
    }
    const octokit = makeOctokit(token);
    const existing = await readJsonFile(octokit, path);
    const { commitSha } = await writeJsonFile(
      octokit,
      path,
      data,
      `cms: update ${collectionLabel} — ${slug}`,
      existing?.sha ?? null,
    );
    return { status: "ok", commitSha };
  } catch (err: unknown) {
    if (err instanceof ConflictError) {
      return { status: "conflict", message: err.message };
    }
    if (err instanceof GitHubSaveError) {
      return { status: "error", message: err.message };
    }
    const message =
      err instanceof Error ? err.message : "Unknown error saving to GitHub.";
    return { status: "error", message };
  }
}

/* ---------- case study ------------------------------------------------- */

export async function saveCaseStudy(
  slug: string,
  payload: unknown,
): Promise<SaveResult> {
  const parsed = caseStudySchema.safeParse(payload);
  if (!parsed.success) {
    return {
      status: "invalid",
      message: `Payload failed validation: ${parsed.error.issues
        .map((i) => `${i.path.join(".")}: ${i.message}`)
        .join("; ")}`,
    };
  }
  if (parsed.data.slug !== slug) {
    return {
      status: "invalid",
      message: `Slug mismatch: URL says "${slug}" but payload says "${parsed.data.slug}". Refusing to save.`,
    };
  }
  const path = `content/work/${slug}.json`;
  const result = await runSave<CaseStudy>(
    path,
    parsed.data,
    "case-study",
    slug,
  );
  if (result.status === "ok") {
    revalidatePath(`/work/${slug}`);
    revalidatePath("/");
  }
  return result;
}

/* ---------- create / delete a case study ------------------------------- */

const SLUG_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;

export async function createCaseStudy(
  slug: string,
  title: string,
): Promise<SaveResult & { slug?: string }> {
  if (!SLUG_RE.test(slug)) {
    return {
      status: "invalid",
      message:
        "Slug must be lowercase letters, numbers, and dashes only (e.g. my-new-project).",
    };
  }
  if (!title.trim()) {
    return { status: "invalid", message: "Title is required." };
  }

  const path = `content/work/${slug}.json`;
  const stub: CaseStudy = {
    slug,
    title: title.trim(),
    timeline: "",
    role: "",
    team: "",
    status: "public",
    tags: [],
    keyColor: "#7B5BFF",
    hero: { src: "", alt: "" },
    brief: "",
    gallery: [],
  };
  const parsed = caseStudySchema.safeParse(stub);
  if (!parsed.success) {
    return {
      status: "invalid",
      message: `Stub failed validation: ${parsed.error.issues
        .map((i) => `${i.path.join(".")}: ${i.message}`)
        .join("; ")}`,
    };
  }

  try {
    const token = await getTokenFromSession();
    if (!token) {
      return { status: "error", message: "Not authenticated." };
    }
    const octokit = makeOctokit(token);

    // Refuse to overwrite an existing file — it would silently clobber a
    // real case study.
    const existing = await readJsonFile(octokit, path);
    if (existing) {
      return {
        status: "invalid",
        message: `A case study with slug "${slug}" already exists.`,
      };
    }

    const { commitSha } = await writeJsonFile(
      octokit,
      path,
      parsed.data,
      `cms: create case-study — ${slug}`,
      null,
    );
    revalidatePath("/admin/case-studies");
    revalidatePath("/");
    return { status: "ok", commitSha, slug };
  } catch (err: unknown) {
    if (err instanceof ConflictError) {
      return { status: "conflict", message: err.message };
    }
    if (err instanceof GitHubSaveError) {
      return { status: "error", message: err.message };
    }
    const message =
      err instanceof Error ? err.message : "Unknown error creating case study.";
    return { status: "error", message };
  }
}

export async function deleteCaseStudy(slug: string): Promise<SaveResult> {
  if (!SLUG_RE.test(slug)) {
    return { status: "invalid", message: "Invalid slug." };
  }
  const path = `content/work/${slug}.json`;

  try {
    const token = await getTokenFromSession();
    if (!token) {
      return { status: "error", message: "Not authenticated." };
    }
    const octokit = makeOctokit(token);

    const existing = await readJsonFile(octokit, path);
    if (!existing?.sha) {
      return {
        status: "invalid",
        message: `No case study found at ${path}.`,
      };
    }

    const { commitSha } = await deleteFile(
      octokit,
      path,
      `cms: delete case-study — ${slug}`,
      existing.sha,
    );
    revalidatePath("/admin/case-studies");
    revalidatePath("/");
    revalidatePath(`/work/${slug}`);
    return { status: "ok", commitSha };
  } catch (err: unknown) {
    if (err instanceof ConflictError) {
      return { status: "conflict", message: err.message };
    }
    if (err instanceof GitHubSaveError) {
      return { status: "error", message: err.message };
    }
    const message =
      err instanceof Error ? err.message : "Unknown error deleting case study.";
    return { status: "error", message };
  }
}

/* ---------- home ------------------------------------------------------- */

export async function saveHome(payload: unknown): Promise<SaveResult> {
  const parsed = homeContentSchema.safeParse(payload);
  if (!parsed.success) {
    return {
      status: "invalid",
      message: `Payload failed validation: ${parsed.error.issues
        .map((i) => `${i.path.join(".")}: ${i.message}`)
        .join("; ")}`,
    };
  }
  const result = await runSave<HomeContent>(
    "content/home.json",
    parsed.data,
    "home",
    "home",
  );
  if (result.status === "ok") {
    revalidatePath("/");
  }
  return result;
}

/* ---------- about ------------------------------------------------------ */

export async function saveAbout(payload: unknown): Promise<SaveResult> {
  const parsed = aboutContentSchema.safeParse(payload);
  if (!parsed.success) {
    return {
      status: "invalid",
      message: `Payload failed validation: ${parsed.error.issues
        .map((i) => `${i.path.join(".")}: ${i.message}`)
        .join("; ")}`,
    };
  }
  const result = await runSave<AboutContent>(
    "content/about.json",
    parsed.data,
    "about",
    "about",
  );
  if (result.status === "ok") {
    revalidatePath("/about");
  }
  return result;
}

/* ---------- now -------------------------------------------------------- */

export async function saveNow(payload: unknown): Promise<SaveResult> {
  const parsed = nowContentSchema.safeParse(payload);
  if (!parsed.success) {
    return {
      status: "invalid",
      message: `Payload failed validation: ${parsed.error.issues
        .map((i) => `${i.path.join(".")}: ${i.message}`)
        .join("; ")}`,
    };
  }
  const result = await runSave<NowContent>(
    "content/now.json",
    parsed.data,
    "now",
    "now",
  );
  if (result.status === "ok") {
    revalidatePath("/");
    revalidatePath("/about");
  }
  return result;
}

/* ---------- timeline --------------------------------------------------- */

export async function saveTimeline(payload: unknown): Promise<SaveResult> {
  const parsed = timelineContentSchema.safeParse(payload);
  if (!parsed.success) {
    return {
      status: "invalid",
      message: `Payload failed validation: ${parsed.error.issues
        .map((i) => `${i.path.join(".")}: ${i.message}`)
        .join("; ")}`,
    };
  }
  const result = await runSave<TimelineContent>(
    "content/timeline.json",
    parsed.data,
    "timeline",
    "timeline",
  );
  if (result.status === "ok") {
    revalidatePath("/about");
  }
  return result;
}

/* ---------- influences ------------------------------------------------- */

export async function saveInfluences(payload: unknown): Promise<SaveResult> {
  const parsed = influencesContentSchema.safeParse(payload);
  if (!parsed.success) {
    return {
      status: "invalid",
      message: `Payload failed validation: ${parsed.error.issues
        .map((i) => `${i.path.join(".")}: ${i.message}`)
        .join("; ")}`,
    };
  }
  const result = await runSave<InfluencesContent>(
    "content/influences.json",
    parsed.data,
    "influences",
    "influences",
  );
  if (result.status === "ok") {
    revalidatePath("/about");
  }
  return result;
}

/* ---------- image upload ------------------------------------------------ */

export type UploadResult =
  | { status: "ok"; path: string; commitSha?: string }
  | { status: "error"; message: string };

/**
 * Upload an image file to the repo under `public/`.
 *
 * Expects:
 *   - `destPath`: the desired path within the repo, e.g. `public/work/ambient-ai/hero.jpg`
 *   - `base64`: the raw base64 content (no data-URI prefix)
 *   - `filename`: original filename, used only in the commit message
 *
 * Returns the public-facing path (e.g. `/work/ambient-ai/hero.jpg`) on success.
 */
export async function uploadImage(
  destPath: string,
  base64: string,
  filename: string,
): Promise<UploadResult> {
  console.info(
    `uploadImage start: path="${destPath}" filename="${filename}" base64_len=${base64?.length ?? 0}`,
  );
  try {
    if (!destPath.startsWith("public/")) {
      console.warn("uploadImage rejected: bad path", destPath);
      return { status: "error", message: "Image path must start with public/" };
    }
    if (!base64 || typeof base64 !== "string") {
      return {
        status: "error",
        message: "Empty file content. Please pick a file and try again.",
      };
    }

    const token = await getTokenFromSession();
    if (!token) {
      return {
        status: "error",
        message: "Not authenticated. Please sign in again.",
      };
    }

    const octokit = makeOctokit(token);
    const { commitSha } = await writeBinaryFile(
      octokit,
      destPath,
      base64,
      `cms: upload image — ${filename}`,
    );

    // Convert repo path to public-facing path:
    // "public/work/slug/image.jpg" → "/work/slug/image.jpg"
    const publicPath = destPath.replace(/^public/, "");

    console.info(`uploadImage ok: path="${publicPath}" commit=${commitSha}`);
    return { status: "ok", path: publicPath, commitSha };
  } catch (err: unknown) {
    // Log the real error server-side so the cause shows up in Vercel's
    // function logs. The client only sees a sanitized message string.
    console.error("uploadImage failed:", err);
    const message =
      err instanceof Error ? err.message : "Unknown error uploading image.";
    return { status: "error", message };
  }
}
