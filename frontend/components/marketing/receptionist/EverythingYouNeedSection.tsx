"use client";
import { motion } from "framer-motion";
import { FileText, ClipboardCheck, TrendingUp, Mail, Calendar, CalendarClock, MessageSquare, Puzzle } from "lucide-react";

// 2026-08-10 — the "needsConfirmation" flag below now actually renders (a
// "Coming soon" badge, same treatment as AddOnsSection.tsx's comingSoon)
// instead of being carried on the data and silently ignored by the JSX.
// Checked against the running code, not assumed from the feature list:
//  - Microsoft Calendar: now real (src/lib/microsoftGraph.ts's
//    connect-calendar OAuth flow, built during this session's OAuth trust
//    audit) — flag removed, no longer "coming soon".
//  - SMS confirmations: still genuinely blocked, documented in
//    src/lib/sms.ts -- CrazyTel needs a portal-generated SMS-specific API
//    key (the general key 403s on send), Twilio's number has SMS disabled
//    and AU also requires ACMA Sender ID Register approval.
//  - Practice software integrations: only a staff-sync-scoped Cliniko
//    connector exists (imports the practitioner list), not a full booking/
//    PMS integration -- so this stays generic, no platform named publicly.
// Don't remove the remaining tags, and don't name a specific PMS platform,
// until independently re-verified working.
const ITEMS = [
  {
    icon: FileText,
    color: "#4f46e5",
    title: "Files & document management",
    desc: "Referrals, reports, and consent forms stored against each patient record.",
  },
  {
    icon: ClipboardCheck,
    color: "#06b6d4",
    title: "Insurance claims",
    desc: "Track Medicare, DVA, WorkCover, and NDIS claims from lodged through to paid.",
  },
  {
    icon: TrendingUp,
    color: "#10b981",
    title: "Financial & revenue dashboard",
    desc: "Revenue by payer, doctor, and service, plus staff pay and operating costs.",
  },
  {
    icon: Mail,
    color: "#f59e0b",
    title: "Email confirmations",
    desc: "Automatic booking confirmations sent the moment Ella completes a booking.",
  },
  {
    icon: Calendar,
    color: "#4f46e5",
    title: "Google Calendar sync",
    desc: "Two-way sync with each provider's real Google Calendar availability.",
  },
  {
    icon: CalendarClock,
    color: "#06b6d4",
    title: "Microsoft Calendar sync",
    desc: "Two-way sync with Outlook/Microsoft 365 calendars.",
  },
  {
    icon: MessageSquare,
    color: "#10b981",
    title: "SMS confirmations",
    desc: "Text-message booking confirmations alongside email.",
    needsConfirmation: true,
  },
  {
    icon: Puzzle,
    color: "#f59e0b",
    title: "Practice software integrations",
    desc: "Connects to the practice management software you already use.",
    needsConfirmation: true,
  },
];

export function EverythingYouNeedSection() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#475569]">Beyond the phone call</p>
        <h2 className="mt-2 text-3xl font-bold text-[#0f172a] sm:text-4xl">Everything your practice needs</h2>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {ITEMS.map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ delay: i * 0.05 }}
            className={`relative rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.04)] ${item.needsConfirmation ? "opacity-70" : ""}`}
          >
            {item.needsConfirmation && (
              <span className="absolute right-4 top-4 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#475569]">
                Coming soon
              </span>
            )}
            <div className="flex h-12 w-12 items-center justify-center rounded-xl" style={{ background: `${item.color}1a` }}>
              <item.icon className="h-6 w-6" style={{ color: item.color }} />
            </div>
            <h3 className="mt-4 text-base font-semibold text-[#0f172a]">{item.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-[#475569]">{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
