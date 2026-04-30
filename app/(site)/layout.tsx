import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

import { Wordmark } from "@/components/chrome/Wordmark";
import { NavLinks } from "@/components/chrome/NavLinks";
import { NowPlaying } from "@/components/chrome/NowPlaying";
import { LocalClock } from "@/components/chrome/LocalClock";
import { CustomCursor } from "@/components/chrome/CustomCursor";
import { PageTransition } from "@/components/chrome/PageTransition";
import { ConsoleEasterEgg } from "@/components/chrome/ConsoleEasterEgg";
import { CommandPalette } from "@/components/chrome/CommandPalette";

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
      {/* WIP: name centered at top, aligned with Wordmark + NavLinks */}
      <span className="fixed left-1/2 top-[clamp(24px,4vw,64px)] z-50 -translate-x-1/2 text-mono-s text-[color:var(--surface-graphite)]">
        SILADITYAA SHARMA
      </span>
      <NavLinks />
      <NowPlaying />
      <LocalClock />

      {/* Page content with the rise+fade transition on navigation. */}
      <main>
        <PageTransition>{children}</PageTransition>
      </main>

      {/* Custom cursor — client component, hidden on touch devices. */}
      <CustomCursor />

      {/* Phase 5 chrome — Easter egg + command palette */}
      <ConsoleEasterEgg />
      <CommandPalette />

      {/* Vercel Analytics + Speed Insights — public pages only, not /admin. */}
      <Analytics />
      <SpeedInsights />
    </>
  );
}
