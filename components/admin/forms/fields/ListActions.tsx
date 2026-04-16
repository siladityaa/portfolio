"use client";

import clsx from "clsx";

interface ListActionsProps {
  index: number;
  total: number;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDelete: () => void;
}

/**
 * Up / Down / Delete button cluster used by every dynamic list in the
 * admin (chapters, sections, tracks, fact rows, influences, timeline rows).
 *
 * Up is disabled at index 0; Down is disabled at the last index.
 * Delete asks for confirmation via window.confirm — minimal v1.
 */
export function ListActions({
  index,
  total,
  onMoveUp,
  onMoveDown,
  onDelete,
}: ListActionsProps) {
  const isFirst = index === 0;
  const isLast = index === total - 1;

  return (
    <div className="flex shrink-0 items-center gap-1">
      <IconButton
        label="Move up"
        disabled={isFirst}
        onClick={onMoveUp}
        glyph="↑"
      />
      <IconButton
        label="Move down"
        disabled={isLast}
        onClick={onMoveDown}
        glyph="↓"
      />
      <IconButton
        label="Delete"
        onClick={() => {
          if (window.confirm("Delete this item?")) onDelete();
        }}
        glyph="×"
        tone="danger"
      />
    </div>
  );
}

interface IconButtonProps {
  label: string;
  glyph: string;
  onClick: () => void;
  disabled?: boolean;
  tone?: "default" | "danger";
}

function IconButton({
  label,
  glyph,
  onClick,
  disabled = false,
  tone = "default",
}: IconButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className={clsx(
        "inline-flex h-8 w-8 items-center justify-center border border-transparent text-mono-s transition-colors duration-300 ease-[var(--ease-out-soft)]",
        disabled && "cursor-not-allowed opacity-30",
        !disabled &&
          tone === "default" &&
          "text-[color:var(--surface-graphite)] hover:border-[color:var(--surface-ink)] hover:text-[color:var(--surface-ink)]",
        !disabled &&
          tone === "danger" &&
          "text-[color:var(--surface-graphite)] hover:border-[color:var(--surface-signal)] hover:text-[color:var(--surface-signal)]",
      )}
    >
      {glyph}
    </button>
  );
}
