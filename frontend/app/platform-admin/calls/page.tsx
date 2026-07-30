"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import { PhoneCall, Calendar, Clock, Flame, Siren, FileText, Gauge, Download, Printer, Radio, Timer, DollarSign } from "lucide-react";
import { useApi } from "@/lib/useApi";
import { Card, CardHeader, CardTitle } from "@/components/dashboard/ui/card";
import { Button } from "@/components/dashboard/ui/button";
import { Table, Thead, Th, Tbody, Tr, Td, EmptyState } from "@/components/dashboard/ui/table";
import { Badge } from "@/components/dashboard/ui/badge";
import { Topbar } from "@/components/platform-admin/Topbar";
import { StatCard } from "@/components/platform-admin/StatCard";
import { UsageProgressBar } from "@/components/platform-admin/UsageProgressBar";
import { formatNumber, formatMicros, formatDuration, VERTICAL_LABELS, timeAgo } from "@/components/platform-admin/format";
import { TranscriptModal } from "@/components/platform-admin/TranscriptModal";
import { exportToExcel, triggerPrint, type ExportColumn } from "@/lib/exportUtils";

const ChartSkeleton = () => <div className="h-56 animate-pulse rounded-xl bg-slate-100" />;
const GradientBarChart = dynamic(() => import("@/components/platform-admin/charts").then((m) => ({ default: m.GradientBarChart })), { loading: ChartSkeleton, ssr: false });
const GradientAreaChart = dynamic(() => import("@/components/platform-admin/charts").then((m) => ({ default: m.GradientAreaChart })), { loading: ChartSkeleton, ssr: false });
const HorizontalBarChart = dynamic(() => import("@/components/platform-admin/charts").then((m) => ({ default: m.HorizontalBarChart })), { loading: ChartSkeleton, ssr: false });
const DonutChart = dynamic(() => import("@/components/platform-admin/charts").then((m) => ({ default: m.DonutChart })), { loading: ChartSkeleton, ssr: false });
const PeakHoursHeatmap = dynamic(() => import("@/components/platform-admin/charts").then((m) => ({ default: m.PeakHoursHeatmap })), { loading: ChartSkeleton, ssr: false });

const USAGE_COLUMNS: ExportColumn[] = [
  { key: "name", label: "Business", width: 26 },
  { key: "planName", label: "Plan", width: 16 },
  { key: "callsUsed", label: "Calls Used", width: 12, align: "right" },
  { key: "callAllowance", label: "Allowance", width: 12, align: "right" },
  { key: "pctUsed", label: "% Used", width: 10, align: "right" },
  { key: "overageCalls", label: "Overage", width: 10, align: "right" },
];

interface CallsLive { callsInProgress: number; callsLastHour: number; minutesToday: number; callCostTodayMicros: number; asOf: string }

interface UsageRow { businessId: string; name: string; planName: string | null; callAllowance: number | null; callsUsed: number; pctUsed: number | null; overageCalls: number }
interface CallsAnalytics {
  totalToday: number; totalThisMonth: number; avgDurationSec: number; busiestHour: number | null;
  callsPerDay: { date: string; count: number }[];
  heatmap: { dow: number; hour: number; count: number }[];
  byVertical: { vertical: string; count: number }[];
  outcomeBreakdown: { outcome: string; count: number }[];
  businesses: { id: string; name: string; today: number; week: number; month: number }[];
  avgDurationTrend: { date: string; avgSec: number }[];
  answeredVsMissed: { answered: number; missed: number; ongoing: number };
  byState: { state: string; count: number }[];
  emergencyCalls: { id: string; startedAt: string; fromNumber: string; businessName: string }[];
  usageByBusiness: UsageRow[];
  stale?: boolean;
}

const VERTICAL_COLORS = ["#6366F1", "#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#F97316", "#14B8A6"];
const STATE_COLORS = ["#6366F1", "#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#94A3B8"];

