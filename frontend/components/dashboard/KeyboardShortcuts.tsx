"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const ROUTES: Record<string, string> = {
  b: "/dashboard/bookings",
  c: "/dashboard/calls",
  s: "/dashboard/settings",
};

// Global single-key dashboard shortcuts (B/C/S) — "/" for search lives in
// Topbar.tsx next to the search box it drives. Ignored while typing in any
// field, and while a modifier key is held, so it never hijacks normal typing
// or browser/OS shortcuts (Cmd+B, Ctrl+S, etc).
export function KeyboardShortcuts() {
  const router = useRouter();

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const target = e.target as HTMLElement;
      if (["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName) || target.isContentEditable) return;
      const route = ROUTES[e.key.toLowerCase()];
      if (!route) return;
      e.preventDefault();
      router.push(route);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [router]);

  return null;
}
