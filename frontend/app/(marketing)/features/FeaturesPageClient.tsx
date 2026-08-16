"use client";
import { motion, useReducedMotion } from "framer-motion";
import { CalendarClock, Phone, CreditCard, MapPin, CalendarDays, ClipboardCheck, BadgeCheck } from "lucide-react";
import { ExampleCallScene } from "@/components/marketing/receptionist/ExampleCallScene";
import { LiveDashboardScene } from "@/components/marketing/receptionist/LiveDashboardScene";
import { FeaturePreviewCard } from "@/components/marketing/receptionist/FeaturePreviewCard";
import { SITEWIDE_EXAMPLE_CALL } from "@/components/marketing/receptionist/data";

function Section({
  eyebrow,
  title,
  body,
  visual,
  reverse,
  aboveFold,
}: {
  eyebrow: string;
  title: string;
  body: string;
  visual: React.ReactNode;
  reverse?: boolean;
  // The first section is already visible on initial paint — a "reveal on
  // scroll into view" animation is meaningless for content with nothing to
  // reveal, but still gated it behind opacity:0 until framer-motion loaded
  // and hydrated. Measured as the actual LCP bottleneck (88% of LCP time
  // was "Render Delay" on this exact text, confirmed via Lighthouse's
  // largest-contentful-paint-element audit) — this prop renders the text
  // plainly, visible immediately from the server-rendered HTML, for
  // whichever section is above the fold. Every other section keeps the
  // scroll-reveal, which is genuinely earned further down the page.
  aboveFold?: boolean;
}) {
  const reducedMotion = useReducedMotion();
  const textBlock = (
    <>
      <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#6366f1]">{eyebrow}</p>
      <h2 className="mt-2 text-3xl font-bold text-[#0f172a]">{title}</h2>
      <p className="mt-4 text-base leading-relaxed text-[#475569]">{body}</p>
    </>
  );
  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <div className={`grid items-center gap-12 lg:grid-cols-2 ${reverse ? "lg:[&>*:first-child]:order-2" : ""}`}>
        {aboveFold ? (
          <div>{textBlock}</div>
        ) : (
          <motion.div
            initial={reducedMotion ? false : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            {textBlock}
          </motion.div>
        )}
        <div>{visual}</div>
      </div>
    </div>
  );
}

