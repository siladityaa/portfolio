"use client";

import { motion } from "framer-motion";
import { revealBlock, revealStaggerBlocks } from "@/lib/motion";

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
          Siladityaa Sharma
        </h1>
        <p className="text-mono-s tracking-wider text-[color:var(--surface-graphite)]">
          SENIOR PRODUCT DESIGNER · META REALITY LABS
        </p>
      </motion.div>

      <motion.div
        variants={revealBlock}
        className="flex flex-col gap-4 md:flex-row md:gap-12"
      >
        <div className="max-w-[640px] flex flex-col gap-4">
          <p className="text-body text-[color:var(--surface-ink)]">
            Creative technologist with user experience research and design
            expertise across AI, wearables, and hardware. Known for exploring
            future-states and creating engaging scenarios to inform design ideas
            from concept to shippable products.
          </p>
          <p className="text-body text-[color:var(--surface-graphite)]">
            A demonstrated history in prototyping simple to complex concepts,
            regardless of feasibility. From wild conceptualization and ideation
            to realistic, shippable products — I love the entire spectrum.
          </p>
        </div>

        {/* Quick stats */}
        <div className="flex gap-8 md:flex-col md:gap-6 md:border-l md:border-[color:color-mix(in_srgb,var(--surface-graphite)_15%,transparent)] md:pl-8">
          <Stat value="5+" label="Years in Tech" />
          <Stat value="10+" label="Product Launches" />
          <Stat value="1M+" label="Products Sold" />
          <Stat value="2+" label="Years in Academia" />
        </div>
      </motion.div>

      {/* Tags */}
      <motion.div variants={revealBlock} className="flex flex-wrap gap-2">
        {["AI", "Hardware", "Wearables"].map((tag) => (
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
