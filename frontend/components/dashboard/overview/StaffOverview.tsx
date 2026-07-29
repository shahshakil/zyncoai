"use client";
// Simplified STAFF landing page — deliberately not the full OverviewDashboard.
// Reuses the same real endpoints as the owner/admin dashboard (dashboard
// overview payload + contacts search) but only renders the 4 things STAFF
// actually needs day-to-day: today's appointments, the check-in queue,
// a call log with no dollar figures, and a patient/contact search. No
// analytics, revenue, ROI, or conversion-rate data is fetched or rendered
// here at all.
import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Search, CalendarClock, Phone, Users } from "lucide-react";
import { useApi, apiPost } from "@/lib/useApi";
import { useDashboard } from "@/components/dashboard/BusinessContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/dashboard/ui/card";
import { Input } from "@/components/dashboard/ui/input";
import { Skeleton } from "@/components/dashboard/ui/skeleton";
import { EmptyState } from "@/components/dashboard/ui/table";

// Same color language as Bookings' check-in buttons/row borders: yellow =
// waiting, blue = checked in, green = done, red = no-show, grey = cancelled.
const ROW_STATUS_STYLE: Record<string, { border: string; dot: string; label: string }> = {
  REQUESTED: { border: "border-l-amber-400", dot: "bg-amber-400", label: "Waiting" },
  CONFIRMED: { border: "border-l-amber-400", dot: "bg-amber-400", label: "Waiting" },
  RESCHEDULED: { border: "border-l-amber-400", dot: "bg-amber-400", label: "Waiting" },
  ARRIVED: { border: "border-l-blue-500", dot: "bg-blue-500", label: "Checked In" },
  COMPLETED: { border: "border-l-emerald-500", dot: "bg-emerald-500", label: "Completed" },
  NO_SHOW: { border: "border-l-rose-500", dot: "bg-rose-500", label: "No Show" },
  CANCELLED: { border: "border-l-slate-400", dot: "bg-slate-400", label: "Cancelled" },
};

interface StaffPayload {
  patientList: { id: string; contactName: string; service: string; timeLabel: string; rawStatus: string }[];
  liveCallFeed: { calls: { id: string; fromNumber: string; contactName: string | null; summary: string; durationLabel: string; statusLabel: string; timeAgo: string }[] };
}

interface ContactHit {
  id: string; name: string | null; phone: string; email: string | null;
}