export function FeaturesPageClient() {
  return (
    <div className="mt-8 divide-y divide-[#e2e8f0]">
      <Section
        aboveFold
        eyebrow="Voice"
        title="AI voice reception, day or night"
        body="Ella answers every inbound call instantly — no hold music, no voicemail, no queue. She handles the full conversation naturally: understands what the caller wants, answers common questions, and moves straight into booking. Every call, every hour, every day of the week — the voice line doesn't close when your front desk does."
        visual={
          <div className="mx-auto max-w-md rounded-3xl border border-[#e2e8f0] bg-white p-6 shadow-sm">
            <ExampleCallScene callerLine={SITEWIDE_EXAMPLE_CALL.callerLine} greeting={SITEWIDE_EXAMPLE_CALL.greeting} />
          </div>
        }
      />

      <Section
        reverse
        eyebrow="Booking"
        title="Appointments booked during the call, not after"
        body="Ella checks your real provider calendars before offering a time, so there's never a double-booking or an awkward back-and-forth callback. The appointment is confirmed with the caller on the spot and lands in your calendar immediately — not queued for a human to enter later."
        visual={
          <FeaturePreviewCard
            icon={ClipboardCheck}
            title="Booking flow"
            rows={[
              { label: "Provider calendar checked", value: "Real-time", tone: "positive" },
              { label: "Double-booking risk", value: "Never", tone: "positive" },
              { label: "Caller confirmation", value: "Before call ends", tone: "positive" },
              { label: "Appears in your calendar", value: "Instantly" },
            ]}
          />
        }
      />

      <Section
        eyebrow="Integrations"
        title="Two-way sync with the calendar you already use"
        body="Real OAuth connections to Google Calendar and Microsoft Outlook/Calendar — not a CSV export, not a manual re-entry step. A booking Ella takes writes straight into your calendar, and a change made on your end is reflected back. Both directions, automatically."
        visual={
          <FeaturePreviewCard
            icon={CalendarDays}
            title="Calendar connections"
            rows={[
              { label: "Google Calendar", value: "Connected", tone: "positive" },
              { label: "Microsoft Outlook", value: "Connected", tone: "positive" },
              { label: "Sync direction", value: "Two-way" },
              { label: "New bookings", value: "Pushed instantly" },
            ]}
          />
        }
      />

      <Section
        reverse
        eyebrow="Records"
        title="Every call recorded and transcribed automatically"
        body="Nothing about a call is a black box. Every conversation is recorded and transcribed, searchable from your dashboard, with issues like a low-confidence moment or an unexpected hangup automatically flagged for review — not something you have to go hunting for."
        visual={
          <FeaturePreviewCard
            icon={Phone}
            title="Call history"
            rows={[
              { label: "Recording + transcript", value: "Every call", tone: "positive" },
              { label: "Flagged for review", value: "Auto-detected" },
              { label: "Search by caller", value: "Instant" },
              { label: "Retention", value: "Full history" },
            ]}
          />
        }
      />

      <Section
        eyebrow="Dashboard"
        title="A dashboard that speaks your industry's language"
        body="The same real dashboard adapts its labels to what you actually do — a medical clinic sees 'Appointments Booked,' a restaurant sees 'Tables Booked' and 'Orders Taken,' a law firm sees 'Consultations Booked' and 'New Matters Screened.' It's not a generic CRM with your logo on it."
        visual={
          <div className="mx-auto max-w-md">
            <LiveDashboardScene />
            <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs text-[#64748b]">
              <div className="rounded-xl border border-[#e2e8f0] bg-white px-2 py-2">Medical: <span className="font-semibold text-[#0f172a]">Appointments Booked</span></div>
              <div className="rounded-xl border border-[#e2e8f0] bg-white px-2 py-2">Restaurant: <span className="font-semibold text-[#0f172a]">Tables Booked</span></div>
              <div className="rounded-xl border border-[#e2e8f0] bg-white px-2 py-2">Legal: <span className="font-semibold text-[#0f172a]">Consultations Booked</span></div>
            </div>
          </div>
        }
      />

      <Section
        reverse
        eyebrow="Operations"
        title="Manage every booking from one place"
        body="Reschedule, cancel, or update a booking's status in a click — changes sync back to the connected calendar automatically. No-shows are tracked against real appointment data, not a manual tally sheet."
        visual={
          <FeaturePreviewCard
            icon={CalendarClock}
            title="Bookings management"
            rows={[
              { label: "Reschedule / cancel", value: "One click", tone: "positive" },
              { label: "Calendar sync on change", value: "Automatic" },
              { label: "No-show tracking", value: "Built in" },
              { label: "Provider view", value: "Per-provider" },
            ]}
          />
        }
      />

      <Section
        eyebrow="Billing"
        title="Real invoices, real usage, no surprises"
        body="Invoices generate automatically each billing period against your actual plan and usage — not an estimate. Pay by card, PayPal, or bank transfer, and see exactly how many minutes you've used against your plan's allowance at any time."
        visual={
          <FeaturePreviewCard
            icon={CreditCard}
            title="Billing"
            rows={[
              { label: "Invoices", value: "Auto-generated", tone: "positive" },
              { label: "Payment methods", value: "Card, PayPal, bank transfer" },
              { label: "Minutes used", value: "Tracked live" },
              { label: "Plan changes", value: "Prorated" },
            ]}
          />
        }
      />

      <Section
        eyebrow="Data"
        title="Hosted in Sydney, not offshore"
        body="Your business's data is stored in an Australia (Sydney) data region — not routed through infrastructure overseas by default. This is a real, enforced architectural requirement, checked against the live database connection, not a claim on a compliance page that doesn't match reality."
        visual={
          <div className="mx-auto flex max-w-sm items-center gap-4 rounded-3xl border border-[#e2e8f0] bg-white p-6 shadow-sm">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#eef2ff]">
              <MapPin className="h-6 w-6 text-[#6366f1]" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#0f172a]">Data region: ap-southeast-2</p>
              <p className="mt-0.5 text-sm text-[#64748b]">Sydney, Australia</p>
            </div>
          </div>
        }
      />

      <Section
        reverse
        eyebrow="Transparency"
        title="Every call, Ella identifies as AI"
        body="There's no ambiguity for callers about who — or what — they're talking to. Every greeting introduces Ella by name and by role, and that role always includes the word 'AI' (an AI receptionist, an AI host, an AI service assistant — worded for your industry). If a caller asks directly whether they're speaking with a real person, Ella always answers honestly, every time — never deflects, never claims to be human."
        visual={
          <FeaturePreviewCard
            icon={BadgeCheck}
            title="AI disclosure"
            rows={[
              { label: "Stated in the opening greeting", value: "Every call", tone: "positive" },
              { label: "If asked directly", value: "Always answers honestly", tone: "positive" },
              { label: "Claims to be human", value: "Never" },
            ]}
          />
        }
      />
    </div>
  );
}
