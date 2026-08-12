"use client";
import { useEffect } from "react";
import posthog from "posthog-js";

// 2026-08-12 — added after a homepage length/redundancy audit found no
// scroll-depth or section-visibility data existed anywhere, so decisions
// about which sections to keep/cut/merge were being made from code-reading
// alone. One observer watches every `<section id>` on the homepage and
// fires a single "section_viewed" event the first time each one crosses
// 30% visible — real data for the next round of that audit.
// `seen` is module-level (not per-mount state) so a soft client-side
// navigation back to "/" within the same session doesn't re-fire events
// for sections already counted once this session.
const seen = new Set<string>();

export function SectionViewObserver() {
  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>("section[id]"));
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = entry.target.id;
          if (entry.isIntersecting && !seen.has(id)) {
            seen.add(id);
            posthog.capture("section_viewed", { section: id });
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.3 }
    );

    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return null;
}
