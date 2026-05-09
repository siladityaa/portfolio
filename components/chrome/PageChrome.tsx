"use client";

import { HeaderBackdrop } from "@/components/chrome/HeaderBackdrop";
import { FooterBackdrop } from "@/components/chrome/FooterBackdrop";

/**
 * Renders the solid header + footer backdrop bars on every page.
 *
 * The backdrops use the paper surface color so the four-corner chrome
 * (Wordmark, NavLinks, NowPlaying, LocalClock) always sits on a clean
 * opaque ground while content scrolls cleanly beneath.
 */
export function PageChrome() {
  return (
    <>
      <HeaderBackdrop />
      <FooterBackdrop />
    </>
  );
}