export default function CallsAnalyticsPage() {
  const { data } = useApi<CallsAnalytics>("/api/admin/platform/calls-analytics", { refreshInterval: 60000 });
  const { data: live } = useApi<CallsLive>("/api/admin/platform/calls-live", { refreshInterval: 30000 });
  const [transcriptCallId, setTranscriptCallId] = useState<string | null>(null);

  const answeredMissedTotal = data ? data.answeredVsMissed.answered + data.answeredVsMissed.missed + data.answeredVsMissed.ongoing : 0;

  function exportAnalytics() {
    if (!data) return;
    exportToExcel(
      [
        { name: "Calls Per Day", columns: [{ key: "date", label: "Date", width: 14 }, { key: "count", label: "Calls", width: 10, align: "right", total: "sum" }], rows: data.callsPerDay, showTotals: true },
        { name: "By Vertical", columns: [{ key: "vertical", label: "Vertical", width: 18 }, { key: "count", label: "Calls", width: 10, align: "right", total: "sum" }], rows: data.byVertical.map((v) => ({ vertical: VERTICAL_LABELS[v.vertical] || v.vertical, count: v.count })), showTotals: true },
        { name: "Outcomes", columns: [{ key: "outcome", label: "Outcome", width: 18 }, { key: "count", label: "Count", width: 10, align: "right", total: "sum" }], rows: data.outcomeBreakdown, showTotals: true },
        { name: "By Business", columns: [{ key: "name", label: "Business", width: 26 }, { key: "today", label: "Today", width: 10, align: "right" }, { key: "week", label: "This Week", width: 12, align: "right" }, { key: "month", label: "This Month", width: 12, align: "right" }], rows: data.businesses, showTotals: false },
        { name: "Usage", columns: USAGE_COLUMNS, rows: data.usageByBusiness.map((u) => ({ name: u.name, planName: u.planName, callsUsed: u.callsUsed, callAllowance: u.callAllowance ?? "Unlimited", pctUsed: u.pctUsed ?? "—", overageCalls: u.overageCalls })), showTotals: false },
      ],
      { businessName: "ZyncoAI Platform", reportTitle: "Call Analytics", dateRangeLabel: `Generated ${new Date().toLocaleString("en-AU")}` },
      `ZyncoAI-Call-Analytics-${new Date().toISOString().slice(0, 10)}.xlsx`
    );
  }

  return (
    <div className="-m-6">
      <Topbar title="Calls Analytics" refreshIntervalMs={60000} />
      <div className="space-y-6 p-6">
        <div className="no-print flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={exportAnalytics}><Download className="h-4 w-4" /> Excel</Button>
          <Button variant="outline" size="sm" onClick={() => triggerPrint("print")}><Printer className="h-4 w-4" /> Print</Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Radio className="h-4 w-4 text-[#10B981]" /> Live Right Now</CardTitle>
            <p className="mt-0.5 text-xs text-[#9CA3AF]">Refreshes every 30 seconds — not cached.</p>
          </CardHeader>
          <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Calls In Progress" value={formatNumber(live?.callsInProgress || 0)} icon={Radio} gradient="linear-gradient(135deg,#10B981,#34D399)" loading={!live} sublabel="Right now" />
            <StatCard label="Calls — Last Hour" value={formatNumber(live?.callsLastHour || 0)} icon={Timer} gradient="linear-gradient(135deg,#3B82F6,#60A5FA)" loading={!live} />
            <StatCard label="Minutes Today" value={formatNumber(live?.minutesToday || 0)} icon={Clock} gradient="linear-gradient(135deg,#6366F1,#8B5CF6)" loading={!live} />
            <StatCard label="OpenAI/Call Cost Today" value={formatMicros(live?.callCostTodayMicros || 0)} icon={DollarSign} gradient="linear-gradient(135deg,#F97316,#FB923C)" loading={!live} />
          </div>
        </Card>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Calls Today" value={formatNumber(data?.totalToday || 0)} icon={PhoneCall} gradient="linear-gradient(135deg,#10B981,#34D399)" loading={!data} />
          <StatCard label="Calls This Month" value={formatNumber(data?.totalThisMonth || 0)} icon={Calendar} gradient="linear-gradient(135deg,#3B82F6,#60A5FA)" loading={!data} />
          <StatCard label="Average Duration" value={formatDuration(data?.avgDurationSec || 0)} icon={Clock} gradient="linear-gradient(135deg,#6366F1,#8B5CF6)" loading={!data} />
          <StatCard label="Busiest Hour" value={data?.busiestHour != null ? `${String(data.busiestHour).padStart(2, "0")}:00` : "—"} icon={Flame} gradient="linear-gradient(135deg,#F59E0B,#FBBF24)" loading={!data} />
        </div>

        <Card>
          <CardHeader><CardTitle>Calls per Day — Last 30 Days</CardTitle></CardHeader>
          <div className="p-4">{data ? <GradientBarChart data={data.callsPerDay} color="#3B82F6" /> : <Skel />}</div>
        </Card>

        <Card>
          <CardHeader><CardTitle>Peak Hours — Last 90 Days</CardTitle></CardHeader>
          <div className="p-4">{data ? <PeakHoursHeatmap data={data.heatmap} /> : <Skel height={180} />}</div>
        </Card>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader><CardTitle>Average Call Duration — Last 30 Days</CardTitle></CardHeader>
            <div className="p-4">
              {data ? <GradientAreaChart data={data.avgDurationTrend} dataKey="avgSec" xKey="date" color="#8B5CF6" /> : <Skel />}
            </div>
          </Card>
          <Card>
            <CardHeader><CardTitle>Calls Answered vs Missed — Last 30 Days</CardTitle></CardHeader>
            <div className="space-y-3 p-4">
              {data ? (
                <>
                  <ComparisonBar label="Answered" count={data.answeredVsMissed.answered} total={answeredMissedTotal} color="#10B981" />
                  <ComparisonBar label="Missed / No Answer" count={data.answeredVsMissed.missed} total={answeredMissedTotal} color="#EF4444" />
                  <ComparisonBar label="Ongoing" count={data.answeredVsMissed.ongoing} total={answeredMissedTotal} color="#F59E0B" />
                </>
              ) : <Skel height={140} />}
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader><CardTitle>Calls by Vertical</CardTitle></CardHeader>
            <div className="p-4">
              {data ? (
                <HorizontalBarChart
                  data={data.byVertical.map((v) => ({ vertical: VERTICAL_LABELS[v.vertical] || v.vertical, count: v.count }))}
                  dataKey="count" yKey="vertical" colors={VERTICAL_COLORS}
                />
              ) : <Skel />}
            </div>
          </Card>
          <Card>
            <CardHeader><CardTitle>Outcome Breakdown</CardTitle></CardHeader>
            <div className="p-4">{data ? <DonutChart data={data.outcomeBreakdown} /> : <Skel />}</div>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Geographic Breakdown (Australian States)</CardTitle>
            <p className="mt-0.5 text-xs text-[#9CA3AF]">Derived from caller area code — mobile numbers (the majority of callers) carry no state signal and are bucketed separately.</p>
          </CardHeader>
          <div className="p-4">
            {data ? (
              <HorizontalBarChart data={data.byState} dataKey="count" yKey="state" colors={STATE_COLORS} height={Math.max(160, data.byState.length * 36)} />
            ) : <Skel height={200} />}
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Siren className="h-4 w-4 text-[#EF4444]" /> Emergency Calls — Last 90 Days ({data?.emergencyCalls.length ?? 0})</CardTitle>
          </CardHeader>
          <Table>
            <Thead><tr><Th>Business</Th><Th>From</Th><Th>When</Th><Th></Th></tr></Thead>
            <Tbody>
              {data?.emergencyCalls.map((c) => (
                <Tr key={c.id}>
                  <Td className="font-medium text-[#1F2937]">{c.businessName}</Td>
                  <Td>{c.fromNumber}</Td>
                  <Td className="text-xs text-[#6B7280]">{timeAgo(c.startedAt)}</Td>
                  <Td>
                    <button onClick={() => setTranscriptCallId(c.id)} className="flex items-center gap-1 text-xs text-[#6366F1] hover:underline">
                      <FileText className="h-3 w-3" /> View transcript
                    </button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
          {data && !data.emergencyCalls.length && <EmptyState title="No emergency calls" description="Nothing has tripped the emergency guardrail in the last 90 days." />}
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle className="flex items-center gap-2"><Gauge className="h-4 w-4 text-[#F97316]" /> Call Allowance Usage — This Month</CardTitle>
              <p className="mt-0.5 text-xs text-[#9CA3AF]">Counted from the same billable-call data invoices are generated from, so this always matches what a business is actually charged.</p>
            </div>
            <Button
              variant="outline" size="sm"
              onClick={() => exportToExcel(
                [{ name: "Usage", columns: USAGE_COLUMNS, rows: (data?.usageByBusiness || []).map((u) => ({
                  name: u.name, planName: u.planName, callsUsed: u.callsUsed, callAllowance: u.callAllowance ?? "Unlimited", pctUsed: u.pctUsed ?? "—", overageCalls: u.overageCalls,
                })), showTotals: false }],
                { businessName: "ZyncoAI Platform", reportTitle: "Call Allowance Usage" },
                `ZyncoAI-Call-Usage-${new Date().toISOString().slice(0, 10)}.xlsx`
              )}
            >
              <Download className="h-4 w-4" /> Excel
            </Button>
          </CardHeader>
          <Table>
            <Thead><tr><Th>Business</Th><Th>Plan</Th><Th>Calls used</Th><Th>Allowance</Th><Th>Usage</Th><Th>Overage</Th></tr></Thead>
            <Tbody>
              {(data?.usageByBusiness || []).map((u) => (
                <Tr key={u.businessId}>
                  <Td className="font-medium text-[#1F2937]">{u.name}</Td>
                  <Td>{u.planName}</Td>
                  <Td>{u.callsUsed}</Td>
                  <Td>{u.callAllowance ?? "Unlimited"}</Td>
                  <Td className="w-40"><UsageProgressBar pctUsed={u.pctUsed} /></Td>
                  <Td>{u.overageCalls > 0 ? <Badge tone="danger">{u.overageCalls} over</Badge> : <Badge tone="default">—</Badge>}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
          {data && !data.usageByBusiness?.length && <EmptyState title="No businesses on a metered plan yet" description="Assign a plan to a business in its billing settings to track allowance usage here." />}
        </Card>

        <Card>
          <CardHeader><CardTitle>Call Volume by Business</CardTitle></CardHeader>
          <Table>
            <Thead><tr><Th>Business</Th><Th>Today</Th><Th>This Week</Th><Th>This Month</Th></tr></Thead>
            <Tbody>
              {data?.businesses.map((b) => (
                <Tr key={b.id}><Td className="font-medium text-[#1F2937]">{b.name}</Td><Td>{b.today}</Td><Td>{b.week}</Td><Td>{b.month}</Td></Tr>
              ))}
            </Tbody>
          </Table>
          {data && !data.businesses.length && <EmptyState title="No businesses yet" />}
        </Card>
      </div>

      <TranscriptModal callId={transcriptCallId} onClose={() => setTranscriptCallId(null)} />
    </div>
  );
}

function ComparisonBar({ label, count, total, color }: { label: string; count: number; total: number; color: string }) {
  const pct = total ? Math.round((count / total) * 100) : 0;
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-sm">
        <span className="text-[#1F2937]">{label}</span>
        <span className="font-semibold text-[#1F2937]">{count} {total ? `(${pct}%)` : ""}</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-[#F1F5F9]">
        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}

function Skel({ height = 240 }: { height?: number }) {
  return <div className="animate-pulse rounded-lg bg-slate-100" style={{ height }} />;
}
