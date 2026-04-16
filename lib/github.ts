/**
 * Thin wrapper around @octokit/rest for CMS save flow.
 *
 * All file writes go to the branch specified in `GITHUB_REPO_BRANCH` — `main`
 * in the shipped config. (During the Phase 6 build-out we briefly pointed at
 * a throwaway `cms-test` branch so the save pipeline could be verified
 * without touching prod; git log on main carries the switchover commit.)
 *
 * Token sourcing:
 *   - Primary: the OAuth-derived access token pulled from the JWE session
 *     cookie by `getTokenFromSession` below. Gated by the single-user allow-
 *     list in the OAuth callback.
 *   - Dev fallback: `GITHUB_TEST_TOKEN` env var, honored only when
 *     `NODE_ENV !== "production"`. Lets you keep working locally if OAuth
 *     breaks. Never set this in Vercel production env.
 *
 * `@octokit/rest` is Node-only (pulls in `node:crypto`, `node:fs`) so any
 * caller MUST run on the Node runtime. Server actions in standalone
 * `actions.ts` files inherit their runtime from the importing page — we
 * leave admin pages on the default Node runtime and never flip them to Edge.
 */
import { Octokit } from "@octokit/rest";

export class ConflictError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ConflictError";
  }
}

export class GitHubSaveError extends Error {
  constructor(
    message: string,
    readonly cause?: unknown,
  ) {
    super(message);
    this.name = "GitHubSaveError";
  }
}

interface RepoCoordinates {
  owner: string;
  repo: string;
  branch: string;
}

function getRepoCoordinates(): RepoCoordinates {
  const owner = process.env.GITHUB_REPO_OWNER;
  const repo = process.env.GITHUB_REPO_NAME;
  const branch = process.env.GITHUB_REPO_BRANCH;
  if (!owner || !repo || !branch) {
    throw new GitHubSaveError(
      "Missing GITHUB_REPO_OWNER / GITHUB_REPO_NAME / GITHUB_REPO_BRANCH env vars.",
    );
  }
  return { owner, repo, branch };
}

/**
 * Build an Octokit client from the caller-provided token. The token is
 * whatever the calling server action has on hand — a PAT in Step 4, the
 * OAuth session token in Step 6.
 */
export function makeOctokit(token: string): Octokit {
  if (!token) {
    throw new GitHubSaveError("makeOctokit called with an empty token.");
  }
  return new Octokit({ auth: token });
}

/**
 * Fetch the SHA + decoded JSON content for a file on the target branch.
 * Returns `null` if the file doesn't exist yet (404), which lets the caller
 * treat first-write as a normal create rather than an error.
 */
export async function readJsonFile<T = unknown>(
  octokit: Octokit,
  path: string,
): Promise<{ sha: string; data: T } | null> {
  const { owner, repo, branch } = getRepoCoordinates();
  try {
    const res = await octokit.repos.getContent({
      owner,
      repo,
      path,
      ref: branch,
    });
    // `getContent` returns `any | any[]` depending on whether the path is
    // a directory. We're reading a single file, so narrow to the file shape.
    if (Array.isArray(res.data) || res.data.type !== "file") {
      throw new GitHubSaveError(
        `Expected a file at ${path} but got ${Array.isArray(res.data) ? "a directory" : res.data.type}.`,
      );
    }
    const decoded = Buffer.from(res.data.content, "base64").toString("utf8");
    return { sha: res.data.sha, data: JSON.parse(decoded) as T };
  } catch (err: unknown) {
    if (
      typeof err === "object" &&
      err !== null &&
      "status" in err &&
      (err as { status: number }).status === 404
    ) {
      return null;
    }
    throw new GitHubSaveError(`Failed to read ${path} from GitHub.`, err);
  }
}

/**
 * Write (create-or-update) a JSON file at `path`. Stringifies with 2-space
 * indent so git diffs stay human-readable. If the file already exists, pass
 * its current `sha` — GitHub rejects writes whose `sha` is stale with 409,
 * which we turn into a `ConflictError` for the form to render.
 */
export async function writeJsonFile(
  octokit: Octokit,
  path: string,
  data: unknown,
  message: string,
  currentSha: string | null,
): Promise<{ commitSha: string | undefined }> {
  const { owner, repo, branch } = getRepoCoordinates();
  const content = Buffer.from(
    JSON.stringify(data, null, 2) + "\n",
    "utf8",
  ).toString("base64");

  try {
    const res = await octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path,
      branch,
      message,
      content,
      ...(currentSha ? { sha: currentSha } : {}),
    });
    return { commitSha: res.data.commit.sha };
  } catch (err: unknown) {
    const status =
      typeof err === "object" && err !== null && "status" in err
        ? (err as { status: number }).status
        : undefined;
    if (status === 409 || status === 422) {
      throw new ConflictError(
        `The file ${path} changed on GitHub since you opened the editor.`,
      );
    }
    throw new GitHubSaveError(`Failed to write ${path} to GitHub.`, err);
  }
}

/**
 * Reads the OAuth access token from the encrypted session cookie set by the
 * `/api/auth/callback` route. This is the production path — the token was
 * minted by GitHub after the allow-listed user signed in, so a present
 * session cookie implies "authorized to write to the repo".
 *
 * Returns `null` if the cookie is missing, malformed, or expired. Callers
 * should treat `null` as "not authenticated" and refuse to write.
 *
 * Dev-only fallback: if the session cookie is absent and `GITHUB_TEST_TOKEN`
 * is set, use that PAT instead. Gated on `NODE_ENV !== "production"` so prod
 * can never silently use a long-lived PAT, even if someone leaks one into
 * the Vercel env accidentally.
 */
export async function getTokenFromSession(): Promise<string | null> {
  // Dynamic import to avoid pulling next/headers into Edge-runtime code paths
  // that don't need it. This file is only imported from server actions, which
  // always run on Node, so `cookies()` is safe.
  const { cookies } = await import("next/headers");
  const { SESSION_COOKIE_NAME, decryptSession } = await import("@/lib/auth");

  const jar = await cookies();
  const session = await decryptSession(jar.get(SESSION_COOKIE_NAME)?.value);
  if (session?.accessToken) {
    return session.accessToken;
  }

  if (process.env.NODE_ENV !== "production") {
    const fallback = process.env.GITHUB_TEST_TOKEN;
    if (fallback) return fallback;
  }
  return null;
}
