"use client";
import Script from "next/script";

// Renders nothing until a real GA4 property exists — NEXT_PUBLIC_GA_MEASUREMENT_ID
// is unset today, same "env-var gated, never a fake placeholder ID" pattern
// as GOOGLE_SITE_VERIFICATION in layout.tsx. This runs alongside the
// existing PostHog instrumentation (PostHogProvider), not instead of it —
// GA4 specifically feeds Search Console's organic-traffic correlation,
// which PostHog doesn't do.
const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export function GoogleAnalytics() {
  if (!GA_ID) return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}');
        `}
      </Script>
    </>
  );
}

// Fires a GA4 event if (and only if) gtag actually loaded — a no-op with
// no GA_ID set, so call sites don't need their own conditional.
export function trackConversion(eventName: string, params?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag;
  if (typeof gtag === "function") gtag("event", eventName, params);
}
