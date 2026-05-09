/**
 * Single source of truth for WIP (work-in-progress) mode.
 *
 * Flip this one constant to toggle the entire site between:
 *   - WIP_MODE = true   → home shows WipHero, /about and /work/* redirect
 *                         to home, top nav hides WORK/ABOUT (only RESUME shown)
 *   - WIP_MODE = false  → full public site (Hero + SelectedWork + AboutTeaser +
 *                         Footer), all routes accessible, full nav visible
 *
 * Read by:
 *   - proxy.ts                       (route gate)
 *   - components/chrome/NavLinks.tsx (nav visibility)
 *   - app/(site)/page.tsx            (home composition)
 */
export const WIP_MODE = false; // ← flip to true to gate behind WIP landing

/** Routes always allowed through the WIP gate (in addition to home). */
export const WIP_ALLOWED_ROUTES = new Set([
  "/",
  "/_not-found",
  "/resume",
]);
