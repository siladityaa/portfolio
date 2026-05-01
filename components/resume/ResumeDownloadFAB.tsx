"use client";

import { useCallback, useState } from "react";
import { motion } from "framer-motion";

export function ResumeDownloadFAB() {
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
    <motion.button
      type="button"
      onClick={handleDownload}
      disabled={downloading}
      data-cursor="open"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="fixed bottom-[calc(clamp(24px,4vw,64px)+40px)] right-[clamp(24px,4vw,64px)] z-40 flex items-center gap-2.5 rounded-full bg-[color:var(--surface-ink)] px-5 py-3 text-mono-s text-[color:var(--surface-paper)] shadow-lg transition-all duration-300 ease-[var(--ease-out-soft)] hover:scale-105 hover:shadow-xl active:scale-95 disabled:opacity-50"
    >
      <DownloadIcon />
      <span>{downloading ? "GENERATING..." : "DOWNLOAD PDF"}</span>
    </motion.button>
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
