/**
 * Custom cursor state machine.
 * Each interactive element sets `data-cursor="<state>"` and the cursor
 * component reads it on hover to swap visual states.
 *
 * Brief §5.4 — Bleibtgleich + Ashfall influence, with the CAD crosshair
 * on the home hero as our original riff.
 */

export type CursorState =
  | "default"
  | "view" // hovering any link/button → shows "VIEW ↗"
  | "open" // hovering a work row → shows "OPEN"
  | "request" // hovering a LockedSection or NDA row-dot → shows "REQUEST FULL DECK" + lock
  | "text" // hovering selectable text → I-beam
  | "crosshair"; // hovering the home hero → CAD-style coordinate readout

export const cursorLabels: Record<CursorState, string | null> = {
  default: null,
  view: "VIEW ↗",
  open: "OPEN",
  request: "REQUEST FULL DECK",
  text: "|",
  crosshair: null, // crosshair shows a live X/Y readout instead
};
