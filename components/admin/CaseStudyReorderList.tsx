"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { reorderCaseStudies } from "@/app/(admin)/admin/actions";

export interface CaseStudyRow {
  slug: string;
  title: string;
  timeline: string;
  galleryCount: number;
  tags: string[];
}

/**
 * Admin list with drag-free up/down reordering. Local state mirrors the
 * server order; "Save order" commits the new sequence to
 * `content/work-order.json`. The public site picks it up on the next
 * Vercel build (~60s).
 */
export function CaseStudyReorderList({ rows }: { rows: CaseStudyRow[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [items, setItems] = useState(rows);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const dirty =
    items.length !== rows.length ||
    items.some((it, i) => it.slug !== rows[i]?.slug);

  function move(i: number, dir: -1 | 1) {
    const next = [...items];
    const j = i + dir;
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j], next[i]];
    setItems(next);
    setSavedAt(null);
    setError(null);
  }

  function reset() {
    setItems(rows);
    setError(null);
    setSavedAt(null);
  }

  function save() {
    setError(null);
    startTransition(async () => {
      const res = await reorderCaseStudies(items.map((it) => it.slug));
      if (res.status === "ok") {
        setSavedAt(Date.now());
        router.refresh();
      } else {
        setError(res.message);
      }
    });
  }

  return (
    <div className="flex flex-col gap-6">
      {dirty && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-[4px] border border-[color:color-mix(in_srgb,var(--surface-signal)_50%,transparent)] bg-[color:color-mix(in_srgb,var(--surface-signal)_8%,transparent)] p-4">
          <span className="text-mono-s text-[color:var(--surface-ink)]">
            Order changed — unsaved
          </span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={reset}
              disabled={pending}
              className="text-mono-s text-[color:var(--surface-graphite)] transition-opacity duration-300 ease-[var(--ease-out-soft)] hover:opacity-60"
            >
              RESET
            </button>
            <button
              type="button"
              onClick={save}
              disabled={pending}
              className="bg-[color:var(--surface-ink)] px-4 py-2 text-mono-s text-[color:var(--surface-paper)] transition-opacity duration-300 ease-[var(--ease-out-soft)] hover:opacity-80 disabled:opacity-40"
            >
              {pending ? "SAVING…" : "SAVE ORDER"}
            </button>
          </div>
        </div>
      )}
      {!dirty && savedAt && (
        <div className="rounded-[4px] border border-[color:color-mix(in_srgb,var(--surface-graphite)_25%,transparent)] bg-[color:color-mix(in_srgb,var(--surface-graphite)_4%,transparent)] p-4 text-mono-s text-[color:var(--surface-graphite)]">
          ORDER SAVED · LIVE IN ~60S
        </div>
      )}
      {error && (
        <div className="rounded-[4px] border border-[color:var(--surface-signal)] bg-[color:color-mix(in_srgb,var(--surface-signal)_8%,transparent)] p-4 text-mono-s text-[color:var(--surface-signal)]">
          {error}
        </div>
      )}

      <ul className="flex flex-col">
        {items.map((row, i) => (
          <li
            key={row.slug}
            className="grid grid-cols-12 items-center gap-6 border-t border-[color:color-mix(in_srgb,var(--surface-graphite)_25%,transparent)] py-6 last:border-b"
          >
            <span className="col-span-1 text-mono-s text-[color:var(--surface-graphite)] tabular-nums">
              {String(i + 1).padStart(2, "0")}
            </span>
            <Link
              href={`/admin/case-studies/${row.slug}`}
              className="col-span-7 transition-opacity duration-300 ease-[var(--ease-out-soft)] hover:opacity-60"
            >
              <h2 className="text-display-s italic text-[color:var(--surface-ink)]">
                {row.title}
              </h2>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-mono-s text-[color:var(--surface-graphite)]">
                <span>{row.timeline}</span>
                <span>·</span>
                <span>
                  {row.galleryCount} bento tile
                  {row.galleryCount === 1 ? "" : "s"}
                </span>
                {row.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center rounded-full border border-[color:color-mix(in_srgb,var(--surface-graphite)_40%,transparent)] px-2 py-0.5"
                  >
                    {tag.toUpperCase()}
                  </span>
                ))}
              </div>
            </Link>
            <div className="col-span-4 flex items-center justify-end gap-3 text-mono-s">
              <button
                type="button"
                onClick={() => move(i, -1)}
                disabled={i === 0 || pending}
                aria-label="Move up"
                className="inline-flex h-8 w-8 items-center justify-center border border-[color:color-mix(in_srgb,var(--surface-graphite)_25%,transparent)] text-[color:var(--surface-graphite)] transition-colors duration-300 ease-[var(--ease-out-soft)] hover:border-[color:var(--surface-ink)] hover:text-[color:var(--surface-ink)] disabled:cursor-not-allowed disabled:opacity-30"
              >
                ↑
              </button>
              <button
                type="button"
                onClick={() => move(i, 1)}
                disabled={i === items.length - 1 || pending}
                aria-label="Move down"
                className="inline-flex h-8 w-8 items-center justify-center border border-[color:color-mix(in_srgb,var(--surface-graphite)_25%,transparent)] text-[color:var(--surface-graphite)] transition-colors duration-300 ease-[var(--ease-out-soft)] hover:border-[color:var(--surface-ink)] hover:text-[color:var(--surface-ink)] disabled:cursor-not-allowed disabled:opacity-30"
              >
                ↓
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
