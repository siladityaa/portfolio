"use client";

import { useEffect, useState } from "react";

/**
 * Brief §3 — fixed bottom-right. Shows Los Angeles time in mono-s, updates
 * every 60 seconds. SSR renders a stable placeholder to avoid hydration
 * mismatches; the real time fills in on mount.
 */
function getGreeting(): string {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Los_Angeles",
    hour: "numeric",
    hour12: false,
  });
  const hour = parseInt(formatter.format(new Date()), 10);
  if (hour >= 5 && hour < 12) return "GOOD MORNING";
  if (hour >= 12 && hour < 17) return "GOOD AFTERNOON";
  if (hour >= 17 && hour < 21) return "GOOD EVENING";
  return "GOOD NIGHT";
}

export function LocalClock() {
  const [time, setTime] = useState<string | null>(null);
  const [greeting, setGreeting] = useState<string | null>(null);

  useEffect(() => {
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Los_Angeles",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    function tick() {
      setTime(formatter.format(new Date()));
      setGreeting(getGreeting());
    }

    tick();
    // Align the first interval to the next minute boundary so the display
    // updates at :00, then tick every 60s.
    const now = new Date();
    const msToNextMinute = 60_000 - (now.getSeconds() * 1000 + now.getMilliseconds());
    const kickoff = window.setTimeout(() => {
      tick();
      const interval = window.setInterval(tick, 60_000);
      // Attach to a ref via closure for cleanup.
      cleanup = () => window.clearInterval(interval);
    }, msToNextMinute);

    let cleanup: (() => void) | undefined;
    return () => {
      window.clearTimeout(kickoff);
      cleanup?.();
    };
  }, []);

  return (
    <div
      aria-label="Local time, Los Angeles"
      className="fixed right-[clamp(24px,4vw,64px)] bottom-[clamp(24px,4vw,64px)] z-50 text-mono-s text-[color:var(--surface-graphite)] tabular-nums"
    >
      {greeting ?? "HELLO"} · LAX · {time ?? "--:--"}
    </div>
  );
}
