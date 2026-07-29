"use client";
import { useEffect, useState } from "react";

// Cycles a "spotlight" index across `count` items on an interval, used to
// give feature cards / capability pills a subtle sense of life without any
// real video. Respects prefers-reduced-motion by simply never advancing.
export function useSpotlight(count: number, intervalMs = 1400) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (count <= 0) return;
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const id = setInterval(() => {
      setActive((i) => (i + 1) % count);
    }, intervalMs);
    return () => clearInterval(id);
  }, [count, intervalMs]);

  return active;
}
