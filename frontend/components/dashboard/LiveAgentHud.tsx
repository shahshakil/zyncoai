"use client";
// Replaces the static Doctor Status grid's "just a list" feel with a live
// HUD for whatever the AI is doing right now, on top of the same real
// per-doctor availability data as before.
//
// Honest-data note: Call rows have no reliable providerId while a call is
// in progress (backend/prisma/schema.prisma's Call.providerId is only ever
// set — indirectly, via the appointment — once a booking completes), so
// there's no real "this doctor is on this call" link to draw from. Rather
// than fabricate one, this shows active AI calls as a shared "AI Agent"
// live feed (equalizer + intent + transcript, exactly as specced) sitting
// above the real per-doctor availability grid, instead of merging the two.
import { useApi } from "@/lib/useApi";
import { useDashboard } from "@/components/dashboard/BusinessContext";
import { getVerticalTheme } from "@/components/dashboard/verticalTheme";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/dashboard/ui/card";
import { Skeleton } from "@/components/dashboard/ui/skeleton";
import { EmptyState } from "@/components/dashboard/ui/table";

interface LiveCall {
  id: string;
  contactName: string | null;
  fromNumber: string;
  status: string;
  sentiment: "positive" | "neutral" | "negative";
  intent: "booking_request" | "checking_calendar" | "confirming_details" | "assisting";
  lastLine: { role: string; text: string } | null;
}

interface DoctorStatus {
  id: string;
  name: string;
  title: string | null;
  status: "AVAILABLE" | "BUSY" | "AWAY";
  seenToday: number;
  totalToday: number;
  isSelf: boolean;
}

const INTENT_LABEL: Record<LiveCall["intent"], string> = {
  booking_request: "Booking Request",
  checking_calendar: "Checking Calendar",
  confirming_details: "Confirming Details",
  assisting: "Assisting Caller",
};
const INTENT_COLOR: Record<LiveCall["intent"], string> = {
  booking_request: "bg-blue-50 text-blue-700",
  checking_calendar: "bg-amber-50 text-amber-700",
  confirming_details: "bg-emerald-50 text-emerald-700",
  assisting: "bg-indigo-50 text-indigo-700",
};

const DOCTOR_DOT: Record<DoctorStatus["status"], string> = {
  AVAILABLE: "bg-emerald-400",
  BUSY: "bg-amber-400",
  AWAY: "bg-slate-500",
};

function Equalizer({ color }: { color: string }) {
  return (
    <div className="flex h-4 items-end gap-0.5">
      {[0, 1, 2, 3, 4].map((i) => (
        <span
          key={i}
          className="w-0.5 rounded-full"
          style={{ background: color, animation: `zynco-eq 0.8s ease-in-out ${i * 0.1}s infinite`, height: "40%" }}
        />
      ))}
    </div>
  );
}

export function LiveAgentHud({ doctorStatus, isLoading }: { doctorStatus: DoctorStatus[]; isLoading: boolean }) {
  const { business } = useDashboard();
  const theme = getVerticalTheme(business.vertical);
  const { data } = useApi<{ ok: boolean; calls: LiveCall[] }>("/api/business/ai-operations/live", { refreshInterval: 3000 });
  const activeCalls = data?.calls || [];

  return (
    <Card>
      <style jsx global>{`
        @keyframes zynco-eq {
          0%, 100% { height: 25%; }
          50% { height: 100%; }
        }
      `}</style>
      <CardHeader>
        <CardTitle>Doctor Status</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activeCalls.length > 0 && (
          <div className="space-y-2 rounded-2xl border p-3" style={{ borderColor: "var(--accent-border)", background: "var(--accent-light)" }}>
            <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide" style={{ color: "var(--accent-text)" }}>
              <span className="h-1.5 w-1.5 animate-pulse rounded-full" style={{ background: theme.accent }} /> AI Agent — Live
            </div>
            {activeCalls.map((c) => (
              <div key={c.id} className="rounded-xl border border-[var(--border,#e2e8f0)] bg-white p-2.5 shadow-sm">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <Equalizer color={theme.accent} />
                    <span className="truncate text-xs font-medium text-slate-900">{c.contactName || c.fromNumber}</span>
                  </div>
                  <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${INTENT_COLOR[c.intent]}`}>{INTENT_LABEL[c.intent]}</span>
                </div>
                {c.lastLine && (
                  <p key={c.lastLine.text} className="mt-1.5 truncate text-[11px] text-slate-500 animate-in fade-in duration-500">
                    &ldquo;{c.lastLine.text}&rdquo;
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-2 gap-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 w-full" />)}</div>
        ) : doctorStatus.length === 0 ? (
          <EmptyState title="No staff yet" />
        ) : (
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {doctorStatus.map((d) => (
              <div
                key={d.id}
                className={`rounded-xl border p-3 transition-all ${
                  d.status === "AVAILABLE" ? "border-[#bbf7d0] bg-[#f0fdf4]" : d.status === "BUSY" ? "border-[#fed7aa] bg-[#fffbeb]" : "border-[#fecaca] bg-[#fef2f2]"
                } ${d.isSelf ? "ring-2 ring-[#2563eb] ring-offset-1" : ""}`}
              >
                <span className="flex items-center gap-1.5 text-[10px] font-semibold">
                  <span className={`h-1.5 w-1.5 rounded-full ${DOCTOR_DOT[d.status]}`} />
                  {d.status}
                </span>
                <p className="mt-1.5 text-sm font-medium text-[#0f172a]">{d.name}</p>
                <p className="text-xs text-[#94a3b8]">{d.title || "Staff"}</p>
                <p className="mt-1 text-[11px] text-[#64748b]">{d.seenToday}/{d.totalToday} seen today</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
