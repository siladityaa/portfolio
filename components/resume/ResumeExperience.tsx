"use client";

import { motion } from "framer-motion";
import { revealBlock, revealStaggerBlocks } from "@/lib/motion";

const experience = [
  {
    company: "Meta Reality Labs",
    role: "Senior Product Designer",
    period: "Feb 2022 — Present",
    location: "Los Angeles, CA",
    bullets: [
      "Lead design for AI-powered experiences on Ray-Ban Meta smart glasses, defining interaction patterns for camera, audio, and multimodal AI features used by millions.",
      "Drove the Facebook to Meta product migration across surfaces, ensuring brand coherence during the company's largest rebrand.",
      "Designed and shipped the Spotify Tap integration for Ray-Ban Stories, enabling seamless music control through temple gestures.",
    ],
  },
  {
    company: "ArtCenter College of Design",
    role: "Adjunct Instructor",
    period: "May 2022 — Apr 2023",
    location: "Pasadena, CA",
    bullets: [
      "Taught interaction design and prototyping to undergraduate students, bridging industry practice with academic rigor.",
    ],
  },
  {
    company: "Meta",
    role: "Product Design Intern",
    period: "Jun 2021 — Sep 2021",
    location: "Remote",
    bullets: [
      "Contributed to early-stage AR glasses interaction design under NDA. Explored novel input paradigms for head-worn computing.",
    ],
  },
  {
    company: "Kley",
    role: "UX Designer & Developer Intern",
    period: "May 2020 — Jul 2020",
    location: "Remote",
    bullets: [
      "Designed and developed user interfaces for an early-stage startup, wearing both design and front-end engineering hats.",
    ],
  },
];

export function ResumeExperience() {
  return (
    <motion.section
      variants={revealStaggerBlocks}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className="flex flex-col gap-8"
    >
      <motion.h2
        variants={revealBlock}
        className="text-mono-s tracking-wider text-[color:var(--surface-graphite)]"
      >
        EXPERIENCE
      </motion.h2>

      <div className="flex flex-col gap-10">
        {experience.map((job) => (
          <motion.div
            key={`${job.company}-${job.period}`}
            variants={revealBlock}
            className="flex flex-col gap-4 border-l border-[color:color-mix(in_srgb,var(--surface-graphite)_15%,transparent)] pl-6"
          >
            <div className="flex flex-col gap-1">
              <h3 className="text-display-s italic text-[color:var(--surface-ink)]">
                {job.role}
              </h3>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-mono-s text-[color:var(--surface-graphite)]">
                <span>{job.company.toUpperCase()}</span>
                <span className="text-[color:color-mix(in_srgb,var(--surface-graphite)_40%,transparent)]">
                  /
                </span>
                <span>{job.period.toUpperCase()}</span>
                <span className="text-[color:color-mix(in_srgb,var(--surface-graphite)_40%,transparent)]">
                  /
                </span>
                <span>{job.location.toUpperCase()}</span>
              </div>
            </div>

            <ul className="flex flex-col gap-2">
              {job.bullets.map((bullet, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 text-body text-[color:var(--surface-ink)]"
                >
                  <span
                    aria-hidden
                    className="mt-[0.6em] inline-block h-[5px] w-[5px] shrink-0 rounded-full bg-[color:var(--surface-signal)]"
                  />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
