import { Hero } from "@/components/home/Hero";
import { SelectedWork } from "@/components/home/SelectedWork";
import { AboutTeaser } from "@/components/home/AboutTeaser";
import { Footer } from "@/components/home/Footer";
import { WipHero } from "@/components/home/WipHero";
import { home } from "@/lib/content-home";
import { WIP_MODE } from "@/lib/wip-mode";

/**
 * Home page. Brief §4.1.
 *
 * In WIP mode (toggle in `lib/wip-mode.ts`) renders only the WipHero
 * landing. Public mode renders the full composition: Hero + SelectedWork
 * + AboutTeaser + Footer. Hero copy comes from `content/home.json`.
 */
export default async function Home() {
  if (WIP_MODE) {
    return <WipHero />;
  }

  return (
    <>
      <Hero sentence={home.hero.sentence} subline={home.hero.subline} />
      <SelectedWork />
      <AboutTeaser />
      <Footer />
    </>
  );
}
