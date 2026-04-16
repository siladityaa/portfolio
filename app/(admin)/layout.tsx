import type { Metadata } from "next";

/**
 * Admin route group layout — everything under `(admin)/` gets noindex'd
 * and the CMS title. Does NOT render the AdminShell (top bar + sidebar) —
 * that happens in `admin/(cms)/layout.tsx`, which only wraps the gated
 * editor pages. The login and forbidden pages live outside `(cms)` and
 * render without any shell so they feel like dedicated fullscreen states.
 *
 * Does NOT render the public four-corner chrome (Wordmark, NavLinks,
 * NowPlaying, LocalClock, CustomCursor, PageTransition) — that's `(site)`.
 *
 * The whole tree is gated by `proxy.ts` at the repo root (GitHub OAuth,
 * single-user allow-list). Only `/admin/login` and `/admin/forbidden` are
 * excluded from the gate.
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
  return <>{children}</>;
}
