import type { Metadata } from "next";

import { ResumeHero } from "@/components/resume/ResumeHero";
import { ResumeExperience } from "@/components/resume/ResumeExperience";
import { ResumeEducation } from "@/components/resume/ResumeEducation";
import { ResumeSkills } from "@/components/resume/ResumeSkills";
import { ResumeAwards } from "@/components/resume/ResumeAwards";
import { ResumeContact } from "@/components/resume/ResumeContact";
import { ResumeDownloadFAB } from "@/components/resume/ResumeDownloadFAB";

export const metadata: Metadata = {
  title: "Resume — Siladityaa Sharma",
  description:
    "Senior Product Designer at Meta Reality Labs. Wearables, AI, and interaction design.",
};

export default function ResumePage() {
  return (
    <article className="mx-auto flex w-full max-w-[1280px] flex-col gap-[clamp(48px,8vw,96px)] px-[clamp(24px,4vw,64px)] py-[clamp(100px,14vw,160px)]">
      <ResumeHero />

      {/* Marquee */}
      <div className="overflow-hidden border-y border-[color:color-mix(in_srgb,var(--surface-graphite)_15%,transparent)] py-4">
        <div className="animate-marquee flex whitespace-nowrap">
          {Array.from({ length: 4 }).map((_, i) => (
            <span
              key={i}
              className="mx-8 text-label-s tracking-wide text-[color:var(--surface-graphite)]"
            >
              Product Design / AI Design / Wearables / UX Design / Interaction
              Design / Design Systems / Prototyping / Motion Design / UX
              Research / Design Thinking /
            </span>
          ))}
        </div>
      </div>

      <ResumeExperience />
      <ResumeEducation />
      <ResumeSkills />
      <ResumeAwards />
      <ResumeContact />

      <ResumeDownloadFAB />
    </article>
  );
}
