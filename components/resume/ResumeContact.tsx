"use client";

import { motion } from "framer-motion";
import { revealBlock, revealStaggerBlocks } from "@/lib/motion";
import { resume } from "@/content/resume";

const links = resume.contact;

export function ResumeContact() {
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
        className="text-label-s text-[color:var(--surface-graphite)]"
      >
        Contact
      </motion.h2>

      <motion.div
        variants={revealBlock}
        className="flex flex-col gap-4 md:flex-row md:gap-12"
      >
        {links.map((link) => (
          <div key={link.kind} className="flex flex-col gap-1">
            <span className="text-label-s text-[color:var(--surface-graphite)]">
              {link.kind}
            </span>
            <a
              href={link.href}
              target={link.kind !== "EMAIL" ? "_blank" : undefined}
              rel={link.kind !== "EMAIL" ? "noopener noreferrer" : undefined}
              data-cursor="open"
              className="text-body text-[color:var(--surface-ink)] underline decoration-[color:color-mix(in_srgb,var(--surface-graphite)_30%,transparent)] underline-offset-4 transition-opacity duration-300 ease-[var(--ease-out-soft)] hover:opacity-60"
            >
              {link.label}
            </a>
          </div>
        ))}
      </motion.div>

      <motion.p
        variants={revealBlock}
        className="text-label-s text-[color:var(--surface-graphite)]"
      >
        Designed in Figma · Built with Next.js · Set in Instrument Serif +
        JetBrains Mono
      </motion.p>
    </motion.section>
  );
}
