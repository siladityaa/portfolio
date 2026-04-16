"use client";

import { motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";

import { easeOutSoft } from "@/lib/motion";

/**
 * Brief §5.1 — a subtle iris-in reveal on route change.
 *
 * Keyed on pathname so the intro variant replays on every navigation.
 * Reduced motion: no animation, children render immediately.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return <>{children}</>;
  }

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: easeOutSoft }}
    >
      {children}
    </motion.div>
  );
}
