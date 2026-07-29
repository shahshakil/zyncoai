"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import posthog from "posthog-js";
import { toast } from "sonner";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { ArrowLeft, Phone, CalendarClock, StickyNote, Tag as TagIcon, Merge, FileDown, Printer, Loader2 } from "lucide-react";
import { useApi, apiPost } from "@/lib/useApi";
import { useDashboard } from "@/components/dashboard/BusinessContext";
import { ClinicPatientPanel, PatientFlagBadges } from "@/components/dashboard/ClinicPatientPanel";
import { getVerticalOps } from "@/lib/verticalOps";
import { PrintLetterhead, PrintFooter } from "@/components/dashboard/PrintLetterhead";
import { triggerPrint, logExport, hasAckedExportConsent, ackExportConsent } from "@/lib/exportUtils";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/dashboard/ui/card";
import { Button } from "@/components/dashboard/ui/button";
import { Textarea, Input } from "@/components/dashboard/ui/input";
import { TagBadge, OutcomeBadge, StatusBadge } from "@/components/dashboard/ui/badge";
import { Skeleton } from "@/components/dashboard/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/dashboard/ui/dialog";
import Link from "next/link";

const ALL_TAGS = ["vip", "new", "regular", "no-show", "flagged"];

interface PatientRecord {
  contact: { id: string; name: string | null; phone: string; email: string | null };
  past: { id: string; startAt: string; status: string; recordType: string | null; doctor?: string; notes?: string | null }[];
  upcoming: { id: string; startAt: string; status: string; recordType: string | null; doctor?: string }[];
  notes: { id: string; body: string; createdAt: string }[];
}

// PDF/Print only, per spec — a patient summary document, not a spreadsheet.
// Restricted to OWNER/ADMIN/DOCTOR both here and server-side (STAFF never
// gets a menu at all, and the backend 403s them regardless).
function PatientRecordExportButton({ contactId, businessName, vertical }: { contactId: string; businessName: string; vertical: string }) {
  const ops = getVerticalOps(vertical);
  const contactLabel = ops?.contactLabel || "Patient";
  const providerLabel = ops?.providerLabel || "Doctor";
  const bookingLabelPlural = `${ops?.bookingLabel || "Appointment"}s`;
  const [loading, setLoading] = useState<"pdf" | "print" | null>(null);
  const [record, setRecord] = useState<PatientRecord | null>(null);

  async function run(kind: "pdf" | "print") {
    if (!hasAckedExportConsent()) {
      ackExportConsent();
      toast.info("Exported data is subject to the Australian Privacy Act 1988 — handle it securely.");
    }
    setLoading(kind);
    try {
      const r = await fetch(`/api/business/export/patient/${contactId}`, { credentials: "include" });
      const json = await r.json();
      if (!json.ok) {
        toast.error(`Couldn't load ${contactLabel.toLowerCase()} record`);
        return;
      }
      setRecord(json);
      logExport("patient-record", kind, json.past.length + json.upcoming.length);
      requestAnimationFrame(() => requestAnimationFrame(() => triggerPrint(kind)));
    } finally {
      setLoading(null);
    }
  }

  return (
    <>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button
            disabled={loading !== null}
            title={`Export ${contactLabel.toLowerCase()} summary`}
            className="no-print inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm transition hover:border-[var(--accent,#4f46e5)]/40 hover:text-[var(--accent,#4f46e5)] disabled:opacity-40"
          >
            {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <FileDown className="h-3.5 w-3.5" />}
            Export
          </button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content align="end" sideOffset={6} className="no-print z-50 min-w-[190px] rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl">
            <DropdownMenu.Item onSelect={() => run("pdf")} className="flex cursor-pointer select-none items-center gap-2 rounded-lg px-2.5 py-2 text-sm text-slate-700 outline-none transition hover:bg-slate-50">
              <FileDown className="h-4 w-4 text-rose-500" /> 📋 Export to PDF
            </DropdownMenu.Item>
            <DropdownMenu.Item onSelect={() => run("print")} className="flex cursor-pointer select-none items-center gap-2 rounded-lg px-2.5 py-2 text-sm text-slate-700 outline-none transition hover:bg-slate-50">
              <Printer className="h-4 w-4 text-slate-500" /> 🖨️ Print
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>

      {record && (
        <div className="print-only">
          <PrintLetterhead reportTitle={`${contactLabel} Summary`} />
          <p style={{ fontSize: 13, fontWeight: 700, marginBottom: 4 }}>{record.contact.name || record.contact.phone}</p>
          <p style={{ fontSize: 11, color: "#64748b", marginBottom: 16 }}>{record.contact.phone}{record.contact.email ? ` · ${record.contact.email}` : ""}</p>

          <p style={{ fontSize: 12, fontWeight: 700, marginBottom: 6 }}>Upcoming {bookingLabelPlural.toLowerCase()}</p>
          <table className="print-table" style={{ marginBottom: 16 }}>
            <thead><tr><th>Date</th><th>Type</th><th>{providerLabel}</th><th>Status</th></tr></thead>
            <tbody>
              {record.upcoming.length === 0 && <tr><td colSpan={4}>None scheduled</td></tr>}
              {record.upcoming.map((a) => (
                <tr key={a.id}><td>{new Date(a.startAt).toLocaleString("en-AU")}</td><td>{a.recordType || "—"}</td><td>{a.doctor || "—"}</td><td>{a.status}</td></tr>
              ))}
            </tbody>
          </table>

          <p style={{ fontSize: 12, fontWeight: 700, marginBottom: 6 }}>Past {bookingLabelPlural.toLowerCase()}</p>
          <table className="print-table" style={{ marginBottom: 16 }}>
            <thead><tr><th>Date</th><th>Type</th><th>{providerLabel}</th><th>Status</th><th>Notes</th></tr></thead>
            <tbody>
              {record.past.length === 0 && <tr><td colSpan={5}>None recorded</td></tr>}
              {record.past.map((a) => (
                <tr key={a.id}><td>{new Date(a.startAt).toLocaleString("en-AU")}</td><td>{a.recordType || "—"}</td><td>{a.doctor || "—"}</td><td>{a.status}</td><td>{a.notes || "—"}</td></tr>
              ))}
            </tbody>
          </table>

          <p style={{ fontSize: 12, fontWeight: 700, marginBottom: 6 }}>Admin notes</p>
          <p style={{ fontSize: 9, color: "#94a3b8", marginBottom: 6 }}>Administrative scheduling notes only — no clinical diagnosis data.</p>
          <table className="print-table">
            <thead><tr><th>Date</th><th>Note</th></tr></thead>
            <tbody>
              {record.notes.length === 0 && <tr><td colSpan={2}>No notes on file</td></tr>}
              {record.notes.map((n) => <tr key={n.id}><td>{new Date(n.createdAt).toLocaleDateString("en-AU")}</td><td>{n.body}</td></tr>)}
            </tbody>
          </table>
          <PrintFooter />
        </div>
      )}
    </>
  );
}

