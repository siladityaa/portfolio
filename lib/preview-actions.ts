"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

/**
 * Preview-gate cookie. Lives outside the admin session so non-admins can
 * still preview private case studies with the shared password.
 *
 * Set by `unlockPreview` after a successful password match. Read by the
 * case-study page server component. Plain "1" value — anyone could set
 * this cookie manually if they knew the name, which is fine for a
 * "design in private for now" gate (not a security boundary).
 */
const PREVIEW_COOKIE = "studio-preview";
const COOKIE_MAX_AGE_SEC = 60 * 60 * 24 * 30; // 30 days

export async function unlockPreview(slug: string, formData: FormData) {
  const password = formData.get("password");
  const target = process.env.STUDIO_PREVIEW_PASSWORD;

  if (
    typeof password !== "string" ||
    !target ||
    password.length === 0 ||
    password !== target
  ) {
    redirect(`/work/${slug}?bad=1`);
  }

  const jar = await cookies();
  jar.set(PREVIEW_COOKIE, "1", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: COOKIE_MAX_AGE_SEC,
  });
  redirect(`/work/${slug}`);
}

export async function lockPreview() {
  const jar = await cookies();
  jar.delete(PREVIEW_COOKIE);
  redirect("/");
}
