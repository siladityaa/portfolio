import Link from "next/link";

/**
 * CMS login — single "Sign in with GitHub" button, no sidebar, no LOGOUT.
 *
 * This page is excluded from the auth gate in `proxy.ts`. On submit, the
 * browser hits `/api/auth/github?from=<original path>` which redirects to
 * GitHub's authorize URL.
 *
 * The `?from=` param comes from the proxy redirect when an unauthed user
 * tries to open a gated page — after sign-in they land back where they
 * started instead of always on `/admin`.
 *
 * Errors surface via `?error=<code>`:
 *   - `config`   — env vars missing (client id/secret)
 *   - `state`    — CSRF check failed
 *   - `exchange` — GitHub rejected the code, or the /user call failed
 */
interface LoginPageProps {
  searchParams: Promise<{ from?: string; error?: string }>;
}

const ERROR_MESSAGES: Record<string, string> = {
  config:
    "OAuth isn't configured yet. Set GITHUB_OAUTH_CLIENT_ID and GITHUB_OAUTH_CLIENT_SECRET in .env.local.",
  state:
    "The sign-in link expired or was tampered with. Please try again.",
  exchange:
    "GitHub turned down the sign-in. Check the OAuth app's callback URL and secret.",
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { from, error } = await searchParams;
  const safeFrom = from && from.startsWith("/admin") ? from : "/admin";
  const errorMessage = error ? ERROR_MESSAGES[error] : undefined;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 py-24">
      <div className="flex w-full max-w-[440px] flex-col gap-8">
        <header className="flex flex-col gap-3">
          <Link
            href="/"
            className="text-mono-s text-[color:var(--surface-graphite)] transition-opacity duration-300 ease-[var(--ease-out-soft)] hover:text-[color:var(--surface-ink)]"
          >
            SILADITYAA · CMS
          </Link>
          <h1 className="text-display-l italic text-[color:var(--surface-ink)]">
            Sign in.
          </h1>
          <p className="text-body text-[color:var(--surface-graphite)]">
            Authorized with GitHub. Only Siladityaa&rsquo;s account can access
            the editor — everyone else is politely turned away.
          </p>
        </header>

        <form action="/api/auth/github" method="GET" className="flex flex-col gap-3">
          <input type="hidden" name="from" value={safeFrom} />
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-3 border border-[color:var(--surface-ink)] bg-[color:var(--surface-ink)] px-6 py-4 text-mono-s text-[color:var(--surface-paper)] transition-opacity duration-300 ease-[var(--ease-out-soft)] hover:opacity-90"
          >
            <GitHubMark />
            SIGN IN WITH GITHUB
          </button>

          {errorMessage ? (
            <p
              role="alert"
              className="border-l-2 border-[color:var(--surface-signal)] pl-3 text-mono-s text-[color:var(--surface-signal)]"
            >
              {errorMessage.toUpperCase()}
            </p>
          ) : null}
        </form>

        <footer className="text-mono-s text-[color:var(--surface-graphite)]">
          ← <Link href="/" className="hover:text-[color:var(--surface-ink)]">BACK TO SITE</Link>
        </footer>
      </div>
    </main>
  );
}

/** Inline GitHub mark. 18px square, inherits color. */
function GitHubMark() {
  return (
    <svg
      aria-hidden
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.87-1.54-3.87-1.54-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.75 1.18 1.75 1.18 1.02 1.75 2.68 1.25 3.33.95.1-.74.4-1.25.72-1.54-2.56-.29-5.25-1.28-5.25-5.69 0-1.26.45-2.29 1.18-3.09-.12-.29-.51-1.46.11-3.05 0 0 .97-.31 3.18 1.18.92-.26 1.91-.38 2.9-.39.98.01 1.98.13 2.9.39 2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.24 2.76.12 3.05.74.8 1.18 1.83 1.18 3.09 0 4.42-2.69 5.39-5.26 5.68.41.35.78 1.05.78 2.12 0 1.53-.01 2.76-.01 3.14 0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5Z" />
    </svg>
  );
}
