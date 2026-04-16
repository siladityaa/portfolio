"use client";

import { useState } from "react";
import { useWatch, useFormContext } from "react-hook-form";
import clsx from "clsx";

import type { ChapterSection } from "@/content/types";

import { ListActions } from "../fields/ListActions";
import { ProseBlockFields } from "./ProseBlockFields";
import { ImageGridFields } from "./ImageGridFields";
import { PullQuoteFields } from "./PullQuoteFields";
import { BeforeAfterFields } from "./BeforeAfterFields";
import { LockedSectionFields } from "./LockedSectionFields";
import { TabGroupFields } from "./TabGroupFields";
import { InfoTableFields } from "./InfoTableFields";
import { CardGridFields } from "./CardGridFields";
import { MockupFrameFields } from "./MockupFrameFields";
import { DividerFields } from "./DividerFields";

interface SectionAccordionProps {
  /** RHF field path of the section, e.g. `chapters.0.sections.3` */
  pathPrefix: string;
  index: number;
  total: number;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDelete: () => void;
}

const KIND_LABEL: Record<ChapterSection["kind"], string> = {
  proseBlock: "PROSE BLOCK",
  imageGrid: "IMAGE GRID",
  pullQuote: "PULL QUOTE",
  beforeAfter: "BEFORE / AFTER",
  lockedSection: "LOCKED SECTION (NDA)",
  tabGroup: "TAB GROUP",
  infoTable: "INFO TABLE",
  cardGrid: "CARD GRID",
  mockupFrame: "MOCKUP FRAME",
  divider: "DIVIDER",
};

/**
 * Collapsible accordion row for a single chapter section.
 *
 * Header: index number, kind label, and a 60-char preview of the first
 * text-bearing field. Click to expand → renders the right `*Fields`
 * subform for the section's `kind`.
 *
 * The first row in any chapter is expanded by default; subsequent rows
 * are collapsed. Open state is local to the row — refreshing collapses
 * everything (acceptable for v1).
 */
export function SectionAccordion({
  pathPrefix,
  index,
  total,
  onMoveUp,
  onMoveDown,
  onDelete,
}: SectionAccordionProps) {
  const { control } = useFormContext();
  const section = useWatch({ control, name: pathPrefix }) as
    | ChapterSection
    | undefined;
  const [isOpen, setIsOpen] = useState(index === 0);

  if (!section) return null;

  const kindLabel = KIND_LABEL[section.kind];
  const preview = previewForSection(section);

  return (
    <div
      className={clsx(
        "border-t border-[color:color-mix(in_srgb,var(--surface-graphite)_25%,transparent)]",
        isOpen && "bg-[color:color-mix(in_srgb,var(--surface-graphite)_5%,transparent)]",
      )}
    >
      <header className="flex items-start gap-3 px-4 py-4">
        <button
          type="button"
          onClick={() => setIsOpen((o) => !o)}
          className="flex flex-1 items-start gap-4 text-left"
          aria-expanded={isOpen}
        >
          <span className="text-mono-s text-[color:var(--surface-graphite)]">
            {String(index + 1).padStart(2, "0")}
          </span>
          <div className="flex flex-1 flex-col gap-1">
            <span className="text-mono-s text-[color:var(--surface-graphite)]">
              {kindLabel}
            </span>
            {preview ? (
              <span className="text-body italic text-[color:var(--surface-ink)]">
                {preview}
              </span>
            ) : (
              <span className="text-body italic text-[color:color-mix(in_srgb,var(--surface-graphite)_60%,transparent)]">
                Empty
              </span>
            )}
          </div>
          <span
            aria-hidden
            className="text-mono-s text-[color:var(--surface-graphite)]"
          >
            {isOpen ? "−" : "+"}
          </span>
        </button>
        <ListActions
          index={index}
          total={total}
          onMoveUp={onMoveUp}
          onMoveDown={onMoveDown}
          onDelete={onDelete}
        />
      </header>

      {isOpen ? (
        <div className="border-t border-[color:color-mix(in_srgb,var(--surface-graphite)_15%,transparent)] px-4 py-6">
          <SubformDispatcher kind={section.kind} pathPrefix={pathPrefix} />
        </div>
      ) : null}
    </div>
  );
}

/* ---------- Dispatcher: kind → subform component ----------------------- */

function SubformDispatcher({
  kind,
  pathPrefix,
}: {
  kind: ChapterSection["kind"];
  pathPrefix: string;
}) {
  switch (kind) {
    case "proseBlock":
      return <ProseBlockFields pathPrefix={pathPrefix} />;
    case "imageGrid":
      return <ImageGridFields pathPrefix={pathPrefix} />;
    case "pullQuote":
      return <PullQuoteFields pathPrefix={pathPrefix} />;
    case "beforeAfter":
      return <BeforeAfterFields pathPrefix={pathPrefix} />;
    case "lockedSection":
      return <LockedSectionFields pathPrefix={pathPrefix} />;
    case "tabGroup":
      return <TabGroupFields pathPrefix={pathPrefix} />;
    case "infoTable":
      return <InfoTableFields pathPrefix={pathPrefix} />;
    case "cardGrid":
      return <CardGridFields pathPrefix={pathPrefix} />;
    case "mockupFrame":
      return <MockupFrameFields pathPrefix={pathPrefix} />;
    case "divider":
      return <DividerFields />;
    default: {
      // Exhaustive switch — TS errors if a kind is missed.
      const _exhaustive: never = kind;
      return null;
    }
  }
}

/* ---------- Preview text for the collapsed accordion row --------------- */

function previewForSection(section: ChapterSection): string | null {
  switch (section.kind) {
    case "proseBlock":
      return ellipsis(section.body);
    case "pullQuote":
      return ellipsis(section.body);
    case "lockedSection":
      return ellipsis(section.title);
    case "imageGrid":
      return `${section.images.length} image${section.images.length === 1 ? "" : "s"}, ${section.cols} col${section.cols === 1 ? "" : "s"}`;
    case "beforeAfter":
      return `${section.before.label} → ${section.after.label}`;
    case "tabGroup":
      return section.tabs.map((t) => t.label).filter(Boolean).join(" · ") || null;
    case "infoTable":
      return `${section.columns.length} cols × ${section.rows.length} rows`;
    case "cardGrid":
      return `${section.cards.length} card${section.cards.length === 1 ? "" : "s"}`;
    case "mockupFrame":
      return ellipsis(section.alt || section.src);
    case "divider":
      return "•—•";
    default:
      return null;
  }
}

function ellipsis(text: string, max = 60): string | null {
  if (!text) return null;
  return text.length > max ? text.slice(0, max).trim() + "…" : text;
}
