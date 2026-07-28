"use client";
import { useEffect, useState } from "react";
import { Activity, PhoneCall, Radio, Gauge } from "lucide-react";
import { useApi } from "@/lib/useApi";
import { Card, CardHeader, CardTitle } from "@/components/dashboard/ui/card";
import { Badge } from "@/components/dashboard/ui/badge";
import { RealtimeLineChart } from "@/components/platform-admin/charts";
import { Topbar } from "@/components/platform-admin/Topbar";

interface Overview {
  concurrency: { current: number; capacity: number; pctCapacity: number; level: "ok" | "warning" | "critical" };
  ccr: { total: number; failed: number; ccrPct: number; level: "ok" | "warning" | "critical" };
  carrierLatencyMs: number | null;
  pdd: { avg: number; p95: number; p99: number; latest: number | null };
}

const LEVEL_TONE: Record<string, "success" | "warning" | "danger"> = { ok: "success", warning: "warning", critical: "danger" };

function StatCard({ icon: Icon, label, value, sub, level }: { icon: any; label: string; value: string; sub?: string; level?: "ok" | "warning" | "critical" }) {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-[#6B7280]">{label}</span>
        <Icon className="h-4 w-4" style={{ color: level === "critical" ? "#EF4444" : level === "warning" ? "#F59E0B" : "#0EA5E9" }} />
      </div>
      <div className="mt-2 text-2xl font-semibold text-[#1F2937]">{value}</div>
      {sub && <p className="mt-0.5 text-[11px] text-[#9CA3AF]">{sub}</p>}
      {level && level !== "ok" && <Badge tone={LEVEL_TONE[level]} className="mt-2">{level}</Badge>}
    </Card>
  );
}

export default function InfrastructurePage() {
  const { data } = useApi<Overview>("/api/admin/platform/infrastructure/overview", { refreshInterval: 10000 });
  const { data: concurrencyHistory } = useApi<{ series: { timestamp: string; value: number }[] }>("/api/admin/platform/infrastructure/history/concurrent_calls?minutes=60", { refreshInterval: 30000 });
  const { data: carrierHistory } = useApi<{ series: { timestamp: string; value: number }[] }>("/api/admin/platform/infrastructure/history/carrier_latency_ms?minutes=1440", { refreshInterval: 60000 });

  const anyCritical = data && (data.concurrency.level === "critical" || data.ccr.level === "critical");

  return (
    <div className="-m-6">
      <Topbar title="Infrastructure" refreshIntervalMs={10000} />
      <div className="space-y-6 p-6">
        {anyCritical && (
          <div className="flex items-center gap-2 rounded-xl border border-[#FCA5A5] bg-[#FEF2F2] px-4 py-3 text-sm font-medium text-[#991B1B]">
            Critical infrastructure threshold breached — see below.
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard icon={PhoneCall} label="Concurrent Calls" value={data ? `${data.concurrency.current}/${data.concurrency.capacity}` : "…"} sub={data ? `${data.concurrency.pctCapacity}% of capacity` : undefined} level={data?.concurrency.level} />
          <StatCard icon={Activity} label="Call Completion Rate" value={data ? `${data.ccr.ccrPct}%` : "…"} sub={data ? `${data.ccr.failed}/${data.ccr.total} failed today` : undefined} level={data?.ccr.level} />
          <StatCard icon={Gauge} label="Post-Dial Delay (avg)" value={data?.pdd.avg ? `${data.pdd.avg}ms` : "—"} sub={data ? `p95: ${data.pdd.p95}ms · p99: ${data.pdd.p99}ms` : undefined} />
          <StatCard icon={Radio} label="Carrier API Latency" value={data?.carrierLatencyMs != null ? `${data.carrierLatencyMs}ms` : "—"} sub="Twilio, pinged every 60s" />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader><CardTitle>Concurrent calls — last 60 minutes</CardTitle></CardHeader>
            <div className="p-4">
              <RealtimeLineChart
                data={(concurrencyHistory?.series || []).map((s) => ({ t: new Date(s.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), value: s.value }))}
                dataKey="value"
                color="#0EA5E9"
              />
            </div>
          </Card>
          <Card>
            <CardHeader><CardTitle>Carrier latency — last 24 hours</CardTitle></CardHeader>
            <div className="p-4">
              <RealtimeLineChart
                data={(carrierHistory?.series || []).map((s) => ({ t: new Date(s.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), value: s.value }))}
                dataKey="value"
                color="#3B82F6"
                unit="ms"
              />
            </div>
          </Card>
        </div>

        <p className="text-xs text-[#9CA3AF]">
          Concurrency capacity is configured via <code>VOICE_MAX_CONCURRENT_CALLS</code> (currently {data?.concurrency.capacity ?? "…"}) — no real trunk-capacity config exists upstream yet, so this is an admin-set assumption, not a hard carrier limit.
        </p>
      </div>
    </div>
  );
}
