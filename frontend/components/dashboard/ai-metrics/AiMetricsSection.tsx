"use client";
// Phase 4 — Universal AI Metrics: ROI Counter, Lead Funnel, Ghost Call
// Rescue. Universal = every vertical, shown above the vertical-specific
// panels (which don't exist at all for some verticals, e.g. OTHER).
import { useState } from "react";
import { toast } from "sonner";
import { TrendingUp, Filter, PhoneMissed, PhoneOutgoing } from "lucide-react";
import { useApi, apiPost } from "@/lib/useApi";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/dashboard/ui/card";
import { Button } from "@/components/dashboard/ui/button";
import { Skeleton } from "@/components/dashboard/ui/skeleton";
import { EmptyState } from "@/components/dashboard/ui/table";

interface AiMetricsPayload {
  ok: boolean;
  // null for STAFF/DOCTOR — redacted server-side, not just hidden here (see aiMetrics.ts).
  roiCounter: { revenueGeneratedCents: number; bookingsThisMonth: number; planCostCents: number | null; roiMultiple: number | null } | null;
  leadFunnel: { totalCalls: number; answered: number; engaged: number; booked: number };
  ghostCalls: { count: number; calls: { callId: string; contactName: string | null; phone: string; startedAt: string; reason: string }[] };
}

function timeAgo(iso: string) {
  const diffMin = Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 60000));
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  return `${Math.floor(diffHr / 24)}d ago`;
}

export default function AiMetricsSection() {
  const { data: resp, isLoading, mutate } = useApi<AiMetricsPayload>("/api/business/ai-metrics", { refreshInterval: 60000 });
  const [rescuingIds, setRescuingIds] = useState<Set<string>>(new Set());

  async function rescue(callId: string) {
    setRescuingIds((s) => new Set(s).add(callId));
    try {
      await apiPost(`/api/business/ai-metrics/ghost-calls/${callId}/rescue`);
      toast.success("Calling back now — AI is dialling");
      mutate();
    } catch (e: any) {
      toast.error(e?.message === "voice_engine_not_configured" || e?.message === "twilio_not_configured" ? "Voice calling isn't configured yet" : "Could not place the call");
    } finally {
      setRescuingIds((s) => { const n = new Set(s); n.delete(callId); return n; });
    }
  }

  if (isLoading || !resp) {
    return (
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Skeleton className="h-56 w-full" />
        <Skeleton className="h-56 w-full" />
        <Skeleton className="h-56 w-full" />
      </div>
    );
  }

  const { roiCounter, leadFunnel, ghostCalls } = resp;
  const funnelStages = [
    { label: "Total Calls", count: leadFunnel.totalCalls },
    { label: "Answered", count: leadFunnel.answered },
    { label: "Engaged", count: leadFunnel.engaged },
    { label: "Booked", count: leadFunnel.booked },
  ];
  const maxCount = Math.max(1, leadFunnel.totalCalls);

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      {roiCounter && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-1.5">
              <TrendingUp className="h-4 w-4 text-emerald-500" />
              <CardTitle>ROI Counter</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-2xl font-semibold text-[#0f172a]">AUD ${(roiCounter.revenueGeneratedCents / 100).toLocaleString()}</p>
              <p className="text-xs text-[#94a3b8]">Value generated this month · {roiCounter.bookingsThisMonth} AI bookings</p>
            </div>
            {roiCounter.roiMultiple != null ? (
              <div className="rounded-xl bg-[#f0fdf4] p-3">
                <p className="text-lg font-semibold text-[#16a34a]">{roiCounter.roiMultiple}× return</p>
                <p className="text-xs text-[#166534]">vs. AUD ${((roiCounter.planCostCents || 0) / 100).toLocaleString()} plan cost this month</p>
              </div>
            ) : (
              <p className="text-xs text-[#94a3b8]">Set a pricing plan to see your ROI multiple.</p>
            )}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center gap-1.5">
            <Filter className="h-4 w-4 text-blue-500" />
            <CardTitle>Lead Funnel</CardTitle>
          </div>
          <span className="text-xs text-[#94a3b8]">Last 30 days</span>
        </CardHeader>
        <CardContent>
          {leadFunnel.totalCalls === 0 ? (
            <EmptyState title="No calls in the last 30 days" />
          ) : (
            <div className="space-y-2.5">
              {funnelStages.map((s) => (
                <div key={s.label}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="text-[#374151]">{s.label}</span>
                    <span className="font-medium text-[#0f172a]">{s.count} ({Math.round((s.count / maxCount) * 100)}%)</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full rounded-full bg-blue-500" style={{ width: `${(s.count / maxCount) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-1.5">
            <PhoneMissed className="h-4 w-4 text-red-500" />
            <CardTitle>Ghost Call Rescue</CardTitle>
          </div>
          {ghostCalls.count > 0 && <span className="rounded-full bg-[#fef2f2] px-2 py-0.5 text-xs font-medium text-[#dc2626]">{ghostCalls.count}</span>}
        </CardHeader>
        <CardContent>
          {ghostCalls.calls.length === 0 ? (
            <EmptyState title="No unresolved ghost calls" description="Missed or hung-up calls from the last 30 days show up here." />
          ) : (
            <div className="max-h-60 space-y-1.5 overflow-y-auto pr-1">
              {ghostCalls.calls.map((c) => (
                <div key={c.callId} className="flex items-center justify-between gap-2 rounded-xl border border-[#fecaca] bg-[#fef2f2] p-2.5">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-[#0f172a]">{c.contactName || c.phone}</p>
                    <p className="text-xs text-[#94a3b8]">{c.reason} · {timeAgo(c.startedAt)}</p>
                  </div>
                  <Button size="sm" variant="outline" disabled={rescuingIds.has(c.callId)} onClick={() => rescue(c.callId)}>
                    <PhoneOutgoing className="h-3.5 w-3.5" /> {rescuingIds.has(c.callId) ? "Calling…" : "Call back"}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