export function StaffOverview() {
  const { business } = useDashboard();
  const { data: resp, isLoading, mutate } = useApi<StaffPayload & { ok: boolean }>("/api/business/dashboard/overview", { refreshInterval: 8000 });
  const [q, setQ] = useState("");
  const [updatingIds, setUpdatingIds] = useState<Set<string>>(new Set());
  const { data: searchResults, isLoading: searching } = useApi<{ data: ContactHit[] }>(q.trim() ? `/api/business/contacts?q=${encodeURIComponent(q.trim())}&pageSize=8` : null);

  async function updateStatus(appointmentId: string, status: string) {
    setUpdatingIds((s) => new Set(s).add(appointmentId));
    try {
      await apiPost(`/api/business/appointments/${appointmentId}`, { status }, "PATCH");
      mutate();
    } catch {
      toast.error("Could not update patient status");
    } finally {
      setUpdatingIds((s) => { const n = new Set(s); n.delete(appointmentId); return n; });
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#0f172a]">Today</h1>
        <p className="text-sm text-[#94a3b8]">{business.name}</p>
      </div>

      {/* Patient search */}
      <Card>
        <CardHeader><CardTitle>Patient Search</CardTitle></CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input className="pl-9" placeholder="Search name or phone…" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          {q.trim() && (
            <div className="mt-3 space-y-1">
              {searching ? (
                <Skeleton className="h-10 w-full" />
              ) : searchResults?.data.length ? (
                searchResults.data.map((c) => (
                  <Link key={c.id} href={`/dashboard/contacts/${c.id}`} className="flex items-center justify-between rounded-lg border border-slate-100 px-3 py-2 text-sm hover:bg-slate-50">
                    <span className="font-medium text-slate-900">{c.name || c.phone}</span>
                    <span className="text-xs text-slate-400">{c.phone}</span>
                  </Link>
                ))
              ) : (
                <p className="px-1 py-2 text-xs text-slate-400">No matches</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Today's appointments — one color-coded board, one-tap actions.
          Whether a row got here via SMS/QR/IVR self check-in or a manual
          tap, it's the same appointment status underneath — never
          double-counted, and every logged-in device sees it within the
          8s poll. */}
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-1.5"><CalendarClock className="h-4 w-4 text-slate-400" /> Today&apos;s Appointments</CardTitle></CardHeader>
        <CardContent className="space-y-1.5">
          {isLoading || !resp ? (
            <div className="space-y-2">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}</div>
          ) : resp.patientList.length === 0 ? (
            <EmptyState icon={CalendarClock} title="No appointments today" />
          ) : (
            resp.patientList.map((p) => {
              const style = ROW_STATUS_STYLE[p.rawStatus] || ROW_STATUS_STYLE.CONFIRMED;
              const busy = updatingIds.has(p.id);
              return (
                <div key={p.id} className={`rounded-lg border border-l-4 border-slate-100 p-2.5 ${style.border}`}>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-slate-900">{p.contactName}</p>
                      <p className="truncate text-xs text-slate-400">{p.service} · {p.timeLabel}</p>
                    </div>
                    <span className="flex shrink-0 items-center gap-1.5 text-xs text-slate-500">
                      <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} /> {style.label}
                    </span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {["REQUESTED", "CONFIRMED", "RESCHEDULED"].includes(p.rawStatus) && (
                      <button disabled={busy} onClick={() => updateStatus(p.id, "ARRIVED")} className="rounded-lg bg-blue-600 px-2.5 py-1.5 text-xs font-medium text-white transition hover:bg-blue-500 disabled:opacity-50">
                        Check In
                      </button>
                    )}
                    {["CONFIRMED", "RESCHEDULED", "ARRIVED"].includes(p.rawStatus) && (
                      <button disabled={busy} onClick={() => updateStatus(p.id, "COMPLETED")} className="rounded-lg bg-emerald-600 px-2.5 py-1.5 text-xs font-medium text-white transition hover:bg-emerald-500 disabled:opacity-50">
                        Complete
                      </button>
                    )}
                    {["REQUESTED", "CONFIRMED", "RESCHEDULED"].includes(p.rawStatus) && (
                      <button disabled={busy} onClick={() => updateStatus(p.id, "NO_SHOW")} className="rounded-lg bg-rose-600 px-2.5 py-1.5 text-xs font-medium text-white transition hover:bg-rose-500 disabled:opacity-50">
                        No Show
                      </button>
                    )}
                    {!["COMPLETED", "CANCELLED", "NO_SHOW"].includes(p.rawStatus) && (
                      <button disabled={busy} onClick={() => updateStatus(p.id, "CANCELLED")} className="rounded-lg bg-slate-500 px-2.5 py-1.5 text-xs font-medium text-white transition hover:bg-slate-400 disabled:opacity-50">
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>

      {/* Call log — outcomes/summaries only, no financial data */}
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-1.5"><Phone className="h-4 w-4 text-slate-400" /> Call Log</CardTitle></CardHeader>
        <CardContent className="space-y-1.5">
          {isLoading || !resp ? (
            <div className="space-y-2">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
          ) : resp.liveCallFeed.calls.length === 0 ? (
            <EmptyState icon={Users} title="No calls yet today" />
          ) : (
            resp.liveCallFeed.calls.map((c) => (
              <div key={c.id} className="flex items-center justify-between gap-2 rounded-lg border border-slate-100 px-3 py-2 text-sm">
                <div className="min-w-0">
                  <p className="truncate font-medium text-slate-900">{c.contactName || c.fromNumber}</p>
                  <p className="truncate text-xs text-slate-400">{c.summary}</p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-0.5">
                  <span className="text-xs text-slate-500">{c.statusLabel}</span>
                  <span className="text-[10px] text-slate-400">{c.timeAgo}</span>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
