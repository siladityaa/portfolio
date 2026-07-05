"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { createCaseStudy } from "@/app/(admin)/admin/actions";

/**
 * Inline "create new case study" form. Lives at the top of the case studies
 * list page. Generates a slug from the title automatically, but the slug
 * field is editable. On success, navigates to the new case study's editor.
 */
export function NewCaseStudyForm() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleTitleChange = (value: string) => {
    setTitle(value);
    // Auto-derive slug only while user hasn't manually edited it.
    setSlug(slugify(value));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const res = await createCaseStudy(slug, title);
      if (res.status === "ok" && res.slug) {
        router.push(`/admin/case-studies/${res.slug}`);
        return;
      }
      setError(res.status === "ok" ? "Saved." : res.message);
    });
  };

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center border border-[color:var(--surface-ink)] px-3 py-2 text-label-s text-[color:var(--surface-ink)] transition-opacity duration-300 ease-[var(--ease-out-soft)] hover:opacity-60"
      >
        + NEW CASE STUDY
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 rounded-[4px] border border-[color:color-mix(in_srgb,var(--surface-graphite)_25%,transparent)] bg-[color:color-mix(in_srgb,var(--surface-graphite)_4%,transparent)] p-5"
    >
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="text-display-s italic text-[color:var(--surface-ink)]">
          New case study
        </h3>
        <button
          type="button"
          onClick={() => {
            setOpen(false);
            setTitle("");
            setSlug("");
            setError(null);
          }}
          className="text-label-s text-[color:var(--surface-graphite)] transition-opacity duration-300 ease-[var(--ease-out-soft)] hover:opacity-60"
          disabled={pending}
        >
          CANCEL
        </button>
      </div>

      <label className="flex flex-col gap-2">
        <span className="text-label-s text-[color:var(--surface-graphite)]">
          TITLE
        </span>
        <input
          type="text"
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          required
          autoFocus
          placeholder="My new project"
          className="border-b border-[color:color-mix(in_srgb,var(--surface-graphite)_30%,transparent)] bg-transparent py-2 text-body text-[color:var(--surface-ink)] outline-none focus:border-[color:var(--surface-ink)]"
        />
      </label>

      <label className="flex flex-col gap-2">
        <span className="text-label-s text-[color:var(--surface-graphite)]">
          SLUG
        </span>
        <input
          type="text"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          required
          placeholder="my-new-project"
          pattern="[a-z0-9]+(-[a-z0-9]+)*"
          className="border-b border-[color:color-mix(in_srgb,var(--surface-graphite)_30%,transparent)] bg-transparent py-2 text-label-m text-[color:var(--surface-ink)] outline-none focus:border-[color:var(--surface-ink)]"
        />
        <span className="text-label-s text-[color:var(--surface-graphite)]">
          URL will be /work/{slug || "…"} · also the JSON filename. Lowercase
          letters, numbers, and dashes only.
        </span>
      </label>

      {error && (
        <p className="text-label-s text-[color:var(--surface-signal)]">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending || !title.trim() || !slug.trim()}
        className="self-start bg-[color:var(--surface-ink)] px-4 py-2 text-label-s text-[color:var(--surface-paper)] transition-opacity duration-300 ease-[var(--ease-out-soft)] hover:opacity-80 disabled:opacity-40"
      >
        {pending ? "CREATING…" : "CREATE CASE STUDY"}
      </button>
    </form>
  );
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
