import Link from "next/link";

/**
 * Shown when someone signs in with a GitHub account that isn't on the
 * allow-list. The callback route clears any session cookie before
 * redirecting here, so the user is fully signed out — the Try Again button
 * just restarts the OAuth flow.
 *
 * Deliberately a dead-end in tone: single quiet line, no affordances beyond
 * "try again" and "back to the site". Matches the public `/about` voice.
 */
export default function ForbiddenPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 py-24">
      <div className="flex w-full max-w-[440px] flex-col gap-8">
        <header className="flex flex-col gap-3">
          <span className="text-mono-s text-[color:var(--surface-graphite)]">
            403 — FORBIDDEN
          </span>
          <h1 className="text-display-l italic text-[color:var(--surface-ink)]">
            Not your CMS.
          </h1>
          <p className="text-body text-[color:var(--surface-graphite)]">
            This admin area is gated to a single GitHub account. You signed in
            with a different one. If you&rsquo;re Siladityaa and this looks
            wrong, sign out of GitHub in another tab and try again.
          </p>
        </header>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/api/auth/github"
            className="inline-flex items-center border border-[color:var(--surface-ink)] bg-[color:var(--surface-ink)] px-4 py-3 text-mono-s text-[color:var(--surface-paper)] transition-opacity duration-300 ease-[var(--ease-out-soft)] hover:opacity-90"
          >
            TRY AGAIN
          </Link>
          <Link
            href="/"
            className="inline-flex items-center border border-[color:var(--surface-ink)] px-4 py-3 text-mono-s text-[color:var(--surface-ink)] transition-opacity duration-300 ease-[var(--ease-out-soft)] hover:opacity-60"
          >
            BACK TO SITE
          </Link>
        </div>
      </div>
    </main>
  );
}
