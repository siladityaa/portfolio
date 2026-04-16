/**
 * OAuth callback — receives `?code=...&state=...` from GitHub, exchanges the
 * code for an access token, checks the user is on the allow-list, and sets
 * the encrypted session cookie.
 *
 * Failure modes (all redirect rather than 4xx so the user sees a page, not a JSON blob):
 *   - missing/mismatched state        → /admin/login?error=state
 *   - GitHub code exchange fails      → /admin/login?error=exchange
 *   - wrong GitHub account            → /admin/forbidden
 *   - env vars missing                → /admin/login?error=config
 *
 * Non-obvious detail: the state cookie carries BOTH the CSRF state AND the
 * original `from` redirect target, separated by `|`. This keeps the
 * GitHub → callback round trip from needing any extra cookies.
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import {
  OAUTH_STATE_COOKIE_NAME,
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE,
  encryptSession,
  getAdminBaseUrl,
  isAllowedLogin,
} from "@/lib/auth";

const GITHUB_TOKEN_URL = "https://github.com/login/oauth/access_token";
const GITHUB_USER_URL = "https://api.github.com/user";

/**
 * Redirect helper that always uses the admin base URL, so the redirect
 * survives preview deployments where `request.url` might be the internal
 * Vercel host and we want the public one.
 */
function redirectTo(baseUrl: string, path: string) {
  const url = new URL(path, baseUrl);
  return NextResponse.redirect(url);
}

export async function GET(request: NextRequest) {
  const baseUrl = getAdminBaseUrl(request.url);
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const stateParam = searchParams.get("state");

  // Env check
  const clientId = process.env.GITHUB_OAUTH_CLIENT_ID;
  const clientSecret = process.env.GITHUB_OAUTH_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    return redirectTo(baseUrl, "/admin/login?error=config");
  }

  // State check — the stashed cookie is `state|fromPath`
  const cookieValue = request.cookies.get(OAUTH_STATE_COOKIE_NAME)?.value;
  if (!cookieValue || !stateParam || !code) {
    return redirectTo(baseUrl, "/admin/login?error=state");
  }
  const [expectedState, rawFrom] = cookieValue.split("|");
  if (expectedState !== stateParam) {
    return redirectTo(baseUrl, "/admin/login?error=state");
  }
  const fromPath = rawFrom && rawFrom.startsWith("/admin") ? rawFrom : "/admin";

  // Exchange code → access token
  let accessToken: string;
  try {
    const tokenRes = await fetch(GITHUB_TOKEN_URL, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: `${baseUrl}/api/auth/callback`,
      }),
      // Don't cache auth responses in any layer.
      cache: "no-store",
    });
    if (!tokenRes.ok) {
      return redirectTo(baseUrl, "/admin/login?error=exchange");
    }
    const tokenBody = (await tokenRes.json()) as {
      access_token?: string;
      error?: string;
    };
    if (tokenBody.error || !tokenBody.access_token) {
      return redirectTo(baseUrl, "/admin/login?error=exchange");
    }
    accessToken = tokenBody.access_token;
  } catch {
    return redirectTo(baseUrl, "/admin/login?error=exchange");
  }

  // Fetch the user's profile — we need `login` for the allow-list check and
  // `name`/`avatar_url` for the admin header.
  let user: { login: string; name: string | null; avatar_url: string };
  try {
    const userRes = await fetch(GITHUB_USER_URL, {
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${accessToken}`,
        "User-Agent": "siladityaa-portfolio-cms",
      },
      cache: "no-store",
    });
    if (!userRes.ok) {
      return redirectTo(baseUrl, "/admin/login?error=exchange");
    }
    user = (await userRes.json()) as typeof user;
  } catch {
    return redirectTo(baseUrl, "/admin/login?error=exchange");
  }

  // Allow-list check — single-user admin. Anyone else who signs in gets
  // bounced to the forbidden page without a session cookie.
  if (!isAllowedLogin(user.login)) {
    const res = redirectTo(baseUrl, "/admin/forbidden");
    // Also clear any stale state cookie.
    res.cookies.delete(OAUTH_STATE_COOKIE_NAME);
    return res;
  }

  // Encrypt + set the session cookie
  const sessionToken = await encryptSession({
    login: user.login,
    name: user.name ?? user.login,
    avatarUrl: user.avatar_url,
    accessToken,
  });

  const res = redirectTo(baseUrl, fromPath);
  res.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: sessionToken,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
  res.cookies.delete(OAUTH_STATE_COOKIE_NAME);
  return res;
}
