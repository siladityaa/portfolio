import type { Metadata } from "next";

import { AdminShell } from "@/components/admin/AdminShell";

/**
 * Admin route group layout — wraps every page under `(admin)/` with the
 * AdminShell (top bar + sidebar nav). Deliberately does NOT render the
 * public four-corner chrome (Wordmark, NavLinks, NowPlaying, LocalClock,
 * CustomCursor, PageTransition).
 *
 * Search engines never index `/admin/*`.
 *
 * Step 6 will gate this whole tree behind GitHub OAuth via middleware.
 */
export const metadata: Metadata = {
  title: "CMS — Siladityaa Sharma",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AdminShell>{children}</AdminShell>;
}
