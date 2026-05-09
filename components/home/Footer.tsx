import Link from "next/link";
import { ThemeToggle } from "@/components/chrome/ThemeToggle";

// Build-time constant — updated on every `next build`.
const LAST_DEPLOYED = new Date().toISOString().slice(0, 10);

/**
 * Three-column footer: wordmark + tagline · ELSEWHERE links · last
 * deployed + credit + theme toggle. (PAGES column was removed since the
 * primary nav is just RESUME now.)
 */
export function Footer() {
  return (
    <footer className="hairline-top mt-[clamp(120px,20vh,200px)]">
      <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-10 px-[clamp(24px,4vw,64px)] py-16 md:grid-cols-3">
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

        {/* Col 2 — elsewhere */}
        <div className="flex flex-col gap-2">
          <span className="text-mono-s text-[color:var(--surface-graphite)]">
            ELSEWHERE
          </span>
          <FooterExternalLink href="https://www.linkedin.com/in/siladityaa/">
            LINKEDIN ↗
          </FooterExternalLink>
          <FooterExternalLink href="https://www.instagram.com/siladityaa/">
            INSTAGRAM ↗
          </FooterExternalLink>
          <FooterExternalLink href="mailto:siladityaa@gmail.com">
            EMAIL ↗
          </FooterExternalLink>
        </div>

        {/* Col 3 — last deployed + credit + theme toggle */}
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

// Kept for backward compatibility if any callers still import it.
export { Link };
