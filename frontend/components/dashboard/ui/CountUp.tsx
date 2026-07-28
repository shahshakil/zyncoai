"use client";
import { useEffect, useRef, useState } from "react";

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

// Animates from the previous rendered value to `value` whenever it changes
// (not just on mount) — so a live-refreshing KPI counts up again each time
// the underlying number moves, not only on first page load.
export function CountUp({ value, durationMs = 800, format }: { value: number; durationMs?: number; format?: (n: number) => string }) {
  const [display, setDisplay] = useState(value);
  const fromRef = useRef(value);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const from = fromRef.current;
    const to = value;
    if (from === to) return;
    const start = performance.now();
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    function tick(now: number) {
      const progress = Math.min(1, (now - start) / durationMs);
      const eased = easeOutCubic(progress);
      setDisplay(Math.round(from + (to - from) * eased));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        fromRef.current = to;
      }
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, durationMs]);

  return <>{format ? format(display) : display.toLocaleString()}</>;
}
