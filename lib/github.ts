/**
 * Thin wrapper around @octokit/rest for CMS save flow.
 *
 * All file writes go to the branch specified in `GITHUB_REPO_BRANCH`. During
 * Step 4 this is a throwaway branch (`cms-test`) so we can sanity-check the
 * save pipeline without touching `main`. Step 5 flips it to `main`.
 *
 * Token sourcing:
 *   - Step 4: `GITHUB_TEST_TOKEN` env var — a hand-rolled PAT with `public_repo` scope.
 *   - Step 6: the OAuth-derived access token from the JWE session cookie
 *     (signed by the single-user GitHub login allow-list).
 *
 * `@octokit/rest` is Node-only (pulls in `node:crypto`, `node:fs`) so any
 * caller MUST declare `export const runtime = "nodejs"`. Server actions that
 * import this file do.
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
 * Step 4 helper: pulls the test PAT from the environment. In Step 6 this is
 * replaced with a call that reads the access token out of the JWE session
 * cookie via `lib/auth.ts`. Until then, calling this without the env var set
 * throws a clear error.
 */
export function getTokenFromEnv(): string {
  const token = process.env.GITHUB_TEST_TOKEN;
  if (!token) {
    throw new GitHubSaveError(
      "GITHUB_TEST_TOKEN is not set. See .env.example — Step 4 uses a hand-rolled PAT.",
    );
  }
  return token;
}
