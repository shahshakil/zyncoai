"use client";
// Document Centre (Part 6) — all documents across all patients, filterable
// by type/date/doctor/status, bulk ZIP download, bulk email send, and an
// expiry-alert banner for referrals/WorkCover approvals nearing their
// expiresAt date. Available to all clinic-portal roles (backend already
// scopes DOCTOR to their own patients' documents).
import { useState } from "react";
import { toast } from "sonner";
import { AlertTriangle, Download, Send, Printer, FolderOpen } from "lucide-react";
import { useApi, apiPost } from "@/lib/useApi";
import { useDashboard } from "@/components/dashboard/BusinessContext";
import { getVerticalOps } from "@/lib/verticalOps";
import { Card } from "@/components/dashboard/ui/card";
import { Button } from "@/components/dashboard/ui/button";
import { Input, Select, Label } from "@/components/dashboard/ui/input";
import { Skeleton } from "@/components/dashboard/ui/skeleton";
import { Table, Thead, Th, Tbody, Tr, Td, EmptyState } from "@/components/dashboard/ui/table";
import { Badge } from "@/components/dashboard/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/dashboard/ui/dialog";
import { triggerPrint } from "@/lib/exportUtils";

const DOC_TYPES = ["REFERRAL", "SPECIALIST_REPORT", "IMAGING_REPORT", "PATHOLOGY_REPORT", "INSURANCE_FORM", "CONSENT_FORM", "SCAN_RESULT", "OTHER"];
const RESULT_STATUSES = ["PENDING", "RECEIVED", "REVIEWED"];
const STATUS_TONE: Record<string, "success" | "warning" | "info"> = { REVIEWED: "success", RECEIVED: "info", PENDING: "warning" };

interface DocRow {
  id: string; docType: string; scanType: string | null; filename: string; resultStatus: string | null;
  expiresAt: string | null; createdAt: string; contact: { id: string; name: string | null; phone: string } | null;
  sendLogs: { sentToEmail: string; sentAt: string }[];
}

