"use client";

import { motion } from "framer-motion";
import { revealBlock, revealStaggerBlocks } from "@/lib/motion";
import { resume } from "@/content/resume";

const experience = resume.experience;

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
        className="text-label-s tracking-wider text-[color:var(--surface-graphite)]"
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
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-label-s text-[color:var(--surface-graphite)]">
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
