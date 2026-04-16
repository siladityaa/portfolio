/**
 * Auth library — JWE (encrypted JWT) session cookies for the CMS.
 *
 * Everything here is Edge-runtime safe so the same helpers can be used from
 * `middleware.ts` (Edge), the OAuth API routes (Node), and server actions
 * (Node). No `node:*` imports — we use Web Crypto via `jose`.
 *
 * Session shape:
 *   - login:       GitHub username (checked against ADMIN_GITHUB_LOGIN on each request)
 *   - name:        display name (shown in the admin header)
 *   - avatarUrl:   GitHub avatar URL (shown in the admin header)
 *   - accessToken: GitHub OAuth token (used by server actions to hit the Contents API)
 *
 * The session is encrypted with JWE (`dir` / `A256GCM`) so the access token
 * isn't readable even if a cookie leaks. The key is derived by SHA-256 of
 * SESSION_COOKIE_SECRET, so the secret can be any length ≥ 32 bytes.
 */

import { EncryptJWT, jwtDecrypt } from "jose";

export const SESSION_COOKIE_NAME = "siladityaa_admin_session";
export const OAUTH_STATE_COOKIE_NAME = "siladityaa_oauth_state";
/** 7 days in seconds. Aligns with the JWT exp so reloads extend the session. */
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

export interface AdminSession {
  /** GitHub username — checked against ADMIN_GITHUB_LOGIN every request. */
  login: string;
  /** Display name for the admin header. */
  name: string;
  /** GitHub avatar URL. */
  avatarUrl: string;
  /** OAuth access token with `public_repo` scope. */
  accessToken: string;
}

function getSecret(): string {
  const secret = process.env.SESSION_COOKIE_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      "SESSION_COOKIE_SECRET is missing or shorter than 32 chars. Generate with `openssl rand -base64 32`.",
    );
  }
  return secret;
}

/**
 * Derive a 32-byte AES key from the configured secret via SHA-256. Using a
 * hash instead of the raw bytes means the secret can be any length ≥ 32 (and
 * any charset — base64, hex, utf8 — they all normalize to 32 bytes).
 */
async function getKey(): Promise<Uint8Array> {
  const data = new TextEncoder().encode(getSecret());
  const hash = await crypto.subtle.digest("SHA-256", data);
  return new Uint8Array(hash);
}

/**
 * Encrypt a session payload into a compact JWE string. The JWT's `exp` claim
 * matches the cookie's Max-Age so browsers and server agree on lifetime.
 */
export async function encryptSession(session: AdminSession): Promise<string> {
  const key = await getKey();
  return new EncryptJWT({ ...session })
    .setProtectedHeader({ alg: "dir", enc: "A256GCM" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .encrypt(key);
}

/**
 * Decrypt a session cookie. Returns `null` for any failure — malformed
 * token, wrong key, expired JWT, missing fields. Never throws; callers
 * treat `null` as "not logged in".
 */
export async function decryptSession(
  token: string | undefined,
): Promise<AdminSession | null> {
  if (!token) return null;
  try {
    const key = await getKey();
    const { payload } = await jwtDecrypt(token, key);
    if (
      typeof payload.login !== "string" ||
      typeof payload.name !== "string" ||
      typeof payload.avatarUrl !== "string" ||
      typeof payload.accessToken !== "string"
    ) {
      return null;
    }
    return {
      login: payload.login,
      name: payload.name,
      avatarUrl: payload.avatarUrl,
      accessToken: payload.accessToken,
    };
  } catch {
    return null;
  }
}

/**
 * The allowed GitHub login (just you). Kept as a helper so the middleware,
 * callback route, and server actions all compare the same way — trimmed and
 * case-insensitive, since GitHub logins are case-insensitive.
 */
export function isAllowedLogin(login: string | undefined | null): boolean {
  const allowed = process.env.ADMIN_GITHUB_LOGIN;
  if (!allowed) return false;
  if (!login) return false;
  return login.trim().toLowerCase() === allowed.trim().toLowerCase();
}

/**
 * Base URL of the admin — used for the OAuth callback and post-login
 * redirects. Local dev is http://localhost:3000; prod is whatever is set
 * in ADMIN_BASE_URL. Falls back to the request's origin if unset, so the
 * OAuth flow still works even before the env is fully configured.
 */
export function getAdminBaseUrl(requestUrl: string): string {
  const envUrl = process.env.ADMIN_BASE_URL;
  if (envUrl) return envUrl.replace(/\/+$/, "");
  try {
    const url = new URL(requestUrl);
    return `${url.protocol}//${url.host}`;
  } catch {
    return "";
  }
}
