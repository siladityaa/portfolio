"use client";

import { motion } from "framer-motion";
import { revealBlock, revealStaggerBlocks } from "@/lib/motion";

const skillGroups = [
  {
    title: "Design",
    skills: [
      "Interaction Design",
      "UX Research",
      "Design Thinking",
      "Human-Centered Design",
      "User Interface Design",
      "User Experience Design",
      "Wireframes & Prototypes",
      "Journey Maps & Personas",
      "Design Systems",
      "Prototyping",
    ],
  },
  {
    title: "Technical",
    skills: [
      "HTML / CSS / JavaScript",
      "Adobe Creative Suite",
      "Motion Graphics",
      "Figma",
      "Principle",
      "After Effects",
    ],
  },
  {
    title: "Soft Skills",
    skills: [
      "Leadership",
      "Communication",
      "Cross-discipline Collaboration",
      "Problem Solving",
      "Mentorship",
    ],
  },
];

export function ResumeSkills() {
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
        SKILLS
      </motion.h2>

      <div className="grid gap-8 md:grid-cols-3">
        {skillGroups.map((group) => (
          <motion.div
            key={group.title}
            variants={revealBlock}
            className="flex flex-col gap-4"
          >
            <h3 className="text-display-s italic text-[color:var(--surface-ink)]">
              {group.title}
            </h3>
            <div className="flex flex-wrap gap-2">
              {group.skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full border border-[color:color-mix(in_srgb,var(--surface-graphite)_20%,transparent)] px-3 py-1 text-mono-s text-[color:var(--surface-graphite)]"
                >
                  {skill}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
