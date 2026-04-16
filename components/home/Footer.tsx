import Link from "next/link";
import { ThemeToggle } from "@/components/chrome/ThemeToggle";

// Build-time constant — updated on every `next build`. In dev it's the
// moment the file is evaluated, which is fine for Phase 1.
const LAST_DEPLOYED = new Date().toISOString().slice(0, 10);

/**
 * Brief §4.1 — four columns: wordmark + tagline, nav links, external links,
 * last-deployed timestamp + credit. ThemeToggle lives here.
 */
export function Footer() {
  return (
    <footer className="hairline-top mt-[clamp(120px,20vh,200px)]">
      <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-10 px-[clamp(24px,4vw,64px)] py-16 md:grid-cols-4">
        {/* Col 1 — wordmark + tagline */}
        <div className="flex flex-col gap-3">
          <span className="text-mono-s text-[color:var(--surface-ink)]">
            SILADITYAA
          </span>
          <p className="max-w-[28ch] text-mono-s text-[color:var(--surface-graphite)]">
            SENIOR PRODUCT DESIGNER
            <br />
            WEARABLES + AI · LOS ANGELES
          </p>
        </div>

        {/* Col 2 — nav */}
        <div className="flex flex-col gap-2">
          <span className="text-mono-s text-[color:var(--surface-graphite)]">
            PAGES
          </span>
          <FooterLink href="/#work">WORK</FooterLink>
          <FooterLink href="/about">ABOUT</FooterLink>
          <FooterExternalLink href="https://resume.siladityaa.com">
            RESUME ↗
          </FooterExternalLink>
        </div>

        {/* Col 3 — external */}
        <div className="flex flex-col gap-2">
          <span className="text-mono-s text-[color:var(--surface-graphite)]">
            ELSEWHERE
          </span>
          {/* TODO(siladityaa): fill in real handles */}
          <FooterExternalLink href="https://www.linkedin.com/in/siladityaa/">
            LINKEDIN ↗
          </FooterExternalLink>
          <FooterExternalLink href="https://read.cv/siladityaa">
            READ.CV ↗
          </FooterExternalLink>
          <FooterExternalLink href="https://www.are.na/siladityaa">
            ARE.NA ↗
          </FooterExternalLink>
          <FooterExternalLink href="mailto:siladityaa@gmail.com">
            EMAIL ↗
          </FooterExternalLink>
        </div>

        {/* Col 4 — last deployed + credit + theme toggle. The site follows
            the OS color scheme automatically; the toggle lets the user pin
            an override and click again to return to auto. */}
        <div className="flex flex-col gap-3">
          <span className="text-mono-s text-[color:var(--surface-graphite)]">
            LAST DEPLOYED · {LAST_DEPLOYED}
          </span>
          <span className="text-mono-s text-[color:var(--surface-graphite)]">
            DESIGNED &amp; BUILT BY SILADITYAA SHARMA · 2026
          </span>
          <div className="pt-2">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      data-cursor="view"
      className="text-mono-s text-[color:var(--surface-ink)] transition-opacity duration-300 ease-[var(--ease-out-soft)] hover:opacity-60"
    >
      {children}
    </Link>
  );
}

function FooterExternalLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      data-cursor="view"
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
      className="text-mono-s text-[color:var(--surface-ink)] transition-opacity duration-300 ease-[var(--ease-out-soft)] hover:opacity-60"
    >
      {children}
    </a>
  );
}