interface TimelineItem {
  type: "call" | "appointment" | "note";
  at: string;
  data: any;
}

interface ContactDetail {
  contact: {
    id: string; name: string | null; phone: string; email: string | null; tags: string[];
    dob: string | null; address: string | null; emergencyContactName: string | null; emergencyContactPhone: string | null;
    medicareNumber: string | null; medicareRefNumber: number | null;
    privateHealthFund: string | null; privateHealthMemberNumber: string | null;
    dvaNumber: string | null; concessionCardNumber: string | null; isVip: boolean; isAtRisk?: boolean;
  };
  timeline: TimelineItem[];
  flags: { visit: "new" | "returning" | "regular"; isClaimant: boolean; isVip: boolean; isAtRisk?: boolean };
}

export default function ContactDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { business, role } = useDashboard();
  const { data, isLoading, mutate } = useApi<{ ok: boolean } & ContactDetail>(`/api/business/contacts/${id}/timeline`);
  const ops = getVerticalOps(business.vertical);
  const isClinicVertical = !!ops;
  const [noteBody, setNoteBody] = useState("");
  const [savingNote, setSavingNote] = useState(false);
  const [mergeOpen, setMergeOpen] = useState(false);
  const [duplicateId, setDuplicateId] = useState("");

  useEffect(() => {
    if (id) posthog.capture("patient_file_opened", {});
  }, [id]);

  async function addNote() {
    if (!noteBody.trim()) return;
    setSavingNote(true);
    try {
      await apiPost(`/api/business/contacts/${id}/notes`, { body: noteBody });
      setNoteBody("");
      mutate();
    } catch {
      toast.error("Could not add note");
    } finally {
      setSavingNote(false);
    }
  }

  async function toggleTag(tag: string) {
    if (!data) return;
    const tags = data.contact.tags.includes(tag) ? data.contact.tags.filter((t) => t !== tag) : [...data.contact.tags, tag];
    try {
      await apiPost(`/api/business/contacts/${id}`, { tags }, "PATCH");
      mutate();
    } catch {
      toast.error("Could not update tags");
    }
  }

  async function mergeContacts() {
    if (!duplicateId.trim()) return;
    try {
      await apiPost("/api/business/contacts/merge", { primaryId: id, duplicateId });
      toast.success("Contacts merged");
      setMergeOpen(false);
      mutate();
    } catch {
      toast.error("Could not merge — check the contact ID");
    }
  }

  if (isLoading || !data) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  const { contact, timeline } = data;

  return (
    <div className="space-y-6">
      <Link href="/dashboard/contacts" className="no-print inline-flex items-center gap-1 text-sm text-slate-400 hover:text-slate-900">
        <ArrowLeft className="h-4 w-4" /> Back to contacts
      </Link>

      <div className="no-print flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">{contact.name || contact.phone}</h1>
          <p className="text-sm text-slate-400">{contact.phone}{contact.email ? ` · ${contact.email}` : ""}</p>
          {isClinicVertical && <div className="mt-2"><PatientFlagBadges flags={data.flags} vertical={business.vertical} /></div>}
        </div>
        <div className="flex items-center gap-2">
          {(role === "OWNER" || role === "ADMIN" || role === "DOCTOR") && <PatientRecordExportButton contactId={contact.id} businessName={business.name} vertical={business.vertical} />}
          <Button variant="outline" size="sm" onClick={() => setMergeOpen(true)}>
            <Merge className="h-4 w-4" /> Merge duplicate
          </Button>
        </div>
      </div>

      <div className="no-print flex flex-wrap items-center gap-2">
        <TagIcon className="h-4 w-4 text-slate-400" />
        {ALL_TAGS.map((tag) => (
          <button key={tag} onClick={() => toggleTag(tag)} className={contact.tags.includes(tag) ? "" : "opacity-30 hover:opacity-70"}>
            <TagBadge tag={tag} />
          </button>
        ))}
      </div>

      <div className="no-print grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Timeline</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {timeline.length === 0 && <p className="text-sm text-slate-400">No activity yet.</p>}
            {timeline.map((item, i) => (
              <div key={i} className="flex gap-3 border-b border-white/5 pb-4 last:border-0 last:pb-0">
                <div className="mt-0.5">
                  {item.type === "call" && <Phone className="h-4 w-4 text-cyan-400" />}
                  {item.type === "appointment" && <CalendarClock className="h-4 w-4 text-emerald-400" />}
                  {item.type === "note" && <StickyNote className="h-4 w-4 text-amber-400" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-700 capitalize">{item.type}</span>
                    <span className="text-xs text-slate-400">{new Date(item.at).toLocaleString()}</span>
                  </div>
                  {item.type === "call" && (
                    <div className="mt-1 flex items-center gap-2">
                      <StatusBadge status={item.data.status} />
                      <OutcomeBadge outcome={item.data.outcome} />
                    </div>
                  )}
                  {item.type === "appointment" && (
                    <div className="mt-1 flex items-center gap-2">
                      <StatusBadge status={item.data.status} />
                      <span className="text-xs text-slate-400">{item.data.recordType || "appointment"}</span>
                    </div>
                  )}
                  {item.type === "note" && <p className="mt-1 text-sm text-slate-500">{item.data.body}</p>}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Add note</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <Textarea value={noteBody} onChange={(e) => setNoteBody(e.target.value)} placeholder="Add an internal note about this contact…" />
            <Button className="w-full" size="sm" onClick={addNote} disabled={savingNote}>{savingNote ? "Saving…" : "Add note"}</Button>
          </CardContent>
        </Card>
      </div>

      {isClinicVertical && (
        <ClinicPatientPanel contactId={contact.id} clinic={contact} flags={data.flags} onRefresh={() => mutate()} />
      )}

      <Dialog open={mergeOpen} onOpenChange={setMergeOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Merge duplicate contact</DialogTitle></DialogHeader>
          <p className="mb-3 text-sm text-slate-400">Enter the ID of the duplicate contact to merge into this one. Its calls, bookings, and notes will move here, and the duplicate will be deleted.</p>
          <Input value={duplicateId} onChange={(e) => setDuplicateId(e.target.value)} placeholder="Duplicate contact ID" />
          <Button className="mt-3 w-full" onClick={mergeContacts}>Merge</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
