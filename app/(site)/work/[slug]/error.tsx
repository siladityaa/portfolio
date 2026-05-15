"use client";

/**
 * TEMPORARY debugging error boundary for /work/[slug].
 * Surfaces the actual error message + digest so we can see what's
 * blowing up in production. Remove (or replace with prettier copy)
 * once the underlying issue is fixed.
 */
export default function CaseStudyError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className="mx-auto max-w-[720px] px-6 py-24 text-mono-s text-[color:var(--surface-graphite)]">
      <h1 className="mb-4 text-display-m italic text-[color:var(--surface-ink)]">
        Case-study render error
      </h1>
      <pre className="mt-4 whitespace-pre-wrap break-all rounded border border-[color:color-mix(in_srgb,var(--surface-graphite)_30%,transparent)] p-4 text-[color:var(--surface-ink)]">
        {error.message}
        {error.digest ? `\n\ndigest: ${error.digest}` : ""}
        {error.stack ? `\n\n${error.stack}` : ""}
      </pre>
      <button
        onClick={reset}
        className="mt-6 underline decoration-dotted underline-offset-4"
      >
        Try again
      </button>
    </section>
  );
}