export default function DocumentsPage() {
  const { business } = useDashboard();
  const ops = getVerticalOps(business.vertical);
  const isMedical = ops?.vertical === "MEDICAL" || ops?.vertical === "DENTAL";
  const [docType, setDocType] = useState("");
  const [labelFilter, setLabelFilter] = useState("");
  const [resultStatus, setResultStatus] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkSendOpen, setBulkSendOpen] = useState(false);

  const qs = new URLSearchParams({
    ...(docType ? { docType } : {}), ...(resultStatus ? { resultStatus } : {}),
    ...(from ? { from } : {}), ...(to ? { to } : {}),
  }).toString();
  const { data, isLoading, mutate } = useApi<{ ok: boolean; documents: DocRow[] }>(ops ? `/api/business/documents?${qs}` : null);
  const { data: expiring } = useApi<{ ok: boolean; documents: DocRow[] }>(ops ? "/api/business/documents/expiring-soon?days=14" : null);
  const rows = isMedical || !labelFilter ? data?.documents : data?.documents.filter((d) => (d.scanType || d.docType).toLowerCase().includes(labelFilter.toLowerCase()));

  if (!ops) {
    return <EmptyState title="Not available" description="This section isn't enabled for this business's vertical." />;
  }

  function toggleSelected(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  async function download(doc: DocRow) {
    const res = await fetch(`/api/business/documents/${doc.id}/download`, { credentials: "include" });
    const json = await res.json();
    if (!json.ok) { toast.error("Could not generate download link"); return; }
    window.open(json.url, "_blank");
  }

  return (
    <div className="space-y-6">
      <div className="no-print flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-[#0f172a]">{ops.documentsLabel}</h1>
        <div className="flex gap-2">
          <a href={`/api/business/documents/export-zip?${qs}`}>
            <Button variant="outline" size="sm"><Download className="h-4 w-4" /> Download ZIP</Button>
          </a>
          {selected.size > 0 && (
            <Button size="sm" onClick={() => setBulkSendOpen(true)}><Send className="h-4 w-4" /> Send {selected.size} selected</Button>
          )}
          <Button variant="outline" size="sm" onClick={() => triggerPrint("print")}><Printer className="h-4 w-4" /> Print</Button>
        </div>
      </div>

      {!!expiring?.documents.length && (
        <div className="no-print flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
          <div>
            <p className="text-sm font-medium text-amber-800">{expiring.documents.length} document{expiring.documents.length > 1 ? "s" : ""} expiring within 14 days</p>
            <p className="mt-0.5 text-xs text-amber-700">
              {expiring.documents.slice(0, 5).map((d) => `${d.contact?.name || d.contact?.phone || "Unknown"} — ${d.scanType || d.docType.replace(/_/g, " ")} (${d.expiresAt ? new Date(d.expiresAt).toLocaleDateString("en-AU") : ""})`).join(" · ")}
            </p>
          </div>
        </div>
      )}

      <Card>
        <div className="no-print flex flex-wrap items-end gap-3 border-b border-slate-100 p-4">
          {isMedical ? (
            <div>
              <Label>Document type</Label>
              <Select value={docType} onChange={(e) => setDocType(e.target.value)} className="w-52">
                <option value="">All types</option>
                {DOC_TYPES.map((t) => <option key={t} value={t}>{t.replace(/_/g, " ")}</option>)}
              </Select>
            </div>
          ) : (
            <div>
              <Label>Type / label</Label>
              <Input list="doc-label-filter" value={labelFilter} onChange={(e) => setLabelFilter(e.target.value)} placeholder="Search…" className="w-52" />
              <datalist id="doc-label-filter">{ops.docLabelSuggestions.map((s) => <option key={s} value={s} />)}</datalist>
            </div>
          )}
          <div>
            <Label>Result status</Label>
            <Select value={resultStatus} onChange={(e) => setResultStatus(e.target.value)} className="w-40">
              <option value="">All</option>
              {RESULT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </Select>
          </div>
          <div><Label>From</Label><Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} /></div>
          <div><Label>To</Label><Input type="date" value={to} onChange={(e) => setTo(e.target.value)} /></div>
        </div>

        {isLoading ? (
          <div className="space-y-2 p-4">
            {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
          </div>
        ) : (
          <>
            <Table>
              <Thead><tr><Th></Th><Th>{ops.contactLabel}</Th><Th>Type</Th><Th>Filename</Th><Th>Status</Th><Th>Uploaded</Th><Th>Expires</Th><Th></Th></tr></Thead>
              <Tbody>
                {rows?.map((d) => (
                  <Tr key={d.id}>
                    <Td><input type="checkbox" checked={selected.has(d.id)} onChange={() => toggleSelected(d.id)} /></Td>
                    <Td className="font-medium text-slate-700">{d.contact?.name || d.contact?.phone || "—"}</Td>
                    <Td>{d.scanType || d.docType.replace(/_/g, " ")}</Td>
                    <Td className="max-w-[220px] truncate">{d.filename}</Td>
                    <Td>{d.resultStatus ? <Badge tone={STATUS_TONE[d.resultStatus] || "default"}>{d.resultStatus}</Badge> : "—"}</Td>
                    <Td className="text-xs text-slate-400">{new Date(d.createdAt).toLocaleDateString("en-AU")}</Td>
                    <Td className="text-xs text-slate-400">{d.expiresAt ? new Date(d.expiresAt).toLocaleDateString("en-AU") : "—"}</Td>
                    <Td><button title="Download" onClick={() => download(d)} className="text-slate-400 hover:text-slate-900"><Download className="h-4 w-4" /></button></Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
            {rows && !rows.length && <EmptyState icon={FolderOpen} title="No documents match these filters" />}
          </>
        )}
      </Card>

      <BulkSendDialog open={bulkSendOpen} documentIds={Array.from(selected)} onClose={() => setBulkSendOpen(false)} onSent={() => { setSelected(new Set()); mutate(); }} />
    </div>
  );
}

function BulkSendDialog({ open, documentIds, onClose, onSent }: { open: boolean; documentIds: string[]; onClose: () => void; onSent: () => void }) {
  const [to, setTo] = useState("");
  const [recipientType, setRecipientType] = useState("PATIENT");
  const [sending, setSending] = useState(false);

  async function send() {
    if (!to.trim()) { toast.error("Enter a recipient email"); return; }
    setSending(true);
    try {
      const res = await apiPost<{ ok: boolean; sent: number }>("/api/business/documents/bulk-send", { documentIds, to: to.trim(), recipientType }, "POST");
      toast.success(`${res.sent} document(s) sent`);
      onSent();
      onClose();
      setTo("");
    } catch {
      toast.error("Bulk send failed");
    } finally {
      setSending(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent>
        <DialogHeader><DialogTitle>Send {documentIds.length} document(s)</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Recipient</Label>
            <Select value={recipientType} onChange={(e) => setRecipientType(e.target.value)}>
              <option value="PATIENT">Patient</option>
              <option value="INSURER">Insurance company</option>
              <option value="REFERRING_DOCTOR">Referring doctor</option>
              <option value="MEDICARE">Medicare</option>
              <option value="OTHER">Other</option>
            </Select>
          </div>
          <div><Label>Email address</Label><Input type="email" value={to} onChange={(e) => setTo(e.target.value)} placeholder="name@example.com" /></div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={onClose}>Cancel</Button>
            <Button onClick={send} disabled={sending}>{sending ? "Sending…" : "Send"}</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
