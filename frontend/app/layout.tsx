import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import { PostHogProvider } from "../components/PostHogProvider";
import { SiteJsonLd } from "../components/seo/SiteJsonLd";
import { GoogleAnalytics } from "../components/seo/GoogleAnalytics";
import { RouteProgress } from "../components/RouteProgress";

// The site-wide fallback — any page without its own metadata export
// previously had no <title>/<meta description> at all (verified: root
// layout had no metadata export whatsoever). metadataBase is what lets a
// page-level `alternates: { canonical: "/some-path" }` resolve to a full
// absolute URL instead of needing every page to spell out the full
// https://zyncoai.com/... string itself.
export const metadata: Metadata = {
  metadataBase: new URL("https://zyncoai.com"),
  title: {
    default: "ZyncoAI — AI Receptionist That Answers Every Call",
    template: "%s | ZyncoAI",
  },
  description:
    "ZyncoAI is an AI receptionist that answers calls, books appointments, and handles enquiries 24/7 for medical, dental, legal, restaurant, and trade businesses.",
  keywords: [
    "AI receptionist Australia",
    "AI phone answering",
    "automatic booking system",
    "medical receptionist AI",
    "restaurant phone orders",
    "ZyncoAI",
  ],
  authors: [{ name: "ZyncoAI" }],
  robots: {
    index: true,
    follow: true,
    "max-snippet": -1,
    "max-image-preview": "large",
    "max-video-preview": -1,
  },
  // Renders only once a real code exists — GOOGLE_SITE_VERIFICATION is
  // unset today (no Search Console property verified yet), and Next
  // simply omits the meta tag when verification.google is undefined
  // rather than emitting a broken placeholder.
  verification: process.env.GOOGLE_SITE_VERIFICATION
    ? { google: process.env.GOOGLE_SITE_VERIFICATION }
    : undefined,
  // en-AU is the primary target (Australian pricing/compliance content
  // throughout); en (no region) as a fallback for any English-speaking
  // visitor. Next.js's `alternates` object doesn't deep-merge with a
  // page's own `alternates.canonical` override — pages that set their own
  // canonical replicate `languages` alongside it (see e.g. the homepage).
  alternates: {
    languages: {
      "en-AU": "https://zyncoai.com",
      en: "https://zyncoai.com",
    },
    types: {
      "application/rss+xml": "https://zyncoai.com/blog/feed.xml",
    },
  },
};

// globals.css already declares `body { font-family: Inter, Arial, ... }`,
// but nothing ever actually loaded Inter — the site was silently falling
// back to system Arial/Helvetica. next/font self-hosts it (no external
// Google Fonts request) and, applied as a class directly on <body>, its
// higher-specificity class selector wins over the existing element-level
// rule, so no other change to globals.css is needed.
const inter = Inter({ subsets: ["latin"], display: "swap" });

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/* The spec's suggested preload (/fonts/inter.woff2) and Google Fonts
          preconnect don't apply to this codebase — Inter loads via
          next/font/google, which self-hosts the actual font file at a
          build-time hashed path and already auto-preloads it (confirmed in
          rendered HTML); there's no real request to fonts.googleapis.com to
          preconnect to. This dns-prefetch is the one genuinely real
          optimization — several client-side lib files (lib/api.ts,
          lib/public-api.ts, lib/backendAuth.ts) do call api.zyncoai.com
          cross-origin. Rendered as a bare <link>, not wrapped in a manual
          <head> — Next.js's App Router auto-hoists <link>/<meta> found
          anywhere in the tree into <head> itself; a hand-written <head>
          element here was silently dropped instead of merging. */}
      <link rel="dns-prefetch" href="//api.zyncoai.com" />
      <body className={inter.className}>
        <RouteProgress />
        <SiteJsonLd />
        <GoogleAnalytics />
        <PostHogProvider>
          {children}
          <Toaster theme="dark" position="top-right" toastOptions={{ style: { background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" } }} />
        </PostHogProvider>
      </body>
    </html>
  );
}
