import { cookies } from "next/headers";

import { AdminShell } from "@/components/admin/AdminShell";
import { SESSION_COOKIE_NAME, decryptSession } from "@/lib/auth";

/**
 * Shell for the gated CMS pages (dashboard, case studies, home, about, now).
 *
 * Reads the session cookie so the AdminShell header can show the signed-in
 * user's name + avatar. The `proxy.ts` gate has already guaranteed a valid
 * session before we get here, so in practice `session` is always non-null —
 * we just fall back gracefully on the off chance the cookie is malformed.
 */
export default async function CmsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jar = await cookies();
  const session = await decryptSession(
    jar.get(SESSION_COOKIE_NAME)?.value,
  );

  return (
    <AdminShell
      user={
        session
          ? { name: session.name, login: session.login, avatarUrl: session.avatarUrl }
          : null
      }
    >
      {children}
    </AdminShell>
  );
}
