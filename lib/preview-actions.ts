"use server";

import { redirect } from "next/navigation";
import { SignJWT } from "jose";

/**
 * Stateless preview-gate auth. No cookie — the only way to land on an
 * unlocked case-study page is to post the password through the form,
 * receive a short-lived HMAC token in the URL, and have the page render
 * the study before the token expires.
 *
 * Net effect: every visit requires the password. Even refreshing more
 * than ~PREVIEW_TOKEN_TTL_SEC after a successful unlock kicks the user
 * back to the gate.
 *
 * Signed with the same `SESSION_COOKIE_SECRET` the admin JWE uses, so
 * we don't add a new env var.
 */
const PREVIEW_TOKEN_TTL_SEC = 3;

function getSecret(): Uint8Array {
  const raw = process.env.SESSION_COOKIE_SECRET;
  if (!raw) {
    throw new Error("SESSION_COOKIE_SECRET is required for preview tokens");
  }
  return new TextEncoder().encode(raw);
}

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

  const token = await new SignJWT({ slug })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${PREVIEW_TOKEN_TTL_SEC}s`)
    .sign(getSecret());

  redirect(`/work/${slug}?t=${encodeURIComponent(token)}`);
}
