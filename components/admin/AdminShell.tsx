import Link from "next/link";
import type { ReactNode } from "react";

interface AdminShellProps {
  /** Optional breadcrumb shown to the right of the wordmark, e.g. "CASE STUDIES / AMBIENT AI" */
  breadcrumb?: string;
  children: ReactNode;
}

const NAV_ITEMS = [
  { number: "01", label: "CASE STUDIES", href: "/admin/case-studies" },
  { number: "02", label: "ABOUT", href: "/admin/about" },
  { number: "03", label: "HOME", href: "/admin/home" },
  { number: "04", label: "NOW", href: "/admin/now" },
] as const;

/**
 * Admin shell — top bar + sticky left sidebar nav. Wraps every admin page.
 *
 * Matches the portfolio's design language (Instrument Serif + JetBrains
 * Mono + paper/ink/graphite + hairline seams) so the CMS feels like the
 * same crafted object as the public site, not a generic admin panel.
 *
 * Auth (Step 6) will gate this whole tree via middleware. The shell
 * itself is intentionally agnostic to auth — it just renders.
 */
export function AdminShell({ breadcrumb, children }: AdminShellProps) {
  return (
    <div className="min-h-screen">
      {/* Top bar — fixed, full width, hairline-bottom */}
      <header className="fixed inset-x-0 top-0 z-40 flex h-[64px] items-center justify-between border-b border-[color:color-mix(in_srgb,var(--surface-graphite)_35%,transparent)] bg-[color:var(--surface-paper)] px-[clamp(24px,4vw,48px)]">
        <div className="flex items-center gap-6">
          <Link
            href="/admin"
            className="text-mono-s text-[color:var(--surface-ink)] transition-opacity duration-300 ease-[var(--ease-out-soft)] hover:opacity-60"
          >
            SILADITYAA · CMS
          </Link>
          {breadcrumb ? (
            <span className="text-mono-s text-[color:var(--surface-graphite)]">
              {breadcrumb}
            </span>
          ) : null}
        </div>
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="text-mono-s text-[color:var(--surface-graphite)] transition-opacity duration-300 ease-[var(--ease-out-soft)] hover:text-[color:var(--surface-ink)]"
          >
            ← VIEW SITE
          </Link>
          {/* Logout button placeholder — wired in Step 6 */}
          <span className="text-mono-s text-[color:color-mix(in_srgb,var(--surface-graphite)_60%,transparent)]">
            LOGOUT
          </span>
        </div>
      </header>

      {/* Sidebar nav — fixed, left, below the top bar */}
      <aside className="fixed left-0 top-[64px] z-30 hidden h-[calc(100vh-64px)] w-[220px] border-r border-[color:color-mix(in_srgb,var(--surface-graphite)_35%,transparent)] px-[clamp(24px,4vw,40px)] py-12 md:block">
        <nav className="flex flex-col gap-6" aria-label="Admin sections">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group flex flex-col gap-1 transition-opacity duration-300 ease-[var(--ease-out-soft)] hover:opacity-60"
            >
              <span className="text-mono-s text-[color:var(--surface-graphite)]">
                {item.number}
              </span>
              <span className="text-display-s italic text-[color:var(--surface-ink)]">
                {item.label.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())}
              </span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Page content — pushed right of the sidebar on md+, full width below */}
      <div className="pt-[64px] md:pl-[220px]">{children}</div>
    </div>
  );
}
