"use client";
import { useEffect, useRef, useState } from "react";
import { CheckCircle2, AlertTriangle, XCircle, Radio, Cpu, MemoryStick, HardDrive, Server } from "lucide-react";
import { useApi } from "@/lib/useApi";
import { Card, CardHeader, CardTitle } from "@/components/dashboard/ui/card";
import { Table, Thead, Th, Tbody, Tr, Td, EmptyState } from "@/components/dashboard/ui/table";
import { Badge } from "@/components/dashboard/ui/badge";
import { RealtimeLineChart } from "@/components/platform-admin/charts";
import { Topbar } from "@/components/platform-admin/Topbar";

type SvcStatus = "ok" | "warning" | "critical";

interface HealthData {
  services: { name: string; ok: boolean; status: SvcStatus; latencyMs: number; detail: string }[];
  allHealthy: boolean;
  activeVoiceAgents: number;
  jobs: { completedToday: number; failedToday: number; pendingNow: number };
  requestsPerMinute: number;
  errorRatePct: number;
  memoryUsageMb: number;
  uptimeSec: number;
  resources: { cpuPct: number; memPct: number; diskPct: number; cpuStatus: SvcStatus; memStatus: SvcStatus; diskStatus: SvcStatus };
  pm2Processes: { name: string; status: string; memoryMb: number; cpuPct: number; restarts: number }[];
  stale?: boolean;
}
interface Incident {
  id: string; service: string; detail: string | null; openedAt: string; resolvedAt: string | null; durationSec: number | null; ongoing: boolean;
}

const HISTORY_MAX = 30; // 5 minutes at a 10s poll

const STATUS_COLOR: Record<SvcStatus, string> = { ok: "#10B981", warning: "#F59E0B", critical: "#EF4444" };

function statusIcon(status: SvcStatus) {
  if (status === "ok") return <CheckCircle2 className="h-4 w-4" style={{ color: STATUS_COLOR.ok }} />;
  if (status === "warning") return <AlertTriangle className="h-4 w-4" style={{ color: STATUS_COLOR.warning }} />;
  return <XCircle className="h-4 w-4" style={{ color: STATUS_COLOR.critical }} />;
}

function formatDuration(sec: number): string {
  if (sec < 60) return `${sec}s`;
  if (sec < 3600) return `${Math.round(sec / 60)}m`;
  return `${Math.round(sec / 3600)}h`;
}

