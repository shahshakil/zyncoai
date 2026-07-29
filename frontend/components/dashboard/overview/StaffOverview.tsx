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
import { Search, CalendarClock, UserCheck, Phone, Users } from "lucide-react";
import { useApi, apiPost } from "@/lib/useApi";
import { useDashboard } from "@/components/dashboard/BusinessContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/dashboard/ui/card";
import { Input } from "@/components/dashboard/ui/input";
import { Skeleton } from "@/components/dashboard/ui/skeleton";
import { EmptyState } from "@/components/dashboard/ui/table";

const PIPELINE_STEP_LABELS = ["Booked", "Arrived", "In Consultation", "Checked Out"];
const PIPELINE_STEP_STATUS = ["CONFIRMED", "ARRIVED", "IN_CONSULTATION", "COMPLETED"];

interface StaffPayload {
  patientList: { id: string; contactName: string; service: string; timeLabel: string; status: string; pipelineStep: number }[];
  liveCallFeed: { calls: { id: string; fromNumber: string; contactName: string | null; summary: string; durationLabel: string; statusLabel: string; timeAgo: string }[] };
}

interface ContactHit {
  id: string; name: string | null; phone: string; email: string | null;
}

export function StaffOverview() {
  const { business } = useDashboard();
  const { data: resp, isLoading, mutate } = useApi<StaffPayload & { ok: boolean }>("/api/business/dashboard/overview", { refreshInterval: 20000 });
  const [q, setQ] = useState("");
  const [advancingIds, setAdvancingIds] = useState<Set<string>>(new Set());
  const { data: searchResults, isLoading: searching } = useApi<{ data: ContactHit[] }>(q.trim() ? `/api/business/contacts?q=${encodeURIComponent(q.trim())}&pageSize=8` : null);

  async function advanceStatus(appointmentId: string, step: number) {
    setAdvancingIds((s) => new Set(s).add(appointmentId));
    try {
      await apiPost(`/api/business/appointments/${appointmentId}`, { status: PIPELINE_STEP_STATUS[step] }, "PATCH");
      mutate();
    } catch {
      toast.error("Could not update patient status");
    } finally {
      setAdvancingIds((s) => { const n = new Set(s); n.delete(appointmentId); return n; });
    }
  }

  const checkInQueue = (resp?.patientList || []).filter((p) => p.pipelineStep < 3 && !["Cancelled", "No-show"].includes(p.status));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-[#0f172a]">Today</h1>
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

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Today's appointments */}
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-1.5"><CalendarClock className="h-4 w-4 text-slate-400" /> Today&apos;s Appointments</CardTitle></CardHeader>
          <CardContent className="space-y-1.5">
            {isLoading || !resp ? (
              <div className="space-y-2">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
            ) : resp.patientList.length === 0 ? (
              <EmptyState icon={CalendarClock} title="No appointments today" />
            ) : (
              resp.patientList.map((p) => (
                <div key={p.id} className="flex items-center justify-between rounded-lg border border-slate-100 px-3 py-2 text-sm">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-slate-900">{p.contactName}</p>
                    <p className="truncate text-xs text-slate-400">{p.service}</p>
                  </div>
                  <span className="shrink-0 text-xs text-slate-500">{p.timeLabel}</span>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Check-in queue */}
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-1.5"><UserCheck className="h-4 w-4 text-slate-400" /> Check-in Queue</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {isLoading || !resp ? (
              <div className="space-y-2">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}</div>
            ) : checkInQueue.length === 0 ? (
              <EmptyState icon={UserCheck} title="Nobody waiting" description="Patients still moving through arrival show up here." />
            ) : (
              checkInQueue.map((p) => (
                <div key={p.id} className="rounded-lg border border-slate-100 p-2.5">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-slate-900">{p.contactName}</p>
                    <span className="text-xs text-slate-400">{PIPELINE_STEP_LABELS[p.pipelineStep]}</span>
                  </div>
                  <div className="mt-2 flex items-center gap-1">
                    {PIPELINE_STEP_LABELS.map((label, i) => (
                      <button
                        key={label}
                        title={`Mark as ${label}`}
                        disabled={advancingIds.has(p.id) || i < p.pipelineStep}
                        onClick={() => advanceStatus(p.id, i)}
                        className={`h-1.5 flex-1 rounded-full transition ${i <= p.pipelineStep ? "bg-indigo-500" : "bg-slate-200 hover:bg-slate-300"} ${i === p.pipelineStep + 1 ? "cursor-pointer" : i <= p.pipelineStep ? "cursor-default" : "cursor-not-allowed opacity-60"}`}
                      />
                    ))}
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

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
