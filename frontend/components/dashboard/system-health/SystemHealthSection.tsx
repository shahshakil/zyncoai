"use client";
// Phase 8 — System Health Panel. Universal, business-facing signals only
// (voice line status, response latency, integration connectivity) — not
// raw infra internals, which live on the platform-admin health dashboard.
import { Activity, Zap, CalendarCheck, Plug } from "lucide-react";
import { useApi } from "@/lib/useApi";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/dashboard/ui/card";
import { Skeleton } from "@/components/dashboard/ui/skeleton";

interface SystemHealthPayload {
  ok: boolean;
  voiceLine: { status: "healthy" | "degraded" | "no_data"; lastCallAt: string | null; minutesSinceLastCall: number | null; last24h: { total: number; completed: number; failed: number; noAnswer: number; successRatePct: number | null } };
  latency: { avgPddMs: number | null; avgTtfbMs: number | null; sampledCalls: number };
  calendarSync: { connectedProviders: number; totalActiveProviders: number; microsoftConnected: boolean; expiringSoon: number };
  integrations: { connectedCount: number; connected: { provider: string; connectedAt: string }[] };
  telephonyConfigured: boolean;
}

const STATUS_STYLE: Record<string, { label: string; dot: string; text: string; bg: string }> = {
  healthy: { label: "Healthy", dot: "bg-emerald-400", text: "text-[#16a34a]", bg: "bg-[#f0fdf4]" },
  degraded: { label: "Degraded", dot: "bg-amber-400", text: "text-[#d97706]", bg: "bg-[#fffbeb]" },
  no_data: { label: "No calls yet", dot: "bg-slate-400", text: "text-[#64748b]", bg: "bg-slate-50" },
};

function timeAgo(iso: string | null, minutes: number | null) {
  if (!iso || minutes == null) return "Never";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default function SystemHealthSection() {
  const { data: resp, isLoading } = useApi<SystemHealthPayload>("/api/business/system-health", { refreshInterval: 60000 });

  if (isLoading || !resp) {
    return (
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-40 w-full" />)}
      </div>
    );
  }

  const { voiceLine, latency, calendarSync, integrations, telephonyConfigured } = resp;
  const style = STATUS_STYLE[voiceLine.status];

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-1.5">
            <Activity className="h-4 w-4 text-emerald-500" />
            <CardTitle>Voice Line</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${style.bg} ${style.text}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} /> {style.label}
          </span>
          <p className="text-xs text-[#94a3b8]">Last call: {timeAgo(voiceLine.lastCallAt, voiceLine.minutesSinceLastCall)}</p>
          {voiceLine.last24h.total > 0 && (
            <p className="text-xs text-[#94a3b8]">{voiceLine.last24h.successRatePct}% success · {voiceLine.last24h.total} calls (24h)</p>
          )}
          {!telephonyConfigured && <p className="text-xs font-medium text-[#dc2626]">Voice calling not configured</p>}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-1.5">
            <Zap className="h-4 w-4 text-amber-500" />
            <CardTitle>Response Latency</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {latency.sampledCalls === 0 ? (
            <p className="text-xs text-[#94a3b8]">Not available yet</p>
          ) : (
            <>
              <div>
                <p className="text-xl font-semibold text-[#0f172a]">{latency.avgTtfbMs != null ? `${latency.avgTtfbMs}ms` : "—"}</p>
                <p className="text-[11px] text-[#94a3b8]">Avg time to first response</p>
              </div>
              <div>
                <p className="text-sm font-medium text-[#0f172a]">{latency.avgPddMs != null ? `${latency.avgPddMs}ms` : "—"}</p>
                <p className="text-[11px] text-[#94a3b8]">Avg pickup delay · {latency.sampledCalls} calls (24h)</p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-1.5">
            <CalendarCheck className="h-4 w-4 text-blue-500" />
            <CardTitle>Calendar Sync</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm text-[#0f172a]">{calendarSync.connectedProviders}/{calendarSync.totalActiveProviders} staff connected to Google Calendar</p>
          <p className="text-xs text-[#94a3b8]">Microsoft 365: {calendarSync.microsoftConnected ? "Connected" : "Not connected"}</p>
          {calendarSync.expiringSoon > 0 && (
            <p className="text-xs font-medium text-[#d97706]">{calendarSync.expiringSoon} connection(s) expiring within 7 days</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-1.5">
            <Plug className="h-4 w-4 text-violet-500" />
            <CardTitle>Integrations</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {integrations.connectedCount === 0 ? (
            <p className="text-xs text-[#94a3b8]">No third-party integrations connected</p>
          ) : (
            <div className="space-y-1">
              {integrations.connected.map((i) => (
                <div key={i.provider} className="flex items-center justify-between text-xs">
                  <span className="capitalize text-[#374151]">{i.provider.replace(/_/g, " ")}</span>
                  <span className="text-[#16a34a]">Connected</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