export default function SystemHealthPage() {
  const { data } = useApi<HealthData>("/api/admin/platform/health", { refreshInterval: 10000 });
  const { data: incidentData } = useApi<{ incidents: Incident[] }>("/api/admin/platform/health/incidents", { refreshInterval: 60000 });
  const [history, setHistory] = useState<{ t: string; rpm: number; errPct: number }[]>([]);
  const lastTs = useRef<number>(0);

  useEffect(() => {
    if (!data) return;
    const now = Date.now();
    if (now - lastTs.current < 8000) return; // dedupe SWR re-renders within a poll cycle
    lastTs.current = now;
    setHistory((h) => [...h, { t: new Date().toLocaleTimeString([], { minute: "2-digit", second: "2-digit" }), rpm: data.requestsPerMinute, errPct: data.errorRatePct }].slice(-HISTORY_MAX));
  }, [data]);

  return (
    <div className="-m-6">
      <Topbar title="System Health" refreshIntervalMs={10000} />
      <div className="space-y-6 p-6">
        {data && !data.allHealthy && (
          <div className="flex items-center gap-2 rounded-xl border border-[#FCA5A5] bg-[#FEF2F2] px-4 py-3 text-sm font-medium text-[#991B1B]">
            <AlertTriangle className="h-5 w-5" /> One or more services need attention — see below.
          </div>
        )}

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {(data?.services || Array.from({ length: 8 })).map((s: any, i) => (
            <Card key={i} className="p-4">
              {s ? (
                <>
                  <div className="flex items-center gap-2">
                    {statusIcon(s.status)}
                    <span className="text-sm font-medium text-[#1F2937]">{s.name}</span>
                  </div>
                  <p className="mt-2 text-xs text-[#6B7280]">{s.detail}</p>
                  {s.latencyMs > 0 && <p className="text-xs text-[#9CA3AF]">{s.latencyMs}ms</p>}
                </>
              ) : <div className="h-14 animate-pulse rounded-md bg-slate-100" />}
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <ResourceGauge icon={Cpu} label="CPU" pct={data?.resources.cpuPct} status={data?.resources.cpuStatus} />
          <ResourceGauge icon={MemoryStick} label="Memory" pct={data?.resources.memPct} status={data?.resources.memStatus} />
          <ResourceGauge icon={HardDrive} label="Disk" pct={data?.resources.diskPct} status={data?.resources.diskStatus} />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Radio className="h-4 w-4 text-[#6366F1] animate-pulse" /> API Requests / Minute</CardTitle>
            </CardHeader>
            <div className="p-4">
              {history.length ? <RealtimeLineChart data={history} dataKey="rpm" color="#6366F1" /> : <Skel height={160} />}
            </div>
          </Card>
          <Card>
            <CardHeader><CardTitle>Error Rate</CardTitle></CardHeader>
            <div className="p-4">
              {history.length ? <RealtimeLineChart data={history} dataKey="errPct" color={data && data.errorRatePct > 1 ? "#EF4444" : "#10B981"} unit="%" /> : <Skel height={160} />}
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricTile label="Voice agents active now" value={data?.activeVoiceAgents ?? "—"} />
          <MetricTile label="Jobs completed today" value={data?.jobs.completedToday ?? "—"} />
          <MetricTile label="Jobs failed today" value={data?.jobs.failedToday ?? "—"} tone={data && data.jobs.failedToday > 0 ? "danger" : undefined} />
          <MetricTile label="Jobs pending now" value={data?.jobs.pendingNow ?? "—"} />
        </div>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Server className="h-4 w-4 text-[#6B7280]" /> PM2 Processes</CardTitle></CardHeader>
          <Table>
            <Thead><tr><Th>Process</Th><Th>Status</Th><Th>Memory</Th><Th>CPU</Th><Th>Restarts</Th></tr></Thead>
            <Tbody>
              {data?.pm2Processes.map((p, i) => (
                <Tr key={i}>
                  <Td className="font-medium text-[#1F2937]">{p.name}</Td>
                  <Td><Badge tone={p.status === "online" ? "success" : "danger"}>{p.status}</Badge></Td>
                  <Td>{p.memoryMb} MB</Td>
                  <Td>{p.cpuPct}%</Td>
                  <Td className={p.restarts > 5 ? "text-[#EF4444]" : ""}>{p.restarts}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
          {data && !data.pm2Processes.length && <EmptyState title="pm2 process list unavailable" description="Either pm2 isn't managing this process, or the pm2 CLI isn't reachable from this container." />}
        </Card>

        <Card>
          <CardHeader><CardTitle>Incident History — Last 7 Days</CardTitle></CardHeader>
          <Table>
            <Thead><tr><Th>Service</Th><Th>Opened</Th><Th>Duration</Th><Th>Status</Th></tr></Thead>
            <Tbody>
              {incidentData?.incidents.map((inc) => (
                <Tr key={inc.id}>
                  <Td className="font-medium text-[#1F2937]">{inc.service}</Td>
                  <Td className="text-xs text-[#6B7280]">{new Date(inc.openedAt).toLocaleString()}</Td>
                  <Td>{inc.durationSec != null ? formatDuration(inc.durationSec) : "—"}</Td>
                  <Td><Badge tone={inc.ongoing ? "danger" : "default"}>{inc.ongoing ? "Ongoing" : "Resolved"}</Badge></Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
          {incidentData && !incidentData.incidents.length && <EmptyState title="No incidents" description="No service has flipped unhealthy in the last 7 days." />}
        </Card>

        <Card className="p-4">
          <p className="text-xs text-[#9CA3AF]">Process memory: {data?.memoryUsageMb ?? "—"} MB · Uptime: {data ? formatUptime(data.uptimeSec) : "—"}</p>
        </Card>
      </div>
    </div>
  );
}

function ResourceGauge({ icon: Icon, label, pct, status }: { icon: any; label: string; pct?: number; status?: SvcStatus }) {
  const color = status ? STATUS_COLOR[status] : "#94A3B8";
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-2 text-sm font-medium text-[#1F2937]"><Icon className="h-4 w-4 text-[#6B7280]" /> {label}</span>
        <span className="text-sm font-bold" style={{ color }}>{pct != null ? `${pct}%` : "—"}</span>
      </div>
      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-[#F1F5F9]">
        <div className="h-full rounded-full transition-all" style={{ width: `${pct ?? 0}%`, background: color }} />
      </div>
      {status === "critical" && <p className="mt-1 text-[11px] text-[#EF4444]">Critical — immediate attention needed</p>}
      {status === "warning" && <p className="mt-1 text-[11px] text-[#F59E0B]">Warning — running hot</p>}
    </Card>
  );
}

function MetricTile({ label, value, tone }: { label: string; value: number | string; tone?: "danger" }) {
  return (
    <Card className="p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-[#6B7280]">{label}</p>
      <p className={`mt-1 text-xl font-bold ${tone === "danger" && Number(value) > 0 ? "text-[#EF4444]" : "text-[#1F2937]"}`}>{value}</p>
    </Card>
  );
}

function formatUptime(sec: number): string {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  return `${h}h ${m}m`;
}

function Skel({ height = 240 }: { height?: number }) {
  return <div className="animate-pulse rounded-lg bg-slate-100" style={{ height }} />;
}
