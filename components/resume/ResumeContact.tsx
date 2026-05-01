"use client";

import { motion } from "framer-motion";
import { revealBlock, revealStaggerBlocks } from "@/lib/motion";

const links = [
  {
    label: "hi@siladityaa.com",
    href: "mailto:hi@siladityaa.com",
    kind: "EMAIL",
  },
  {
    label: "linkedin.com/in/siladityaa",
    href: "https://linkedin.com/in/siladityaa",
    kind: "LINKEDIN",
  },
  {
    label: "siladityaa.com",
    href: "https://siladityaa.com",
    kind: "PORTFOLIO",
  },
];

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
        className="text-mono-s tracking-wider text-[color:var(--surface-graphite)]"
      >
        CONTACT
      </motion.h2>

      <motion.div
        variants={revealBlock}
        className="flex flex-col gap-4 md:flex-row md:gap-12"
      >
        {links.map((link) => (
          <div key={link.kind} className="flex flex-col gap-1">
            <span className="text-mono-s text-[color:var(--surface-graphite)]">
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
        className="text-mono-s text-[color:var(--surface-graphite)]"
      >
        DESIGNED IN FIGMA · BUILT WITH NEXT.JS · SET IN INSTRUMENT SERIF +
        JETBRAINS MONO
      </motion.p>
    </motion.section>
  );
}
