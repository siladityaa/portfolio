/**
 * OAuth entry point — builds the GitHub authorize URL and redirects the
 * browser to it.
 *
 * Flow:
 *   1. User hits `/api/auth/github?from=/admin/home` (from the login button).
 *   2. We generate a random `state` for CSRF and stash it in a short-lived cookie.
 *   3. Redirect to `https://github.com/login/oauth/authorize?...` with our
 *      client_id, redirect_uri, scope, and state.
 *   4. GitHub bounces the user back to `/api/auth/callback`, which validates
 *      state, exchanges the code for a token, and creates the session.
 *
 * The `from` query is carried through the state cookie so the callback can
 * redirect back to where the user was headed (e.g. `/admin/case-studies`).
 * It's validated against a same-origin pattern to block open-redirect abuse.
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import {
  OAUTH_STATE_COOKIE_NAME,
  getAdminBaseUrl,
} from "@/lib/auth";

const GITHUB_AUTHORIZE_URL = "https://github.com/login/oauth/authorize";
/** 5 minutes — plenty of time for the round trip, tight enough to matter. */
const STATE_COOKIE_MAX_AGE = 60 * 5;

/** Base64url-encode 32 random bytes — unpredictable enough for CSRF state. */
function generateState(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Buffer.from(bytes)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

/**
 * Validate a post-login redirect target. Must be a same-origin, absolute
 * path starting with `/admin/`, never a full URL. Anything else we silently
 * coerce to `/admin` — open-redirect holes are a classic OAuth footgun.
 */
function sanitizeFrom(raw: string | null): string {
  if (!raw) return "/admin";
  if (!raw.startsWith("/admin")) return "/admin";
  if (raw.startsWith("//")) return "/admin"; // schema-relative URL
  return raw;
}

export async function GET(request: NextRequest) {
  const clientId = process.env.GITHUB_OAUTH_CLIENT_ID;
  if (!clientId) {
    return NextResponse.json(
      { error: "GITHUB_OAUTH_CLIENT_ID is not set." },
      { status: 500 },
    );
  }

  const { searchParams } = new URL(request.url);
  const from = sanitizeFrom(searchParams.get("from"));
  const state = generateState();
  const baseUrl = getAdminBaseUrl(request.url);

  const authorizeUrl = new URL(GITHUB_AUTHORIZE_URL);
  authorizeUrl.searchParams.set("client_id", clientId);
  authorizeUrl.searchParams.set("redirect_uri", `${baseUrl}/api/auth/callback`);
  // `public_repo` is all we need — write access to content files in our public
  // repo. Strictly narrower than the `repo` scope (no private repo access).
  authorizeUrl.searchParams.set("scope", "public_repo");
  authorizeUrl.searchParams.set("state", state);
  // `login` prompt hint — if GitHub has a session we'll use it; otherwise the
  // user sees the login form. Leaving this off is fine too.
  authorizeUrl.searchParams.set("allow_signup", "false");

  const res = NextResponse.redirect(authorizeUrl);

  // Stash state + the post-login redirect target together, separated by a `|`.
  // We only pull values out of this cookie inside the callback, which runs
  // server-side, so a simple delimiter is fine.
  res.cookies.set({
    name: OAUTH_STATE_COOKIE_NAME,
    value: `${state}|${from}`,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: STATE_COOKIE_MAX_AGE,
  });

  return res;
}
