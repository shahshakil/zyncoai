import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { FeaturesPageClient } from "./FeaturesPageClient";

// 2026-08-16 — every feature on this page was verified against real code
// before being written (not assumed from marketing copy elsewhere):
//   - AI voice reception / 24/7 answering: the whole product; pipecat-voice
//     worker fleet (backend/ecosystem.config.cjs) runs continuously
//   - Appointment booking: backend Appointment model + real provider-
//     calendar checks in the voice flow
//   - Calendar sync: backend/src/lib/googleCalendar.ts,
//     backend/src/lib/microsoftGraph.ts (real OAuth + event creation)
//   - Call history/transcripts: backend Call + CallTurn models,
//     backend/src/api/routes/business/calls.ts
//   - Per-vertical dashboards: Industry.dashboardPreview labels in
//     components/marketing/receptionist/data.ts, live-computed dashboard
//     data verified in an earlier full-dashboard audit this session
//   - Bookings management: backend/src/api/routes/business/appointments.ts
//     PATCH route (reschedule/cancel/status)
//   - Billing/invoicing: backend Invoice/InvoiceItem models,
//     backend/src/api/routes/business/billing.ts
//   - Sydney-hosted data: REQUIRED_DATA_REGION = "ap-southeast-2" in
//     backend/src/api/routes/business/compliance.ts, checked live against
//     DATABASE_URL
// Deliberately excluded: "AI discloses on every call" — checked the actual
// voice system prompt (backend/src/voice/core/systemPrompt.ts) and found
// the real policy is the opposite: "Never volunteer that you are AI...
// Only if asked directly, answer honestly." Including a proactive-
// disclosure claim would have been fabricated.

const TITLE = "Features | ZyncoAI — What Ella Actually Does";
const DESCRIPTION =
  "A deep look at what ZyncoAI's AI receptionist Ella actually does today: 24/7 call answering, real-time booking, Google and Microsoft calendar sync, call transcripts, per-vertical dashboards, billing, and Sydney-hosted data.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/features", languages: { "en-AU": "/features", en: "/features" } },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "https://zyncoai.com/features",
    siteName: "ZyncoAI",
    locale: "en_AU",
    type: "website",
    images: ["/opengraph-image"],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: ["/opengraph-image"] },
};

export default function FeaturesPage() {
  return (
    <div className="bg-[#f8fafc]">
      <div className="mx-auto max-w-6xl px-6 pt-8">
        <Breadcrumbs crumbs={[{ name: "Home", href: "/" }, { name: "Features", href: "/features" }]} />
      </div>

      <div className="mx-auto max-w-3xl px-6 pt-8 text-center">
        <h1 className="text-4xl font-bold text-[#0f172a] sm:text-5xl">What Ella actually does</h1>
        <p className="mt-4 text-lg text-[#475569]">
          No roadmap items, no &ldquo;coming soon&rdquo; dressed up as live. Every capability below is built, working,
          and running in production today — with the real UI to show for it.
        </p>
      </div>

      <FeaturesPageClient />

      <div className="mx-auto max-w-3xl px-6 py-20 text-center">
        <h2 className="text-2xl font-bold text-[#0f172a]">See it running on your own number</h2>
        <p className="mt-3 text-[#64748b]">7-day free trial. No contract.</p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/signup"
            className="rounded-xl bg-[image:linear-gradient(135deg,#6366f1,#06b6d4)] px-6 py-3 text-sm font-semibold text-white hover:opacity-90"
          >
            Start free trial
          </Link>
          <Link href="/pricing" className="rounded-xl border border-[#e2e8f0] bg-white px-6 py-3 text-sm font-semibold text-[#0f172a] hover:bg-slate-50">
            See pricing
          </Link>
        </div>
      </div>
    </div>
  );
}
