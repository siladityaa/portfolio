"use client";

import { usePathname } from "next/navigation";

import { HeaderBackdrop } from "@/components/chrome/HeaderBackdrop";
import { FooterBackdrop } from "@/components/chrome/FooterBackdrop";

/**
 * Conditionally renders the solid header + footer backdrop bars.
 *
 * Suppressed on the home route (`/`) — both the WIP landing and the public
 * Hero composition look better with content meeting the four-corner chrome
 * directly, no solid bar in the way.
 *
 * Active on all inside pages (resume, about, work, colophon) where the
 * solid bars give the chrome a clean opaque ground while content scrolls
 * cleanly beneath.
 */
export function PageChrome() {
  const pathname = usePathname();
  if (pathname === "/") return null;

  return (
    <>
      <HeaderBackdrop />
      <FooterBackdrop />
    </>
  );
}
