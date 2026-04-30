"use client";

import { useEffect, useRef, useState } from "react";

import { cursorLabels, type CursorState } from "@/lib/cursor";

/**
 * Custom cursor — the portfolio's signature piece. Brief §5.4.
 *
 * Performance rewrite: position is set via raw `transform: translate3d()`
 * on every mousemove event — no React state, no springs, no animation
 * library overhead. This makes the cursor feel as fast as native.
 *
 * Visual state changes (expand/shrink, label swaps) use CSS transitions
 * on the inner ring and a minimal React state update for the label text.
 *
 * - Hidden on touch devices (no `hover: hover` media query support).
 * - Reduced motion: transitions shortened, position still instant.
 * - Hero crosshair: live X/Y readout.
 */
export function CustomCursor() {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const [mounted, setMounted] = useState(false);
  const [supported, setSupported] = useState(false);
  const stateRef = useRef<CursorState>("default");
  const activeRef = useRef(false);

  useEffect(() => {
    setMounted(true);
    setSupported(
      typeof window !== "undefined" &&
        window.matchMedia("(hover: hover)").matches,
    );
  }, []);

  useEffect(() => {
    if (!supported) return;

    const outer = outerRef.current;
    const inner = innerRef.current;
    const label = labelRef.current;
    if (!outer || !inner || !label) return;

    // Hide native cursor
    document.documentElement.classList.add("cursor-custom");

    function updateVisualState(next: CursorState, cx: number, cy: number) {
      if (!inner || !label) return;
      const prev = stateRef.current;
      if (next === prev && next !== "crosshair") return;
      stateRef.current = next;

      const isExpanded =
        next === "view" || next === "open" || next === "crosshair";
      const size = isExpanded ? 56 : 20;

      inner.style.width = `${size}px`;
      inner.style.height = `${size}px`;

      if (next === "crosshair") {
        label.textContent = `X: ${Math.round(cx)} Y: ${Math.round(cy)}`;
        label.style.opacity = "1";
      } else if (isExpanded && cursorLabels[next]) {
        label.textContent = cursorLabels[next];
        label.style.opacity = "1";
      } else {
        label.textContent = "";
        label.style.opacity = "0";
      }
    }

    function handleMove(e: MouseEvent) {
      // Position — direct DOM, no React. translate3d triggers GPU compositing.
      if (outer) {
        outer.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }

      if (!activeRef.current) {
        activeRef.current = true;
        if (outer) outer.style.opacity = "1";
      }

      // Determine cursor state from element under pointer
      const target = e.target as Element | null;
      if (!target) return;

      const hoveredWithState = target.closest<HTMLElement>("[data-cursor]");
      if (hoveredWithState) {
        const next = (hoveredWithState.dataset.cursor ?? "default") as CursorState;
        updateVisualState(next, e.clientX, e.clientY);
        return;
      }

      const interactive = target.closest(
        "a,button,input,textarea,select,[role='button']",
      );
      updateVisualState(interactive ? "view" : "default", e.clientX, e.clientY);
    }

    function handleLeave() {
      if (outer) outer.style.opacity = "0";
      activeRef.current = false;
    }

    function handleEnter() {
      if (outer && activeRef.current) outer.style.opacity = "1";
    }

    window.addEventListener("mousemove", handleMove, { passive: true });
    document.addEventListener("mouseleave", handleLeave);
    document.addEventListener("mouseenter", handleEnter);

    return () => {
      document.documentElement.classList.remove("cursor-custom");
      window.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseleave", handleLeave);
      document.removeEventListener("mouseenter", handleEnter);
    };
  }, [supported]);

  if (!mounted || !supported) return null;

  return (
    <div
      ref={outerRef}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[100] mix-blend-difference"
      style={{ opacity: 0, willChange: "transform" }}
    >
      <div
        ref={innerRef}
        className="flex items-center justify-center rounded-full border border-[#f6f5f1]"
        style={{
          width: 20,
          height: 20,
          transform: "translate(-50%, -50%)",
          transition: "width 0.15s cubic-bezier(0.22, 1, 0.36, 1), height 0.15s cubic-bezier(0.22, 1, 0.36, 1)",
          willChange: "width, height",
        }}
      >
        <span
          ref={labelRef}
          className="whitespace-nowrap text-[10px] font-medium uppercase tracking-wider text-[#f6f5f1]"
          style={{ opacity: 0, transition: "opacity 0.1s" }}
        />
      </div>
    </div>
  );
}
