"use client";

import Link from "next/link";
import { useState } from "react";
import clsx from "clsx";

import { RequestAccessButton } from "./RequestAccessButton";

export interface ProjectRowData {
  number: string; // "001"
  year: string; // "2024 — 2025"
  client: string; // "META · CONFIDENTIAL"
  title: string;
  slug: string;
  status: "public" | "nda";
  keyColor: string;
}

interface ProjectListProps {
  rows: ProjectRowData[];
}

/**
 * Brief §4.1 — the selected work list on the home page.
 *
 * Full-width rows, hover fills with keyColor, other rows dim to 40%.
 *
 * Layout note: we intentionally do NOT wrap the whole row in a Link because
 * that would nest an anchor (the NDA "REQUEST ACCESS" mailto) inside another
 * anchor. Instead the <li> owns hover state, and the title area is a Link.
 * Clicking anywhere on the title area navigates; the mailto dot in the
 * metadata column is its own separate anchor.
 */
export function ProjectRowList({ rows }: ProjectListProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <ul className="flex flex-col" role="list">
      {rows.map((row, i) => {
        const isHovered = hoveredIndex === i;
        const isDimmed = hoveredIndex !== null && !isHovered;
        return (
          <li
            key={row.slug}
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
            className={clsx(
              "group relative hairline-top transition-opacity duration-500 ease-[var(--ease-out-soft)]",
              isDimmed && "opacity-40",
            )}
            style={
              isHovered
                ? ({ backgroundColor: row.keyColor } as React.CSSProperties)
                : undefined
            }
          >
            <div className="mx-auto flex min-h-[240px] max-w-[1280px] items-center gap-12 px-[clamp(24px,4vw,64px)] py-12">
              {/* Left: metadata column */}
              <div
                className={clsx(
                  "flex w-[220px] shrink-0 flex-col gap-1 text-mono-s",
                  isHovered
                    ? "text-[color:rgba(246,245,241,0.85)]"
                    : "text-[color:var(--surface-graphite)]",
                )}
              >
                <span>PROJECT {row.number}</span>
                <span>{row.year}</span>
                <span>{row.client}</span>
                <div className="mt-2">
                  {row.status === "nda" ? (
                    <RequestAccessButton
                      projectTitle={row.title}
                      variant="row-dot"
                    />
                  ) : (
                    <span
                      className={clsx(
                        isHovered
                          ? "text-[color:rgba(246,245,241,0.85)]"
                          : "text-[color:var(--surface-graphite)]",
                      )}
                    >
                      [● PUBLIC]
                    </span>
                  )}
                </div>
              </div>

              {/* Right: title — the navigation link sits here, so the mailto
                  in the left column can remain its own anchor. */}
              <Link
                href={`/work/${row.slug}`}
                data-cursor="open"
                className="flex flex-1 items-center justify-between gap-8"
              >
                <h3
                  className={clsx(
                    "text-display-l transition-colors duration-500 ease-[var(--ease-out-soft)]",
                    isHovered
                      ? "text-[color:#f6f5f1]"
                      : "text-[color:var(--surface-ink)]",
                  )}
                >
                  {row.title}
                </h3>
                {/* Still-image slot — intentional placeholder block.
                    Phase 4 drops real imagery here. */}
                <div
                  className={clsx(
                    "hidden h-[180px] w-[260px] shrink-0 transition-all duration-500 ease-[var(--ease-out-soft)] md:block",
                    isHovered
                      ? "translate-x-0 opacity-100"
                      : "translate-x-6 opacity-0",
                  )}
                  style={{
                    backgroundColor:
                      "color-mix(in srgb, #f6f5f1 15%, transparent)",
                  }}
                  aria-hidden
                />
              </Link>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
