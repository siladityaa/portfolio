import Link from "next/link";

/**
 * Brief §3 — fixed top-right corner, mono-s. WORK and ABOUT are in-app
 * routes (ABOUT still 404s until Phase 3). RESUME is an external link to
 * the separate resume subdomain.
 */
export function NavLinks() {
  const items = [
    { label: "WORK", href: "/#work", cursor: "view" as const },
    { label: "ABOUT", href: "/about", cursor: "view" as const },
    {
      label: "RESUME",
      href: "https://resume.siladityaa.com",
      cursor: "open" as const,
      external: true,
    },
  ];

  return (
    <nav
      aria-label="Primary"
      className="fixed right-[clamp(24px,4vw,64px)] top-[clamp(24px,4vw,64px)] z-50 flex gap-6"
    >
      {items.map((item) =>
        item.external ? (
          <a
            key={item.label}
            href={item.href}
            data-cursor={item.cursor}
            target="_blank"
            rel="noopener noreferrer"
            className="text-mono-s text-[color:var(--surface-ink)] transition-opacity duration-300 ease-[var(--ease-out-soft)] hover:opacity-60"
          >
            {item.label}
          </a>
        ) : (
          <Link
            key={item.label}
            href={item.href}
            data-cursor={item.cursor}
            className="text-mono-s text-[color:var(--surface-ink)] transition-opacity duration-300 ease-[var(--ease-out-soft)] hover:opacity-60"
          >
            {item.label}
          </Link>
        ),
      )}

      {/* Subtle ⌘K hint — hidden on touch devices (no keyboard) */}
      <kbd
        aria-label="Press Command K to search"
        className="hidden rounded border border-[color:color-mix(in_srgb,var(--surface-graphite)_30%,transparent)] px-1.5 py-0.5 text-mono-s text-[color:var(--surface-graphite)] transition-opacity duration-300 ease-[var(--ease-out-soft)] hover:text-[color:var(--surface-ink)] md:inline-block"
      >
        ⌘K
      </kbd>
    </nav>
  );
}
