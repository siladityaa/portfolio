import type { Metadata } from "next";
import { Instrument_Serif, JetBrains_Mono } from "next/font/google";
import "./globals.css";

import { ThemeAutoSync } from "@/components/chrome/ThemeAutoSync";

// Instrument Serif ships the regular (400) and italic weights only —
// the brief calls for variable weight play but Instrument Serif is the free
// fallback so we lean on size + leading for hierarchy instead.
const display = Instrument_Serif({
  variable: "--font-display-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

const mono = JetBrains_Mono({
  variable: "--font-mono-ui",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Siladityaa Sharma — Senior Product Designer, Meta Reality Labs",
  description:
    "Siladityaa Sharma — Senior Product Designer at Meta Reality Labs in Los Angeles. Previously shipped Ray-Ban Stories and the second-generation Ray-Ban Meta Smart Glasses. Adjunct Instructor at ArtCenter.",
  metadataBase: new URL("https://siladityaa.com"),
  openGraph: {
    title: "Siladityaa Sharma — Senior Product Designer",
    description:
      "Senior Product Designer, Meta Reality Labs · Los Angeles. Wearables + AI. Adjunct Instructor at ArtCenter.",
    type: "website",
  },
};

/**
 * Inline script — runs BEFORE hydration to set the theme class with no
 * flash. Reads the explicit override from localStorage first; if absent,
 * falls back to `prefers-color-scheme`. After hydration, ThemeAutoSync
 * keeps the page in sync with live OS changes (when no override is set),
 * and the footer ThemeToggle lets the user pin / unpin an override.
 */
const themeBootstrap = `
(function(){try{
  var pref = localStorage.getItem('theme');
  var dark = pref ? pref === 'dark'
                  : window.matchMedia('(prefers-color-scheme: dark)').matches;
  document.documentElement.classList.toggle('dark', dark);
}catch(e){}})();
`;

/**
 * Root layout — minimal. Only what BOTH the public site and the admin
 * need to share: html shell, fonts, theme bootstrap script, ThemeAutoSync.
 *
 * Public chrome (Wordmark, NavLinks, NowPlaying, LocalClock, CustomCursor,
 * PageTransition) lives in `app/(site)/layout.tsx`. The admin's chrome
 * lives in `app/(admin)/layout.tsx`.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${display.variable} ${mono.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootstrap }} />
      </head>
      <body className="relative min-h-screen">
        {/* Live OS theme follower — renders nothing. Mounted at root so
            both the public site and the admin react to OS theme changes. */}
        <ThemeAutoSync />

        {children}
      </body>
    </html>
  );
}
