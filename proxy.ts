/**
 * Auth gate for `/admin/*` — Next.js 16 Proxy (formerly Middleware).
 *
 * In Next.js 16 this file must be named `proxy.ts` at the repo root and the
 * exported function must be named `proxy`. The old `middleware.ts` /
 * `export function middleware` convention was deprecated in v16.0.0.
 *
 * Runs before any admin page/action, so the auth check happens before any
 * server code can touch the filesystem or GitHub. The only way around this
 * gate is if `config.matcher` below is wrong — double-check it whenever
 * you touch this file.
 *
 * Policy:
 *   - Public admin paths (`/admin/login`, `/admin/forbidden`) are never gated.
 *   - Everything else under `/admin/` requires a valid, decryptable session
 *     cookie whose `login` matches the `ADMIN_GITHUB_LOGIN` env var.
 *   - Unauthed: redirect to `/admin/login?from=<original-path>` so we can
 *     bounce the user back after sign-in.
 *   - Wrong login (somehow): redirect to `/admin/forbidden`. Shouldn't
 *     happen — the callback route already blocks this — but defense in depth.
 *
 * `jose` works on both the Node.js and Edge runtimes, so importing
 * `lib/auth.ts` here is safe regardless of where the proxy runs.
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import {
  SESSION_COOKIE_NAME,
  decryptSession,
  isAllowedLogin,
} from "@/lib/auth";

/** Admin paths that the proxy should let through without a session. */
const PUBLIC_ADMIN_PATHS = new Set([
  "/admin/login",
  "/admin/forbidden",
]);

function isPublicAdminPath(pathname: string): boolean {
  if (PUBLIC_ADMIN_PATHS.has(pathname)) return true;
  // Allow the Next.js internals and static assets to pass through just in case
  // the matcher ever catches them (belt + suspenders — current matcher excludes them).
  if (pathname.startsWith("/_next/")) return true;
  if (pathname.startsWith("/api/auth/")) return true;
  return false;
}

/**
 * WIP mode — redirect all public content pages to home.
 * Remove this block (and the matcher entry) to restore the full site.
 */
const WIP_MODE = true;
const WIP_ALLOWED = new Set(["/", "/_not-found", "/resume"]);

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // WIP gate: redirect /about, /work/*, /colophon to home
  if (WIP_MODE && !pathname.startsWith("/admin") && !pathname.startsWith("/api") && !pathname.startsWith("/_next") && !WIP_ALLOWED.has(pathname)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Non-admin paths that made it past the WIP gate — let them through.
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  if (isPublicAdminPath(pathname)) {
    return NextResponse.next();
  }

  const cookieValue = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const session = await decryptSession(cookieValue);

  if (!session) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (!isAllowedLogin(session.login)) {
    // The session decrypted OK but the login is no longer allowed — likely
    // ADMIN_GITHUB_LOGIN got changed. Force a re-auth.
    const forbiddenUrl = new URL("/admin/forbidden", request.url);
    const res = NextResponse.redirect(forbiddenUrl);
    res.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: "",
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 0,
    });
    return res;
  }

  return NextResponse.next();
}

/**
 * Match every path under `/admin/` — including `/admin` itself. We exclude
 * `/api/auth/*` from the matcher entirely so the OAuth round trip isn't
 * subject to the auth gate (that would deadlock the login flow).
 */
export const config = {
  matcher: [
    "/admin/:path*",
    // WIP mode: catch public content pages for redirect.
    // Remove these when WIP_MODE is turned off.
    "/about",
    "/work/:path*",
    "/colophon",
    "/resume",
  ],
};
