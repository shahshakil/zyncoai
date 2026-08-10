"use client";
import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import { Suspense, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

function PostHogPageview() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) return;
    if (!pathname) return;
    posthog.capture("$pageview", { $current_url: window.location.href });
  }, [pathname, searchParams]);

  return null;
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) return;

    // 2026-08-10 perf fix — posthog.init() was firing synchronously on
    // mount, pulling in the session-recording recorder script during the
    // page's critical rendering window (measured ~410ms of mobile bootup
    // time in Lighthouse, on top of its own script-evaluation cost).
    // Deferred to the browser's idle time instead — same recording
    // capability, same events, just not competing with hydration for the
    // main thread during initial load. requestIdleCallback isn't in
    // Safari, hence the setTimeout fallback.
    const init = () => {
      posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY as string, {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.posthog.com",
        capture_pageview: false,
        capture_pageleave: true,
        session_recording: { maskAllInputs: true, maskInputOptions: { password: true, email: false } },
        loaded: (ph) => {
          if (process.env.NODE_ENV === "development") ph.debug();
        },
      });
    };
    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(init, { timeout: 3000 });
      return () => window.cancelIdleCallback(id);
    }
    const id = window.setTimeout(init, 1);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <PHProvider client={posthog}>
      <Suspense fallback={null}>
        <PostHogPageview />
      </Suspense>
      {children}
    </PHProvider>
  );
}
