"use client";

import { motion } from "framer-motion";
import { revealBlock, revealStaggerBlocks } from "@/lib/motion";

export function ResumeEducation() {
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
        EDUCATION
      </motion.h2>

      <motion.div
        variants={revealBlock}
        className="flex flex-col gap-4 border-l border-[color:color-mix(in_srgb,var(--surface-graphite)_15%,transparent)] pl-6"
      >
        <div className="flex flex-col gap-1">
          <h3 className="text-display-s italic text-[color:var(--surface-ink)]">
            ArtCenter College of Design
          </h3>
          <p className="text-mono-s text-[color:var(--surface-graphite)]">
            BS INTERACTION DESIGN · BUSINESS MINOR · PASADENA, CA
          </p>
        </div>

        <ul className="flex flex-col gap-2">
          {[
            "Graduated with Honors",
            "Provost List — GPA above 3.80",
            "Interaction Design Scholarship Recipient",
          ].map((item, i) => (
            <li
              key={i}
              className="flex items-start gap-3 text-body text-[color:var(--surface-ink)]"
            >
              <span
                aria-hidden
                className="mt-[0.6em] inline-block h-[5px] w-[5px] shrink-0 rounded-full bg-[color:var(--surface-signal)]"
              />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </motion.div>
    </motion.section>
  );
}
