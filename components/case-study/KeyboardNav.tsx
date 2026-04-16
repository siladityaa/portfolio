"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface KeyboardNavProps {
  prevSlug?: string;
  nextSlug?: string;
}

/**
 * Brief §4.3 item 8 — "Click or press → key to advance" on case study
 * pages. Adds ← support too so the nav is symmetric.
 *
 * The component itself renders nothing; it just wires window listeners.
 * Placed in the case-study page so it mounts/unmounts with the route.
 */
export function KeyboardNav({ prevSlug, nextSlug }: KeyboardNavProps) {
  const router = useRouter();

  useEffect(() => {
    function handle(event: KeyboardEvent) {
      // Don't hijack keys while the user is typing in a field.
      const target = event.target as HTMLElement | null;
      const tag = target?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || target?.isContentEditable) {
        return;
      }
      if (event.metaKey || event.ctrlKey || event.altKey) return;

      if (event.key === "ArrowRight" && nextSlug) {
        event.preventDefault();
        router.push(`/work/${nextSlug}`);
      } else if (event.key === "ArrowLeft" && prevSlug) {
        event.preventDefault();
        router.push(`/work/${prevSlug}`);
      }
    }

    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, [router, prevSlug, nextSlug]);

  return null;
}
