"use client";
import { useEffect, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

NProgress.configure({ showSpinner: false, minimum: 0.15 });

// App Router has no router-change events (the old Pages Router's
// routeChangeStart/Complete), so the bar is driven by two signals:
// 1. A capture-phase click listener on any in-app <a> (next/link renders a
//    real <a>) starts the bar the instant the user clicks, before Next even
//    begins fetching the RSC payload for the destination.
// 2. The pathname/searchParams changing means the new route has committed,
//    so that's the done() signal. Also finishes on browser back/forward.
function RouteProgressInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    NProgress.done();
  }, [pathname, searchParams]);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const anchor = (e.target as HTMLElement)?.closest?.("a");
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#") || anchor.target === "_blank") return;
      // Only same-origin internal navigations trigger the bar — external
      // links and mailto:/tel: leave the app entirely, nothing to show.
      let url: URL;
      try {
        url = new URL(href, window.location.href);
      } catch {
        return;
      }
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname && url.search === window.location.search) return;
      NProgress.start();
    }

    function onPopState() {
      NProgress.start();
    }

    document.addEventListener("click", onClick, true);
    window.addEventListener("popstate", onPopState);
    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("popstate", onPopState);
    };
  }, []);

  return null;
}

export function RouteProgress() {
  return (
    <Suspense fallback={null}>
      <RouteProgressInner />
    </Suspense>
  );
}
