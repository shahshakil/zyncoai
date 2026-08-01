"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import { Server, Cpu, MemoryStick, HardDrive, Network, Database, Layers, RefreshCw, UserCheck } from "lucide-react";
import { useApi, apiPost } from "@/lib/useApi";
import { Card, CardHeader, CardTitle } from "@/components/dashboard/ui/card";
import { Button } from "@/components/dashboard/ui/button";
import { Table, Thead, Th, Tbody, Tr, Td, EmptyState } from "@/components/dashboard/ui/table";
import { Badge } from "@/components/dashboard/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/dashboard/ui/dialog";
import { Topbar } from "@/components/platform-admin/Topbar";

const ResponseTimeChart = dynamic(() => import("@/components/platform-admin/charts").then((m) => ({ default: m.ResponseTimeChart })), { loading: () => <Skel height={260} />, ssr: false });
const GradientBarChart = dynamic(() => import("@/components/platform-admin/charts").then((m) => ({ default: m.GradientBarChart })), { loading: () => <Skel height={220} />, ssr: false });
const RealtimeLineChart = dynamic(() => import("@/components/platform-admin/charts").then((m) => ({ default: m.RealtimeLineChart })), { loading: () => <Skel height={220} />, ssr: false });

type CapacityLevel = "green" | "yellow" | "orange" | "red";
const LEVEL_COLOR: Record<CapacityLevel, string> = { green: "#10B981", yellow: "#F59E0B", orange: "#F97316", red: "#EF4444" };

interface WorkerDetail { name: string; port: number; status: string; activeCalls: number | null; maxConcurrentCalls: number | null }
interface ProviderInfo { name: string; role: "llm" | "tts" | "stt"; configured: boolean; status: string; latencyMs: number | null; usage: string | null; usageNote: string }
interface FallbackEvent { time: string; service: string; from: string; to: string; reason: string }
interface VoiceInfraData {
  generatedAt: string;
  concurrency: { activeCalls: number; maxCapacity: number; pctCapacity: number; level: CapacityLevel };
  workers: WorkerDetail[];
  responseTime: { llmAvgMs: number; ttsAvgMs: number; targetMs: number; llmSeries: { timestamp: number; value: number }[]; ttsSeries: { timestamp: number; value: number }[] };
  providers: ProviderInfo[];
  fallbackEvents: FallbackEvent[];
  callsRejectedCapacityToday: number;
  systemResources: { cpuPct: number; ramUsedGb: number; ramTotalGb: number; diskUsedGb: number | null; diskTotalGb: number | null; diskPct: number; network: { inMbps: number; outMbps: number } };
  transcriptQueue: { pending: number; processing: number; completed: number; failed: number };
  redis: { connected: boolean; memoryUsedMb: number | null; maxMemoryMb: number | null; keys: number | null; opsPerSec: number | null };
  identification: {
    cnamAttempted: number;
    cnamSuccess: number;
    cnamSuccessRatePct: number;
    nameSource: { database: number; cnam: number; call: number; unknown: number };
    lowConfidenceNameEvents: number;
    sessionRecoveryEvents: number;
    namesSavedToday: number;
  };
  historical: { callsPerHour: { hour: string; count: number }[]; peakConcurrentCalls: number; concurrentCallsSeries: { timestamp: Date; value: number }[] };
}

function resourceStatus(pct: number): "green" | "yellow" | "red" {
  if (pct >= 90) return "red";
  if (pct >= 75) return "yellow";
  return "green";
}
const RESOURCE_COLOR = { green: "#10B981", yellow: "#F59E0B", red: "#EF4444" };

