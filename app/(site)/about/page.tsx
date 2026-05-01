import type { Metadata } from "next";

import { PulledQuote } from "@/components/about/PulledQuote";
import { BioColumns } from "@/components/about/BioColumns";
import { Timeline } from "@/components/about/Timeline";
import { InfluencesGrid } from "@/components/about/InfluencesGrid";
import { CurrentlyPreviously } from "@/components/about/CurrentlyPreviously";
import { Footer } from "@/components/home/Footer";

export const metadata: Metadata = {
  title: "About — Siladityaa Sharma",
  description:
    "Senior Product Designer at Meta Reality Labs · Los Angeles. Adjunct Instructor at ArtCenter. Twelve influences and a timeline that reads like a spec sheet.",
};

/**
 * Brief §4.4. Long-form editorial. The closest the site gets to magazine feel.
 *
 * Structure: pulled quote → bio columns → timeline → influences grid →
 * currently/previously → footer. No headshot per Siladityaa's preference.
 */
export default function AboutPage() {
  return (
    <>
      <div className="pt-[clamp(120px,18vh,200px)]" />
      <PulledQuote />
      <BioColumns />
      <InfluencesGrid />
      <CurrentlyPreviously />
      <Footer />
    </>
  );
}
