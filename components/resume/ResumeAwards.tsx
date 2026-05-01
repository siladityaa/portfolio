"use client";

import { motion } from "framer-motion";
import { revealBlock, revealStaggerBlocks } from "@/lib/motion";

const awards = [
  {
    title: "International Design Award",
    detail: "Silver & Bronze",
    year: "2020",
  },
  {
    title: "MUSE Design Awards",
    detail: "Gold",
    year: "2020",
  },
  {
    title: "Adobe Design Achievement Awards",
    detail: "Semifinalist",
    year: "2020",
  },
  {
    title: "Dutch Design Week",
    detail: "Featured Project",
    year: "2020",
  },
  {
    title: "Bradford Hall End Scholarship",
    detail: "Recipient",
    year: "2019",
  },
];

export function ResumeAwards() {
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
        AWARDS & RECOGNITION
      </motion.h2>

      <div className="flex flex-col">
        {awards.map((award, i) => (
          <motion.div
            key={award.title}
            variants={revealBlock}
            className={`flex items-baseline justify-between gap-4 py-4 ${
              i !== awards.length - 1
                ? "border-b border-[color:color-mix(in_srgb,var(--surface-graphite)_15%,transparent)]"
                : ""
            }`}
          >
            <div className="flex flex-col gap-1">
              <span className="text-body text-[color:var(--surface-ink)]">
                {award.title}
              </span>
              <span className="text-mono-s text-[color:var(--surface-graphite)]">
                {award.detail.toUpperCase()}
              </span>
            </div>
            <span className="shrink-0 text-mono-s text-[color:var(--surface-graphite)]">
              {award.year}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
