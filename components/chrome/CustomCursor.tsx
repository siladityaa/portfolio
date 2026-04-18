"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";

import { cursorLabels, type CursorState } from "@/lib/cursor";

/**
 * Custom cursor — the portfolio's signature piece. Brief §5.4.
 *
 * - Smoothed with a Framer Motion spring (damping 30, stiffness 400).
 * - Reads `data-cursor` on the hovered element to swap visual states.
 * - Hidden on touch devices (no `hover: hover` media query support).
 * - Reduced motion: spring removed, label swaps still work.
 * - Hero crosshair: on hover of `[data-cursor="crosshair"]`, renders live X/Y.
 */
export function CustomCursor() {
  const [mounted, setMounted] = useState(false);
  const [supported, setSupported] = useState(false);
  const [active, setActive] = useState(false); // hidden until first mousemove
  const [state, setState] = useState<CursorState>("default");
  const rawCoords = useRef({ x: 0, y: 0 });
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const reducedMotion = useReducedMotion();

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { damping: 30, stiffness: 400, mass: 0.6 });
  const springY = useSpring(y, { damping: 30, stiffness: 400, mass: 0.6 });

  useEffect(() => {
    setMounted(true);
    const supportsHover =
      typeof window !== "undefined" &&
      window.matchMedia("(hover: hover)").matches;
    setSupported(supportsHover);
  }, []);

  // Hide the native cursor only once the custom cursor is actually visible.
  useEffect(() => {
    if (!supported) return;
    if (active) {
      document.documentElement.classList.add("cursor-custom");
      return () => {
        document.documentElement.classList.remove("cursor-custom");
      };
    }
  }, [active, supported]);

  useEffect(() => {
    if (!supported) return;

    function handleMove(event: MouseEvent) {
      rawCoords.current = { x: event.clientX, y: event.clientY };
      x.set(event.clientX);
      y.set(event.clientY);
      if (!active) setActive(true);

      // Determine cursor state from the element under the pointer.
      const target = event.target as Element | null;
      if (!target) return;

      const hoveredWithState = target.closest<HTMLElement>("[data-cursor]");
      if (hoveredWithState) {
        const next = (hoveredWithState.dataset.cursor ?? "default") as CursorState;
        setState((prev) => (prev === next ? prev : next));
        if (next === "crosshair") {
          setCoords({ x: event.clientX, y: event.clientY });
        }
        return;
      }

      const interactive = target.closest(
        "a,button,input,textarea,select,[role='button']",
      );
      setState(interactive ? "view" : "default");
    }

    window.addEventListener("mousemove", handleMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMove);
  }, [supported, x, y, active]);

  if (!mounted || !supported) return null;

  const label = cursorLabels[state];
  const isExpanded =
    state === "view" ||
    state === "open" ||
    state === "crosshair";
  const size = isExpanded ? 56 : 20;

  const positionProps = reducedMotion
    ? { style: { left: x, top: y } }
    : { style: { left: springX, top: springY } };

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[100] mix-blend-difference"
      animate={{ opacity: active ? 1 : 0 }}
      transition={{ duration: 0.2 }}
      {...positionProps}
    >
      <motion.div
        animate={{
          width: size,
          height: size,
          backgroundColor: "rgba(0,0,0,0)",
          borderColor: "#f6f5f1",
        }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border"
      >
        {state === "crosshair" ? (
          <span className="whitespace-nowrap text-[10px] font-medium uppercase tracking-wider text-[#f6f5f1]">
            X: {coords.x} Y: {coords.y}
          </span>
        ) : label && isExpanded ? (
          <span className="whitespace-nowrap text-[10px] font-medium uppercase tracking-wider text-[#f6f5f1]">
            {label}
          </span>
        ) : null}
      </motion.div>
    </motion.div>
  );
}
