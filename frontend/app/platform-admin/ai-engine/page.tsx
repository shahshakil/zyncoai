"use client";
import { Brain, MessageCircleWarning, Smile, ShieldAlert, Zap, Timer } from "lucide-react";
import { useApi } from "@/lib/useApi";
import { Card, CardHeader, CardTitle } from "@/components/dashboard/ui/card";
import { Badge } from "@/components/dashboard/ui/badge";
import { Table, Thead, Th, Tbody, Tr, Td, EmptyState } from "@/components/dashboard/ui/table";
import { Topbar } from "@/components/platform-admin/Topbar";

interface Overview {
  ttfb: { avg: number; p50: number; p95: number; p99: number; target: number; level: "ok" | "warning" | "critical" };
  confusion: { hallucinationRiskCallsToday: number; totalCallsToday: number; ratePct: number };
  sentiment: { avgToday: number; negativeCallsToday: number; totalCallsToday: number };
  injectionAttemptsToday: number;
  interruption: { byBusiness: { businessId: string; businessName: string; bargeIns: number; turns: number; pct: number }[]; flaggedBusinesses: any[] };
  apiTimeouts: Record<string, { count: number; avgMs: number; timeouts: number }>;
}

const LEVEL_TONE: Record<string, "success" | "warning" | "danger"> = { ok: "success", warning: "warning", critical: "danger" };

export default function AiEnginePage() {
  const { data } = useApi<Overview>("/api/admin/platform/ai-engine/overview", { refreshInterval: 10000 });
  const { data: negativeCalls } = useApi<{ calls: any[] }>("/api/admin/platform/ai-engine/negative-calls", { refreshInterval: 30000 });
  const { data: blocked } = useApi<{ blocked: { number: string; reason: string }[] }>("/api/admin/platform/ai-engine/blocked-numbers", { refreshInterval: 30000 });

  return (
    <div className="-m-6">
      <Topbar title="AI Engine" refreshIntervalMs={10000} />
      <div className="space-y-6 p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="p-4">
            <div className="flex items-center justify-between"><span className="text-xs font-medium text-[#6B7280]">Time to First Byte</span><Timer className="h-4 w-4 text-[#8B5CF6]" /></div>
            <div className="mt-2 text-2xl font-semibold text-[#1F2937]">{data ? `${data.ttfb.avg}ms` : "…"}</div>
            <p className="mt-0.5 text-[11px] text-[#9CA3AF]">p95 {data?.ttfb.p95}ms · p99 {data?.ttfb.p99}ms · target &lt;{data?.ttfb.target}ms</p>
            {data && data.ttfb.level !== "ok" && <Badge tone={LEVEL_TONE[data.ttfb.level]} className="mt-2">{data.ttfb.level}</Badge>}
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between"><span className="text-xs font-medium text-[#6B7280]">Hallucination Risk</span><MessageCircleWarning className="h-4 w-4 text-[#F59E0B]" /></div>
            <div className="mt-2 text-2xl font-semibold text-[#1F2937]">{data ? `${data.confusion.ratePct}%` : "…"}</div>
            <p className="mt-0.5 text-[11px] text-[#9CA3AF]">{data?.confusion.hallucinationRiskCallsToday}/{data?.confusion.totalCallsToday} calls flagged today</p>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between"><span className="text-xs font-medium text-[#6B7280]">Avg Sentiment Today</span><Smile className="h-4 w-4 text-[#10B981]" /></div>
            <div className="mt-2 text-2xl font-semibold text-[#1F2937]">{data?.sentiment.avgToday ?? "…"}</div>
            <p className="mt-0.5 text-[11px] text-[#9CA3AF]">{data?.sentiment.negativeCallsToday} negative of {data?.sentiment.totalCallsToday} calls</p>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between"><span className="text-xs font-medium text-[#6B7280]">Injection Attempts Today</span><ShieldAlert className="h-4 w-4 text-[#EF4444]" /></div>
            <div className="mt-2 text-2xl font-semibold text-[#1F2937]">{data?.injectionAttemptsToday ?? "…"}</div>
            <p className="mt-0.5 text-[11px] text-[#9CA3AF]">{blocked?.blocked.length ?? 0} numbers currently blocked</p>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader><CardTitle>External API timeouts today</CardTitle></CardHeader>
            <div className="p-4 space-y-2">
              {data && Object.entries(data.apiTimeouts).map(([service, s]) => (
                <div key={service} className="flex items-center justify-between rounded-lg bg-[#F8F9FA] px-3 py-2 text-sm">
                  <span className="capitalize text-[#1F2937]">{service}</span>
                  <span className="text-[#6B7280]">{s.count} calls · avg {s.avgMs}ms · <span className={s.timeouts > 0 ? "font-semibold text-[#EF4444]" : ""}>{s.timeouts} timeouts</span></span>
                </div>
              ))}
              <p className="text-[11px] text-[#9CA3AF]">ElevenLabs isn&apos;t tracked here — Vapi&apos;s assistant calls it server-side, never through this codebase&apos;s own fetch calls.</p>
            </div>
          </Card>
          <Card>
            <CardHeader><CardTitle>High interruption rate businesses (&gt;40%)</CardTitle></CardHeader>
            <div className="p-2">
              {data?.interruption.flaggedBusinesses.length ? (
                <Table>
                  <Thead><tr><Th>Business</Th><Th>Barge-ins</Th><Th>AI turns</Th><Th>Rate</Th></tr></Thead>
                  <Tbody>
                    {data.interruption.flaggedBusinesses.map((b) => (
                      <Tr key={b.businessId}><Td>{b.businessName}</Td><Td>{b.bargeIns}</Td><Td>{b.turns}</Td><Td className="font-semibold text-[#F59E0B]">{b.pct}%</Td></Tr>
                    ))}
                  </Tbody>
                </Table>
              ) : <EmptyState title="No businesses flagged for high interruption today" />}
            </div>
          </Card>
        </div>

        <Card>
          <CardHeader><CardTitle>Recent negative-sentiment calls</CardTitle></CardHeader>
          <div className="p-2">
            {negativeCalls?.calls.length ? (
              <Table>
                <Thead><tr><Th>Business</Th><Th>Caller</Th><Th>Sentiment</Th><Th>When</Th></tr></Thead>
                <Tbody>
                  {negativeCalls.calls.map((c) => (
                    <Tr key={c.id}><Td>{c.businessName}</Td><Td>{c.contactName}</Td><Td className="font-semibold text-[#EF4444]">{c.sentimentScore}</Td><Td>{new Date(c.startedAt).toLocaleString("en-AU")}</Td></Tr>
                  ))}
                </Tbody>
              </Table>
            ) : <EmptyState title="No negative-sentiment calls" />}
          </div>
        </Card>
      </div>
    </div>
  );
}