// Circular gauge, hand-built (SVG stroke-dasharray) rather than pulled from
// a chart library's radial-bar API — simpler and gives exact control over
// the "large circular gauge" spec, not a generic donut chart repurposed.
function ConcurrencyGauge({ activeCalls, maxCapacity, pctCapacity, level }: VoiceInfraData["concurrency"]) {
  const size = 220;
  const stroke = 18;
  const r = (size - stroke) / 2;
  const circumference = 2 * Math.PI * r;
  const filled = Math.min(1, pctCapacity / 100) * circumference;
  const color = LEVEL_COLOR[level];

  return (
    <div className="flex flex-col items-center justify-center py-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#F1F5F9" strokeWidth={stroke} />
          <circle
            cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke}
            strokeDasharray={`${filled} ${circumference}`} strokeLinecap="round"
            style={{ transition: "stroke-dasharray 0.6s ease, stroke 0.3s ease" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-bold text-[#1F2937]">{activeCalls}</span>
          <span className="text-xs text-[#9CA3AF]">of {maxCapacity} calls</span>
          <span className="mt-1 text-lg font-semibold" style={{ color }}>{pctCapacity}%</span>
        </div>
      </div>
      {level === "red" && (
        <p className="mt-3 text-xs font-medium text-[#EF4444]">🔴 At capacity — Slack alert active above 90%</p>
      )}
    </div>
  );
}

const PROVIDER_ICON: Record<string, string> = { ok: "🟢", in_cooldown: "🔴", not_configured: "⚪", standby: "🟡" };

function ProviderCard({ p }: { p: ProviderInfo }) {
  return (
    <div className="rounded-lg border border-[#E5E7EB] p-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-[#1F2937]">{PROVIDER_ICON[p.status] || "⚪"} {p.name}</span>
        <Badge tone={p.status === "ok" ? "success" : p.status === "in_cooldown" ? "danger" : p.status === "standby" ? "warning" : "default"}>
          {p.status.replace(/_/g, " ")}
        </Badge>
      </div>
      <p className="mt-1.5 text-xs text-[#6B7280]">
        Latency: {p.latencyMs != null ? `${p.latencyMs}ms` : "—"}
      </p>
      <p className="mt-0.5 text-[11px] text-[#9CA3AF]">{p.usageNote}</p>
    </div>
  );
}

function WorkerCard({ w, onClick }: { w: WorkerDetail; onClick: () => void }) {
  const up = w.status === "UP";
  return (
    <button
      onClick={onClick}
      className="rounded-lg border border-[#E5E7EB] p-3 text-left transition hover:border-[#6366F1] hover:shadow-sm"
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-[#1F2937]">{w.name} ({w.port})</span>
        <span>{up ? "✅" : "❌"}</span>
      </div>
      <p className="mt-1 text-xs text-[#6B7280]">
        {up ? "Online" : "Offline"} — {w.activeCalls != null ? `${w.activeCalls} calls` : "unreachable"}
      </p>
    </button>
  );
}

export default function VoiceInfrastructurePage() {
  const { data, mutate } = useApi<VoiceInfraData>("/api/admin/platform/voice-infrastructure", { refreshInterval: 5000 });
  const [logsWorker, setLogsWorker] = useState<string | null>(null);
  const [retrying, setRetrying] = useState(false);

  async function retryFailed() {
    setRetrying(true);
    try {
      await apiPost("/api/admin/platform/voice-infrastructure/transcript-queue/retry-failed");
      mutate();
    } finally {
      setRetrying(false);
    }
  }

  const responseTimeChartData = buildResponseTimeChartData(data?.responseTime.llmSeries || [], data?.responseTime.ttsSeries || []);
  const callsPerHourChartData = (data?.historical.callsPerHour || []).map((h) => ({ date: h.hour, count: h.count }));
  const concurrentSeriesChartData = (data?.historical.concurrentCallsSeries || []).map((p) => ({ t: new Date(p.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), value: p.value }));

  return (
    <div className="-m-6">
      <Topbar title="Voice Infrastructure" lastUpdated={data ? new Date(data.generatedAt) : null} refreshIntervalMs={5000} />
      <div className="space-y-6 p-6">
        {/* 1. Concurrent calls gauge */}
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Server className="h-4 w-4 text-[#6366F1]" /> Concurrent Calls</CardTitle></CardHeader>
          <div className="p-4 pt-0">
            {data ? <ConcurrencyGauge {...data.concurrency} /> : <Skel height={220} />}
          </div>
        </Card>

        {/* 2. HAProxy worker status */}
        <Card>
          <CardHeader><CardTitle>Pipecat Workers</CardTitle></CardHeader>
          <div className="grid grid-cols-1 gap-3 p-4 pt-0 sm:grid-cols-2 lg:grid-cols-3">
            {data ? data.workers.map((w) => <WorkerCard key={w.name} w={w} onClick={() => setLogsWorker(w.name)} />) : Array.from({ length: 6 }).map((_, i) => <Skel key={i} height={70} />)}
          </div>
        </Card>

        {/* 3. Response time chart */}
        <Card>
          <CardHeader>
            <CardTitle>Response Time — Last 60 Minutes</CardTitle>
            <p className="mt-0.5 text-xs text-[#9CA3AF]">
              Avg LLM: <span className="font-medium text-[#1F2937]">{data?.responseTime.llmAvgMs ?? "—"}ms</span> · Avg TTS: <span className="font-medium text-[#1F2937]">{data?.responseTime.ttsAvgMs ?? "—"}ms</span>
            </p>
          </CardHeader>
          <div className="p-4 pt-0">
            {data ? (responseTimeChartData.length ? <ResponseTimeChart data={responseTimeChartData} targetMs={data.responseTime.targetMs} /> : <EmptyState title="No response-time data yet" description="Real LLM/TTS latency is captured per call — nothing has come through in the last 60 minutes." />) : <Skel height={260} />}
          </div>
        </Card>

        {/* 4. Provider health */}
        <Card>
          <CardHeader><CardTitle>Provider Health</CardTitle></CardHeader>
          <div className="grid grid-cols-1 gap-3 p-4 pt-0 sm:grid-cols-2 lg:grid-cols-3">
            {data ? data.providers.map((p) => <ProviderCard key={p.name} p={p} />) : Array.from({ length: 5 }).map((_, i) => <Skel key={i} height={90} />)}
          </div>
        </Card>

        {/* 5. Fallback events */}
        <Card>
          <CardHeader><CardTitle>Fallback Events — Today</CardTitle></CardHeader>
          <div className="p-4 pt-0">
            {!data ? <Skel height={100} /> : !data.fallbackEvents.length ? (
              <p className="text-sm text-[#10B981]">No fallback events today ✅</p>
            ) : (
              <Table>
                <Thead><tr><Th>Time</Th><Th>Provider</Th><Th>Reason</Th><Th>Fallback To</Th></tr></Thead>
                <Tbody>
                  {data.fallbackEvents.map((e, i) => (
                    <Tr key={i}>
                      <Td className="text-xs text-[#6B7280]">{new Date(e.time).toLocaleTimeString()}</Td>
                      <Td className="capitalize">{e.service} / {e.from}</Td>
                      <Td className="max-w-xs truncate text-xs" title={e.reason}>{e.reason}</Td>
                      <Td className="capitalize">{e.to}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            )}
          </div>
        </Card>

        {/* 6. Calls rejected */}
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-[#1F2937]">Calls Rejected (Admission Control) — Today</span>
            {data && data.callsRejectedCapacityToday > 0 ? (
              <Badge tone="danger">{data.callsRejectedCapacityToday} rejected</Badge>
            ) : (
              <span className="text-sm text-[#10B981]">No calls rejected today ✅</span>
            )}
          </div>
        </Card>

        {/* 7. System resources */}
        <Card>
          <CardHeader><CardTitle>System Resources</CardTitle></CardHeader>
          <div className="grid grid-cols-1 gap-3 p-4 pt-0 sm:grid-cols-2 lg:grid-cols-4">
            <ResourceTile icon={Cpu} label="CPU" value={data ? `${data.systemResources.cpuPct}%` : "—"} pct={data?.systemResources.cpuPct} />
            <ResourceTile icon={MemoryStick} label="RAM" value={data ? `${data.systemResources.ramUsedGb} / ${data.systemResources.ramTotalGb} GB` : "—"} pct={data ? Math.round((data.systemResources.ramUsedGb / data.systemResources.ramTotalGb) * 100) : undefined} />
            <ResourceTile icon={HardDrive} label="Disk" value={data ? `${data.systemResources.diskUsedGb ?? "—"} / ${data.systemResources.diskTotalGb ?? "—"} GB` : "—"} pct={data?.systemResources.diskPct} />
            <ResourceTile icon={Network} label="Network" value={data ? `${data.systemResources.network.inMbps} MB/s in · ${data.systemResources.network.outMbps} MB/s out` : "—"} />
          </div>
        </Card>

        {/* 8. Transcript queue */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2"><Layers className="h-4 w-4 text-[#6B7280]" /> Transcript Queue</span>
              {data && data.transcriptQueue.failed > 0 && (
                <Button size="sm" variant="outline" disabled={retrying} onClick={retryFailed}>
                  <RefreshCw className={`h-3.5 w-3.5 ${retrying ? "animate-spin" : ""}`} /> Retry failed
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <div className="grid grid-cols-2 gap-3 p-4 pt-0 sm:grid-cols-4">
            <MetricTile label="Pending" value={data?.transcriptQueue.pending} />
            <MetricTile label="Processing" value={data?.transcriptQueue.processing} />
            <MetricTile label="Completed" value={data?.transcriptQueue.completed} />
            <MetricTile label="Failed" value={data?.transcriptQueue.failed} tone={data && data.transcriptQueue.failed > 0 ? "danger" : undefined} />
          </div>
        </Card>

        {/* 9. Redis status */}
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Database className="h-4 w-4 text-[#6B7280]" /> Redis Status</CardTitle></CardHeader>
          <div className="grid grid-cols-2 gap-3 p-4 pt-0 sm:grid-cols-4">
            <div className="rounded-lg border border-[#E5E7EB] p-3">
              <p className="text-xs font-medium text-[#6B7280]">Connected</p>
              <p className="mt-1 text-lg font-semibold">{data ? (data.redis.connected ? "✅" : "❌") : "…"}</p>
            </div>
            <MetricTile label="Memory used" value={data?.redis.memoryUsedMb != null ? `${data.redis.memoryUsedMb} / ${data.redis.maxMemoryMb} MB` : undefined} isText />
            <MetricTile label="Keys" value={data?.redis.keys ?? undefined} />
            <MetricTile label="Ops/sec" value={data?.redis.opsPerSec ?? undefined} />
          </div>
        </Card>

        {/* 10. Customer identification */}
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><UserCheck className="h-4 w-4 text-[#6B7280]" /> Customer Identification — Today</CardTitle></CardHeader>
          <div className="grid grid-cols-2 gap-3 p-4 pt-0 sm:grid-cols-4">
            <MetricTile label="CNAM lookup success rate" value={data ? `${data.identification.cnamSuccessRatePct}% (${data.identification.cnamSuccess}/${data.identification.cnamAttempted})` : undefined} />
            <MetricTile label="Low confidence events" value={data?.identification.lowConfidenceNameEvents} />
            <MetricTile label="Session recovery events" value={data?.identification.sessionRecoveryEvents} />
            <MetricTile label="Names saved to contacts" value={data?.identification.namesSavedToday} />
          </div>
          {data && (() => {
            const { database, cnam, call, unknown } = data.identification.nameSource;
            const total = database + cnam + call + unknown;
            const pct = (n: number) => (total > 0 ? Math.round((n / total) * 100) : 0);
            return (
              <div className="px-4 pb-4">
                <p className="mb-2 text-xs font-medium text-[#6B7280]">Name source breakdown ({total} calls today)</p>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <MetricTile label={`Database (${pct(database)}%)`} value={database} />
                  <MetricTile label={`CNAM (${pct(cnam)}%)`} value={cnam} />
                  <MetricTile label={`Captured on call (${pct(call)}%)`} value={call} />
                  <MetricTile label={`Unknown (${pct(unknown)}%)`} value={unknown} />
                </div>
              </div>
            );
          })()}
        </Card>

        {/* 11. Historical charts */}
        <Card>
          <CardHeader><CardTitle>Calls Per Hour — Last 24h</CardTitle></CardHeader>
          <div className="p-4 pt-0">
            {data ? <GradientBarChart data={callsPerHourChartData} dataKey="count" xKey="date" color="#6366F1" height={200} /> : <Skel height={200} />}
          </div>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Peak Concurrent Calls — Last 24h</CardTitle>
            <p className="mt-0.5 text-xs text-[#9CA3AF]">Peak: <span className="font-medium text-[#1F2937]">{data?.historical.peakConcurrentCalls ?? "—"}</span> concurrent calls</p>
          </CardHeader>
          <div className="p-4 pt-0">
            {data ? (concurrentSeriesChartData.length ? <RealtimeLineChart data={concurrentSeriesChartData} dataKey="value" color="#8B5CF6" height={200} /> : <EmptyState title="No history yet" description="Snapshots are recorded once a minute — check back shortly." />) : <Skel height={200} />}
          </div>
        </Card>
      </div>

      <Dialog open={!!logsWorker} onOpenChange={(v) => !v && setLogsWorker(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader><DialogTitle>{logsWorker} — recent logs</DialogTitle></DialogHeader>
          {logsWorker && <WorkerLogs name={logsWorker} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function WorkerLogs({ name }: { name: string }) {
  const { data } = useApi<{ ok: boolean; logs: string }>(`/api/admin/platform/voice-infrastructure/workers/${name}/logs`);
  return (
    <pre className="max-h-[60vh] overflow-auto rounded-lg bg-[#0F172A] p-3 text-[11px] leading-relaxed text-[#D1D5DB]">
      {data ? data.logs || "No log output." : "Loading…"}
    </pre>
  );
}

function ResourceTile({ icon: Icon, label, value, pct }: { icon: any; label: string; value: string; pct?: number }) {
  const color = pct != null ? RESOURCE_COLOR[resourceStatus(pct)] : "#94A3B8";
  return (
    <div className="rounded-lg border border-[#E5E7EB] p-3">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-xs font-medium text-[#6B7280]"><Icon className="h-3.5 w-3.5" /> {label}</span>
        {pct != null && <span className="text-xs font-bold" style={{ color }}>{pct}%</span>}
      </div>
      <p className="mt-1.5 text-sm font-semibold text-[#1F2937]">{value}</p>
      {pct != null && (
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[#F1F5F9]">
          <div className="h-full rounded-full transition-all" style={{ width: `${Math.min(100, pct)}%`, background: color }} />
        </div>
      )}
    </div>
  );
}

function MetricTile({ label, value, tone }: { label: string; value?: number | string; tone?: "danger"; isText?: boolean }) {
  return (
    <div className="rounded-lg border border-[#E5E7EB] p-3">
      <p className="text-xs font-medium text-[#6B7280]">{label}</p>
      <p className={`mt-1 text-lg font-semibold ${tone === "danger" && Number(value) > 0 ? "text-[#EF4444]" : "text-[#1F2937]"}`}>
        {value ?? "—"}
      </p>
    </div>
  );
}

function buildResponseTimeChartData(
  llmSeries: { timestamp: number; value: number }[],
  ttsSeries: { timestamp: number; value: number }[]
): { t: string; llm?: number; tts?: number }[] {
  // Merge two independently-sampled series onto one timeline by 1-minute
  // bucket — they don't share timestamps (LLM and TTS metrics land at
  // different points in each call), so a naive zip would misalign them.
  const buckets = new Map<string, { t: string; llm?: number; tts?: number; llmCount: number; ttsCount: number }>();
  const bucketKey = (ts: number) => {
    const d = new Date(Math.floor(ts / 60000) * 60000);
    return d.toISOString();
  };
  for (const p of llmSeries) {
    const key = bucketKey(p.timestamp);
    const b = buckets.get(key) || { t: key, llmCount: 0, ttsCount: 0 };
    b.llm = ((b.llm || 0) * b.llmCount + p.value) / (b.llmCount + 1);
    b.llmCount += 1;
    buckets.set(key, b);
  }
  for (const p of ttsSeries) {
    const key = bucketKey(p.timestamp);
    const b = buckets.get(key) || { t: key, llmCount: 0, ttsCount: 0 };
    b.tts = ((b.tts || 0) * b.ttsCount + p.value) / (b.ttsCount + 1);
    b.ttsCount += 1;
    buckets.set(key, b);
  }
  return Array.from(buckets.values())
    .sort((a, b) => a.t.localeCompare(b.t))
    .map((b) => ({
      t: new Date(b.t).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      llm: b.llm != null ? Math.round(b.llm) : undefined,
      tts: b.tts != null ? Math.round(b.tts) : undefined,
    }));
}

function Skel({ height = 100 }: { height?: number }) {
  return <div className="animate-pulse rounded-lg bg-slate-100" style={{ height }} />;
}
