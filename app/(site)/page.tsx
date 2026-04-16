import { Hero } from "@/components/home/Hero";
import { SelectedWork } from "@/components/home/SelectedWork";
import { AboutTeaser } from "@/components/home/AboutTeaser";
import { Footer } from "@/components/home/Footer";
import { home } from "@/lib/content-home";

/**
 * Home page. Brief §4.1.
 * Sections intentionally separated so each can carry its own hairline-top seam.
 *
 * Hero copy is loaded server-side from `content/home.json` and passed to
 * the Hero client component as props — keeps Hero pure and the content
 * CMS-editable.
 */
export default async function Home() {
  return (
    <>
      <Hero sentence={home.hero.sentence} subline={home.hero.subline} />
      <SelectedWork />
      <AboutTeaser />
      <Footer />
    </>
  );
}
