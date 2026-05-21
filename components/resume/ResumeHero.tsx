"use client";

import { motion } from "framer-motion";
import { revealBlock, revealStaggerBlocks } from "@/lib/motion";
import { resume } from "@/content/resume";

export function ResumeHero() {
  return (
    <motion.header
      variants={revealStaggerBlocks}
      initial="hidden"
      animate="visible"
      className="flex flex-col gap-8"
    >
      <motion.div variants={revealBlock} className="flex flex-col gap-3">
        <h1 className="text-display-l italic text-[color:var(--surface-ink)]">
          {resume.name}
        </h1>
        <p className="text-mono-s tracking-wider text-[color:var(--surface-graphite)]">
          {resume.tagline.toUpperCase()}
        </p>
      </motion.div>

      <motion.div
        variants={revealBlock}
        className="flex flex-col gap-4 md:flex-row md:gap-12"
      >
        <div className="max-w-[640px] flex flex-col gap-4">
          <p className="text-body text-[color:var(--surface-ink)]">
            {resume.summary.primary}
          </p>
          <p className="text-body text-[color:var(--surface-graphite)]">
            {resume.summary.secondary}
          </p>
        </div>

        {/* Quick stats */}
        <div className="flex gap-8 md:flex-col md:gap-6 md:border-l md:border-[color:color-mix(in_srgb,var(--surface-graphite)_15%,transparent)] md:pl-8">
          {resume.stats.map((stat) => (
            <Stat key={stat.label} value={stat.value} label={stat.label} />
          ))}
        </div>
      </motion.div>

      {/* Tags */}
      <motion.div variants={revealBlock} className="flex flex-wrap gap-2">
        {resume.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-[color:color-mix(in_srgb,var(--surface-graphite)_20%,transparent)] px-3 py-1 text-mono-s text-[color:var(--surface-graphite)]"
          >
            {tag}
          </span>
        ))}
      </motion.div>
    </motion.header>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-display-s italic text-[color:var(--surface-ink)]">
        {value}
      </span>
      <span className="text-mono-s text-[color:var(--surface-graphite)]">
        {label}
      </span>
    </div>
  );
}
