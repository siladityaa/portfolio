/**
 * Logout — clears the session cookie and redirects to /admin/login.
 *
 * POST because the LOGOUT button in AdminShell is a form, which prevents
 * prefetchers/crawlers from accidentally signing the user out. We also
 * accept GET so a direct link works if needed.
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { SESSION_COOKIE_NAME, getAdminBaseUrl } from "@/lib/auth";

function clearAndRedirect(request: NextRequest) {
  const baseUrl = getAdminBaseUrl(request.url);
  const res = NextResponse.redirect(new URL("/admin/login", baseUrl));
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

export async function POST(request: NextRequest) {
  return clearAndRedirect(request);
}

export async function GET(request: NextRequest) {
  return clearAndRedirect(request);
}
