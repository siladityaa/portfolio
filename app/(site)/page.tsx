import { WipHero } from "@/components/home/WipHero";

/**
 * Home page — WIP mode.
 *
 * Shows an under-construction landing page that keeps the full chrome
 * (Wordmark, NavLinks, NowPlaying, LocalClock, CustomCursor) and the
 * design system. Resume link is preserved in the top-right nav.
 *
 * To restore the full site, swap this back to the Hero + SelectedWork
 * + AboutTeaser + Footer composition from before.
 */
export default function Home() {
  return <WipHero />;
}
