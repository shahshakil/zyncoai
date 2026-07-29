"use client";
import { useEffect, useState } from "react";
import { Search, PhoneCall } from "lucide-react";
import posthog from "posthog-js";
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
import { StatusBadge, OutcomeBadge } from "@/components/dashboard/ui/badge";
import { Pagination } from "@/components/dashboard/ui/pagination";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/dashboard/ui/dialog";

interface Call {
  id: string;
  status: string;
  outcome: string | null;
  direction: string;
  fromNumber: string;
  toNumber: string;
  startedAt: string;
  endedAt: string | null;
  contact: { name: string | null; phone: string } | null;
  provider: { name: string } | null;
}

interface Turn {
  seq: number;
  role: string;
  text: string;
  toolName: string | null;
  guardrailTriggered: boolean;
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

function TranscriptDialog({ call, onClose, businessName }: { call: Call | null; onClose: () => void; businessName: string }) {
  const { data } = useApi<{ turns: Turn[] }>(call ? `/api/business/calls/${call.id}/transcript` : null);
  const { role } = useDashboard();
  const [printReady, setPrintReady] = useState(false);

  useEffect(() => {
    if (call) posthog.capture("call_transcript_viewed", { outcome: call.outcome });
  }, [call]);

  async function loadTranscriptSheets(): Promise<ExportSheet[]> {
    if (!data) return [];
    setPrintReady(true);
    return [
      {
        name: "Transcript",
        columns: [
          { key: "role", label: "Speaker" },
          { key: "text", label: "Text" },
        ],
        rows: data.turns.map((t) => ({ role: t.role, text: t.text })),
      },
    ];
  }

  return (
    <Dialog open={!!call} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <div className="flex w-full items-center justify-between pr-6">
            <DialogTitle>Call transcript</DialogTitle>
            {call && (role === "OWNER" || role === "ADMIN") && (
              <ExportMenu
                section="call-transcript"
                filename={slugFilename(businessName, "CallTranscript")}
                meta={{ businessName, reportTitle: "AI Call Transcript" }}
                loadSheets={loadTranscriptSheets}
                onRowsReady={() => setPrintReady(true)}
                formats={["pdf", "print"]}
              />
            )}
          </div>
        </DialogHeader>
        <div className="max-h-[60vh] space-y-3 overflow-y-auto pr-1">
          {!data ? (
            <p className="text-sm text-slate-400">Loading…</p>
          ) : data.turns.length === 0 ? (
            <p className="text-sm text-slate-400">No transcript captured for this call.</p>
          ) : (
            data.turns.map((t) => (
              <div key={t.seq} className={`rounded-lg p-3 text-sm ${t.role === "assistant" ? "bg-[var(--accent-soft,#eef2ff)] text-slate-800" : t.role === "user" ? "bg-slate-50 text-slate-700" : "bg-amber-50 text-amber-800"}`}>
                <div className="mb-1 text-xs font-medium uppercase tracking-wide opacity-50">{t.role}{t.toolName ? ` · ${t.toolName}` : ""}</div>
                {t.text}
                {t.guardrailTriggered && <div className="mt-1 text-xs text-red-500">⚠ guardrail triggered</div>}
              </div>
            ))
          )}
        </div>
      </DialogContent>

      {call && printReady && data && (
        <div className="print-only">
          <PrintLetterhead reportTitle="AI Call Transcript" dateRangeLabel={new Date(call.startedAt).toLocaleString("en-AU")} />
          <p style={{ marginBottom: 12, fontSize: 12 }}>
            <strong>Outcome:</strong> {call.outcome?.replace(/_/g, " ") || "—"} &nbsp; <strong>Caller:</strong> {call.contact?.name || call.fromNumber}
          </p>
          {data.turns.map((t) => (
            <div key={t.seq} className={t.role === "assistant" ? "print-chat-turn-assistant" : "print-chat-turn-caller"}>
              <div style={{ fontSize: 9, opacity: 0.6, marginBottom: 2, textTransform: "uppercase" }}>{t.role}</div>
              {t.text}
            </div>
          ))}
          <PrintFooter />
        </div>
      )}
    </Dialog>
  );
}

export default function CallsPage() {
  const { business, role } = useDashboard();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [outcome, setOutcome] = useState("");
  const [page, setPage] = useState(1);
  const [transcriptFor, setTranscriptFor] = useState<Call | null>(null);
  const [printRows, setPrintRows] = useState<any[]>([]);

  const query = new URLSearchParams({ page: String(page), pageSize: "20", ...(q ? { q } : {}), ...(status ? { status } : {}), ...(outcome ? { outcome } : {}) }).toString();
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
        <h1 className="text-lg font-semibold text-slate-900">Call History</h1>
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
            {["booked", "callback_requested", "faq_answered", "guardrail_redirect"].map((o) => <option key={o} value={o}>{o.replace(/_/g, " ")}</option>)}
          </Select>
        </div>

        <Table>
          <Thead>
            <tr>
              <Th>Caller</Th>
              <Th>Status</Th>
              <Th>Outcome</Th>
              <Th>Staff</Th>
              <Th>Started</Th>
              <Th></Th>
            </tr>
          </Thead>
          <Tbody>
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} cols={6} />)
            ) : data?.data.length ? (
              data.data.map((c) => (
                <Tr key={c.id}>
                  <Td>
                    <div className="flex items-center gap-2">
                      {(c.status === "RINGING" || c.status === "IN_PROGRESS") && <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />}
                      <div>
                        <p className="font-medium text-slate-900">{c.contact?.name || c.fromNumber}</p>
                        <p className="text-xs text-slate-400">{c.direction.toLowerCase()}</p>
                      </div>
                    </div>
                  </Td>
                  <Td><StatusBadge status={c.status} /></Td>
                  <Td><OutcomeBadge outcome={c.outcome} /></Td>
                  <Td>{c.provider?.name || "—"}</Td>
                  <Td className="text-slate-500">{new Date(c.startedAt).toLocaleString()}</Td>
                  <Td className="text-right">
                    <Button variant="outline" size="sm" onClick={() => setTranscriptFor(c)}>Transcript</Button>
                  </Td>
                </Tr>
              ))
            ) : null}
          </Tbody>
        </Table>
        {!isLoading && !data?.data.length && <EmptyState icon={PhoneCall} title="No calls yet" description="Calls will show up here as your AI receptionist takes them." />}
        {data && <Pagination page={page} totalPages={data.pagination.totalPages} onPageChange={setPage} />}
      </Card>

      <TranscriptDialog call={transcriptFor} onClose={() => setTranscriptFor(null)} businessName={business.name} />

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
