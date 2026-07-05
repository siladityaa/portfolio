import Link from "next/link";

import { unlockPreview } from "@/lib/preview-actions";

interface PreviewGateProps {
  slug: string;
  title: string;
  hadBadAttempt: boolean;
}

/**
 * Password gate for private case studies. Server component — the form
 * posts to the `unlockPreview` server action, which validates against
 * `STUDIO_PREVIEW_PASSWORD` and sets the `studio-preview` cookie on
 * success.
 *
 * The gate matches the site's editorial chrome: mono labels, italic
 * serif heading, hairline rules. Wrong password → redirect back with
 * `?bad=1` and a quiet error line.
 */
export function PreviewGate({ slug, title, hadBadAttempt }: PreviewGateProps) {
  const action = unlockPreview.bind(null, slug);

  return (
    <section className="mx-auto flex min-h-[100svh] max-w-[640px] flex-col justify-center px-[clamp(24px,4vw,64px)] py-[clamp(80px,16vh,160px)]">
      <span className="text-label-s text-[color:var(--surface-graphite)]">
        Private case study
      </span>
      <h1 className="mt-6 text-display-l italic leading-[1.05] text-[color:var(--surface-ink)] max-md:text-[2rem]">
        {title}
      </h1>
      <p className="mt-6 max-w-[42ch] text-body text-[color:var(--surface-graphite)]">
        This case study is still being written. If you have the preview
        password, drop it in below.
      </p>

      <form action={action} className="mt-10 flex flex-col gap-3">
        <label
          htmlFor="preview-password"
          className="text-label-s text-[color:var(--surface-graphite)]"
        >
          Password
        </label>
        <input
          id="preview-password"
          name="password"
          type="password"
          autoFocus
          autoComplete="current-password"
          required
          className="w-full border-b border-[color:color-mix(in_srgb,var(--surface-graphite)_35%,transparent)] bg-transparent py-3 text-body text-[color:var(--surface-ink)] outline-none transition-colors duration-200 focus:border-[color:var(--surface-ink)]"
        />
        {hadBadAttempt ? (
          <span className="text-label-s text-[color:var(--surface-signal)]">
            ◯ INCORRECT — Try again
          </span>
        ) : null}

        <div className="mt-6 flex items-center justify-between gap-6">
          <Link
            href="/"
            className="text-label-s text-[color:var(--surface-graphite)] transition-opacity duration-300 hover:opacity-60"
          >
            ← Back home
          </Link>
          <button
            type="submit"
            className="text-label-s text-[color:var(--surface-ink)] transition-opacity duration-300 hover:opacity-60"
          >
            UNLOCK →
          </button>
        </div>
      </form>
    </section>
  );
}
