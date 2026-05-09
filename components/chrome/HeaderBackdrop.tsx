/**
 * Solid header backdrop — fixed bar at the top of the viewport that uses the
 * paper surface color so the Wordmark + NavLinks chrome always sits on a
 * clean, opaque ground while content scrolls beneath.
 *
 * Soft fade at the bottom edge so the bar dissolves into the page rather than
 * ending in a hard horizontal line. Sits at z-30, just below the chrome.
 */
export function HeaderBackdrop() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-0 z-30 h-[clamp(64px,8vw,96px)] bg-[color:var(--surface-paper)]"
      style={{
        maskImage:
          "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 70%, rgba(0,0,0,0) 100%)",
        WebkitMaskImage:
          "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 70%, rgba(0,0,0,0) 100%)",
      }}
    />
  );
}
