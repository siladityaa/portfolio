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
          SENIOR PRODUCT DESIGNER · META REALITY LABS · LOS ANGELES, CA
        </p>
      </motion.div>

      <motion.div
        variants={revealBlock}
        className="flex flex-col gap-4 md:flex-row md:gap-12"
      >
        <div className="max-w-[640px] flex flex-col gap-4">
          <p className="text-body text-[color:var(--surface-ink)]">
            Senior product designer with 5 years of shipping consumer
            experiences at scale. I lead identity, account, and social-profile
            design across Meta&rsquo;s wearables ecosystem, where I balance
            complex platform systems with the visual craft that people
            actually feel when they use a product.
          </p>
          <p className="text-body text-[color:var(--surface-graphite)]">
            Comfortable moving between strategy, storytelling, and execution,
            and at home with the kind of cross-surface, multi-user-type
            problems that account and admin experiences demand.
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
