"use client";
import { useState } from "react";
import { Search, PhoneCall, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { useApi } from "@/lib/useApi";
import { useDashboard } from "@/components/dashboard/BusinessContext";
import { ExportMenu } from "@/components/dashboard/ExportMenu";
import { PrintLetterhead, PrintFooter } from "@/components/dashboard/PrintLetterhead";
import { slugFilename, type ExportSheet, type ExportColumn } from "@/lib/exportUtils";
import { Card } from "@/components/dashboard/ui/card";
import { Button } from "@/components/dashboard/ui/button";
import { Input, Select } from "@/components/dashboard/ui/input";
import { Table, Thead, Th, Tbody, Tr, Td, EmptyState } from "@/components/dashboard/ui/table";
import { SkeletonRow } from "@/components/dashboard/ui/skeleton";
import { StatusBadge, OutcomeBadge, Badge } from "@/components/dashboard/ui/badge";
import { Pagination } from "@/components/dashboard/ui/pagination";

interface Call {
  id: string;
  status: string;
  outcome: string | null;
  direction: string;
  isLive: boolean;
  durationSec: number | null;
  vertical: string | null;
  fromNumber: string;
  contactName: string | null;
  provider: { name: string } | null;
  hasIssue: boolean;
  startedAt: string;
}

function formatDuration(sec: number | null): string {
  if (sec === null) return "—";
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

const CALL_COLUMNS: ExportColumn[] = [
  { key: "date", label: "Date", format: (v) => new Date(v).toLocaleDateString("en-AU") },
  { key: "time", label: "Time", format: (v) => new Date(v).toLocaleTimeString("en-AU", { hour: "numeric", minute: "2-digit" }) },
  { key: "callerNumber", label: "Caller Number" },
  { key: "durationSeconds", label: "Duration (sec)", align: "right", total: "sum" },
  { key: "outcome", label: "Outcome" },
  { key: "transcriptSummary", label: "Transcript Summary" },
  { key: "followUpRequired", label: "Follow-up Required" },
];

export default function CallsPage() {
  const { business, role } = useDashboard();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [outcome, setOutcome] = useState("");
  const [hasIssue, setHasIssue] = useState(false);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [page, setPage] = useState(1);
  const [printRows, setPrintRows] = useState<any[]>([]);

  const query = new URLSearchParams({
    page: String(page),
    pageSize: "20",
    ...(q ? { q } : {}),
    ...(status ? { status } : {}),
    ...(outcome ? { outcome } : {}),
    ...(hasIssue ? { hasIssue: "true" } : {}),
    ...(from ? { from } : {}),
    ...(to ? { to } : {}),
  }).toString();
  // Live calls float to the top server-side (endedAt nulls-first ordering)
  // and re-poll every 10s — no separate SSE/WS needed for "is anything
  // live right now" at list-view granularity; the detail page's own
  // 2s poll is where true live-mode (streaming transcript) lives.
  const { data, isLoading } = useApi<{ data: Call[]; pagination: { totalPages: number } }>(`/api/business/calls?${query}`, { refreshInterval: 10000 });

  const canExportCalls = role === "OWNER" || role === "ADMIN";

  async function loadCallSheets(): Promise<ExportSheet[]> {
    const r = await fetch("/api/business/export/calls", { credentials: "include" });
    const json = await r.json();
    if (!json.ok) throw new Error("export_failed");
    return [{ name: "Calls", columns: CALL_COLUMNS, rows: json.rows, showTotals: true }];
  }

  return (
    <div className="space-y-6">
      <div className="no-print flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-[#0f172a]">Call History</h1>
        {canExportCalls && (
          <ExportMenu
            section="calls"
            filename={slugFilename(business.name, "CallHistory")}
            meta={{ businessName: business.name, reportTitle: "Call Activity Report", filtersLabel: [q && `search: ${q}`, status, outcome].filter(Boolean).join(", ") || undefined }}
            loadSheets={loadCallSheets}
            onRowsReady={(sheets) => setPrintRows(sheets[0].rows)}
          />
        )}
      </div>

      <Card className="no-print">
        <div className="flex flex-wrap items-center gap-3 border-b border-slate-200 p-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input className="pl-9" placeholder="Search phone or name…" value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} />
          </div>
          <Select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} className="w-40">
            <option value="">All statuses</option>
            {["RINGING", "IN_PROGRESS", "COMPLETED", "FAILED", "NO_ANSWER"].map((s) => <option key={s} value={s}>{s}</option>)}
          </Select>
          <Select value={outcome} onChange={(e) => { setOutcome(e.target.value); setPage(1); }} className="w-44">
            <option value="">All outcomes</option>
            {["booked", "ordered", "rescheduled", "cancelled", "callback", "faq", "emergency", "abandoned"].map((o) => <option key={o} value={o}>{o.replace(/_/g, " ")}</option>)}
          </Select>
          <Input type="date" value={from} onChange={(e) => { setFrom(e.target.value); setPage(1); }} className="w-40" title="From date" />
          <Input type="date" value={to} onChange={(e) => { setTo(e.target.value); setPage(1); }} className="w-40" title="To date" />
          <label className="flex items-center gap-1.5 text-sm text-slate-600">
            <input type="checkbox" checked={hasIssue} onChange={(e) => { setHasIssue(e.target.checked); setPage(1); }} className="h-4 w-4 rounded border-slate-300" />
            Has issue
          </label>
        </div>

        <Table>
          <Thead>
            <tr>
              <Th>Caller</Th>
              <Th>Status</Th>
              <Th>Outcome</Th>
              <Th>Duration</Th>
              <Th>Staff</Th>
              <Th>Started</Th>
              <Th></Th>
            </tr>
          </Thead>
          <Tbody>
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} cols={7} />)
            ) : data?.data.length ? (
              data.data.map((c) => (
                <Tr key={c.id}>
                  <Td>
                    <div className="flex items-center gap-2">
                      {c.isLive && (
                        <span className="flex items-center gap-1 rounded-full bg-rose-50 px-1.5 py-0.5 text-[10px] font-semibold text-rose-600">
                          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-rose-500" /> LIVE
                        </span>
                      )}
                      <div>
                        <p className="font-medium text-slate-900">{c.contactName || c.fromNumber}</p>
                        <p className="text-xs text-slate-400">{c.direction.toLowerCase()}</p>
                      </div>
                      {c.hasIssue && <AlertTriangle className="h-3.5 w-3.5 text-amber-500" aria-label="Issue flagged" />}
                    </div>
                  </Td>
                  <Td><StatusBadge status={c.status} /></Td>
                  <Td><OutcomeBadge outcome={c.outcome} /></Td>
                  <Td className="text-slate-500">{c.isLive ? "in progress" : formatDuration(c.durationSec)}</Td>
                  <Td>{c.provider?.name || "—"}</Td>
                  <Td className="text-slate-500">{new Date(c.startedAt).toLocaleString()}</Td>
                  <Td className="text-right">
                    <Link href={`/dashboard/calls/${c.id}`}>
                      <Button variant="outline" size="sm">View</Button>
                    </Link>
                  </Td>
                </Tr>
              ))
            ) : null}
          </Tbody>
        </Table>
        {!isLoading && !data?.data.length && <EmptyState icon={PhoneCall} title="No calls yet" description="Calls will show up here as your AI receptionist takes them." />}
        {data && <Pagination page={page} totalPages={data.pagination.totalPages} onPageChange={setPage} />}
      </Card>

      {canExportCalls && (
        <div className="print-only">
          <PrintLetterhead reportTitle="Call Activity Report" filtersLabel={[q && `search: ${q}`, status, outcome].filter(Boolean).join(", ") || undefined} />
          <table className="print-table">
            <thead><tr>{CALL_COLUMNS.map((c) => <th key={c.key}>{c.label}</th>)}</tr></thead>
            <tbody>
              {printRows.map((row, i) => (
                <tr key={i}>{CALL_COLUMNS.map((c) => <td key={c.key}>{c.format ? c.format((row as any)[c.key], row) : String((row as any)[c.key] ?? "")}</td>)}</tr>
              ))}
            </tbody>
          </table>
          <PrintFooter />
        </div>
      )}
    </div>
  );
}
