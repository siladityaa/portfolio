"use client";

import { useCallback, useState } from "react";
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
  const [downloading, setDownloading] = useState(false);

  const handleDownload = useCallback(async () => {
    setDownloading(true);
    try {
      const { generateResumePDF } = await import("@/lib/resume-pdf");
      generateResumePDF();
    } catch (err) {
      console.error("PDF generation failed:", err);
    } finally {
      setDownloading(false);
    }
  }, []);

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

      {/* Download PDF */}
      <motion.div variants={revealBlock}>
        <button
          type="button"
          onClick={handleDownload}
          disabled={downloading}
          data-cursor="open"
          className="group inline-flex items-center gap-3 rounded-full border border-[color:var(--surface-ink)] px-6 py-3 text-mono-s text-[color:var(--surface-ink)] transition-all duration-300 ease-[var(--ease-out-soft)] hover:bg-[color:var(--surface-ink)] hover:text-[color:var(--surface-paper)] disabled:opacity-50"
        >
          <DownloadIcon />
          <span>{downloading ? "GENERATING..." : "DOWNLOAD RESUME PDF"}</span>
        </button>
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

function DownloadIcon() {
  return (
    <svg
      aria-hidden
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 2 v8 M4.5 7.5 L8 11 L11.5 7.5" />
      <path d="M3 13 h10" />
    </svg>
  );
}
