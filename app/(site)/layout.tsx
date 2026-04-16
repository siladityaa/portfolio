import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

import { Wordmark } from "@/components/chrome/Wordmark";
import { NavLinks } from "@/components/chrome/NavLinks";
import { NowPlaying } from "@/components/chrome/NowPlaying";
import { LocalClock } from "@/components/chrome/LocalClock";
import { CustomCursor } from "@/components/chrome/CustomCursor";
import { PageTransition } from "@/components/chrome/PageTransition";

/**
 * Public site layout — wraps everything under `(site)/` with the
 * four-corner chrome, custom cursor, and page transition.
 *
 * The `(admin)/` route group has its own layout with no public chrome,
 * so the CMS doesn't get the wordmark, clock, now-playing, etc.
 *
 * The root `app/layout.tsx` only handles the `<html>` shell, fonts, and
 * the theme bootstrap script — anything that has to be present for both
 * the public site and the admin lives there.
 */
export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {/* Chrome — four corners, always present on every public page. */}
      <Wordmark />
      <NavLinks />
      <NowPlaying />
      <LocalClock />

      {/* Page content with the rise+fade transition on navigation. */}
      <main>
        <PageTransition>{children}</PageTransition>
      </main>

      {/* Custom cursor — client component, hidden on touch devices. */}
      <CustomCursor />

      {/* Vercel Analytics + Speed Insights — public pages only, not /admin. */}
      <Analytics />
      <SpeedInsights />
    </>
  );
}
