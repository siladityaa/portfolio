import Link from "next/link";

/**
 * Brief §3 — fixed top-left corner, always present.
 *
 * Uses the handwritten signature logo pulled from siladityaa.com. Two PNG
 * variants live under /public/marks/ and swap via Tailwind's `dark:` class
 * — no JS needed. The signature is a warm counterpoint to the mono labels
 * in the other three corners.
 */
export function Wordmark() {
  return (
    <Link
      href="/"
      data-cursor="view"
      aria-label="Siladityaa — home"
      className="fixed left-[clamp(24px,4vw,64px)] top-[clamp(24px,4vw,64px)] z-50 block transition-opacity duration-300 ease-[var(--ease-out-soft)] hover:opacity-60"
    >
      {/* Light mode: black signature */}
      <img
        src="/marks/logo-light.png"
        alt="Siladityaa"
        width={96}
        height={54}
        className="block h-[54px] w-[96px] dark:hidden"
      />
      {/* Dark mode: white signature */}
      <img
        src="/marks/logo-dark.png"
        alt="Siladityaa"
        width={96}
        height={54}
        className="hidden h-[54px] w-[96px] dark:block"
      />
    </Link>
  );
}
