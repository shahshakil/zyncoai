"use client";
import { useState } from "react";
import Link from "next/link";
import { Search, Plus } from "lucide-react";
import { toast } from "sonner";
import { useApi, apiPost } from "@/lib/useApi";
import { useDashboard } from "@/components/dashboard/BusinessContext";
import { getVerticalTheme } from "@/components/dashboard/verticalTheme";
import { getVerticalOps } from "@/lib/verticalOps";
import { ExportMenu } from "@/components/dashboard/ExportMenu";
import { PrintLetterhead, PrintFooter } from "@/components/dashboard/PrintLetterhead";
import { slugFilename, type ExportSheet, type ExportColumn } from "@/lib/exportUtils";
import { Card } from "@/components/dashboard/ui/card";
import { Button } from "@/components/dashboard/ui/button";
import { Input, Select } from "@/components/dashboard/ui/input";
import { Table, Thead, Th, Tbody, Tr, Td, EmptyState } from "@/components/dashboard/ui/table";
import { SkeletonRow } from "@/components/dashboard/ui/skeleton";
import { TagBadge } from "@/components/dashboard/ui/badge";
import { Pagination } from "@/components/dashboard/ui/pagination";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/dashboard/ui/dialog";
import { Label } from "@/components/dashboard/ui/input";

const TAGS = ["vip", "new", "regular", "no-show", "flagged"];

function buildPatientColumns(contactLabel: string, providerLabel: string): ExportColumn[] {
  return [
    { key: "patientId", label: `${contactLabel} ID` },
    { key: "fullName", label: "Full Name" },
    { key: "phone", label: "Phone" },
    { key: "email", label: "Email" },
    { key: "firstVisit", label: "First Visit", format: (v) => (v ? new Date(v).toLocaleDateString("en-AU") : "—") },
    { key: "lastVisit", label: "Last Visit", format: (v) => (v ? new Date(v).toLocaleDateString("en-AU") : "—") },
    { key: "totalVisits", label: "Total Visits", align: "right", total: "sum" },
    { key: "assignedDoctor", label: `Assigned ${providerLabel}` },
    { key: "insuranceFund", label: "Insurance Fund" },
    { key: "status", label: "Status" },
  ];
}

interface PatientExportRow {
  patientId: string;
  fullName: string;
  phone: string;
  email: string;
  firstVisit: string | null;
  lastVisit: string | null;
  totalVisits: number;
  assignedDoctor: string;
  insuranceFund: string;
  status: string;
}

interface Contact {
  id: string;
  name: string | null;
  phone: string;
  email: string | null;
  tags: string[];
  createdAt: string;
  _count: { appointments: number; calls: number };
}

export default function ContactsPage() {
  const [q, setQ] = useState("");
  const [tag, setTag] = useState("");
  const [page, setPage] = useState(1);
  const [newOpen, setNewOpen] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "" });
  const [saving, setSaving] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [printRows, setPrintRows] = useState<PatientExportRow[]>([]);

  const { business } = useDashboard();
  const theme = getVerticalTheme(business.vertical);
  const ops = getVerticalOps(business.vertical);
  const contactLabel = ops?.contactLabel || "Patient";
  const PATIENT_COLUMNS = buildPatientColumns(contactLabel, ops?.providerLabel || "Doctor");

  const query = new URLSearchParams({ page: String(page), pageSize: "20", ...(q ? { q } : {}), ...(tag ? { tag } : {}) }).toString();
  const { data, isLoading, mutate } = useApi<{ data: Contact[]; pagination: { totalPages: number } }>(`/api/business/contacts?${query}`);

  function toggleSelected(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  async function loadPatientSheets(): Promise<ExportSheet[]> {
    const r = await fetch("/api/business/export/patients", { credentials: "include" });
    const json = await r.json();
    if (!json.ok) throw new Error("export_failed");
    let rows: PatientExportRow[] = json.rows;
    if (selected.size > 0) rows = rows.filter((row) => selected.has(row.patientId));
    return [{ name: `${contactLabel}s`, columns: PATIENT_COLUMNS, rows, showTotals: true }];
  }

  async function createContact(e: React.FormEvent) {
    e.preventDefault();
    if (!form.phone.trim()) return toast.error("Phone number is required");
    setSaving(true);
    try {
      await apiPost("/api/business/contacts", { name: form.name || undefined, phone: form.phone, email: form.email || undefined });
      toast.success("Contact added");
      setNewOpen(false);
      setForm({ name: "", phone: "", email: "" });
      mutate();
    } catch (err: any) {
      toast.error(err.status === 409 ? "A contact with this phone already exists" : "Could not add contact");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="no-print flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-lg font-semibold text-slate-900">{theme.stats.patients}</h1>
        <div className="flex items-center gap-2">
          {selected.size > 0 && <span className="text-xs text-slate-400">{selected.size} selected</span>}
          <ExportMenu
            section="patients"
            filename={slugFilename(business.name, "Patients")}
            meta={{ businessName: business.name, reportTitle: `${theme.stats.patients} List`, filtersLabel: [q && `search: ${q}`, tag && `tag: ${tag}`, selected.size > 0 && `${selected.size} selected`].filter(Boolean).join(", ") || undefined }}
            loadSheets={loadPatientSheets}
            onRowsReady={(sheets) => setPrintRows(sheets[0].rows as PatientExportRow[])}
          />
          <Button size="sm" onClick={() => setNewOpen(true)}><Plus className="h-4 w-4" /> Add contact</Button>
        </div>
      </div>

      <Card className="no-print">
        <div className="flex flex-wrap items-center gap-3 border-b border-slate-200 p-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input className="pl-9" placeholder="Search name, phone, email…" value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} />
          </div>
          <Select value={tag} onChange={(e) => { setTag(e.target.value); setPage(1); }} className="w-40">
            <option value="">All tags</option>
            {TAGS.map((t) => <option key={t} value={t}>{t}</option>)}
          </Select>
        </div>

        <Table>
          <Thead>
            <tr>
              <Th className="w-8">
                <input
                  type="checkbox"
                  checked={!!data?.data.length && data.data.every((c) => selected.has(c.id))}
                  onChange={(e) => {
                    setSelected((prev) => {
                      const next = new Set(prev);
                      data?.data.forEach((c) => (e.target.checked ? next.add(c.id) : next.delete(c.id)));
                      return next;
                    });
                  }}
                />
              </Th>
              <Th>Name</Th>
              <Th>Phone</Th>
              <Th>Email</Th>
              <Th>Tags</Th>
              <Th>Calls</Th>
              <Th>Bookings</Th>
            </tr>
          </Thead>
          <Tbody>
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} cols={7} />)
            ) : data?.data.length ? (
              data.data.map((c) => (
                <Tr key={c.id}>
                  <Td>
                    <input type="checkbox" checked={selected.has(c.id)} onChange={() => toggleSelected(c.id)} />
                  </Td>
                  <Td>
                    <Link href={`/dashboard/contacts/${c.id}`} className="font-medium text-slate-900 hover:text-[var(--accent,#4f46e5)]">
                      {c.name || "—"}
                    </Link>
                  </Td>
                  <Td>{c.phone}</Td>
                  <Td>{c.email || "—"}</Td>
                  <Td>
                    <div className="flex flex-wrap gap-1">
                      {c.tags.length ? c.tags.map((t) => <TagBadge key={t} tag={t} />) : <span className="text-slate-300">—</span>}
                    </div>
                  </Td>
                  <Td>{c._count.calls}</Td>
                  <Td>{c._count.appointments}</Td>
                </Tr>
              ))
            ) : null}
          </Tbody>
        </Table>
        {!isLoading && !data?.data.length && (
          <EmptyState title="No contacts yet" description="Contacts are created automatically from calls and bookings, or you can add one manually." action={<Button size="sm" onClick={() => setNewOpen(true)}>Add contact</Button>} />
        )}
        {data && <Pagination page={page} totalPages={data.pagination.totalPages} onPageChange={setPage} />}
      </Card>

      <Dialog open={newOpen} onOpenChange={setNewOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add contact</DialogTitle>
          </DialogHeader>
          <form onSubmit={createContact} className="space-y-3">
            <div>
              <Label>Name</Label>
              <Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
            </div>
            <div>
              <Label>Phone</Label>
              <Input value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} required />
            </div>
            <div>
              <Label>Email</Label>
              <Input type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
            </div>
            <Button type="submit" className="w-full" disabled={saving}>{saving ? "Saving…" : "Add contact"}</Button>
          </form>
        </DialogContent>
      </Dialog>

      <div className="print-only">
        <PrintLetterhead reportTitle={`${theme.stats.patients} List`} filtersLabel={[q && `search: ${q}`, tag && `tag: ${tag}`].filter(Boolean).join(", ") || undefined} />
        <table className="print-table">
          <thead>
            <tr>{PATIENT_COLUMNS.map((c) => <th key={c.key}>{c.label}</th>)}</tr>
          </thead>
          <tbody>
            {printRows.map((row) => (
              <tr key={row.patientId}>
                {PATIENT_COLUMNS.map((c) => (
                  <td key={c.key}>{c.format ? c.format((row as any)[c.key], row) : String((row as any)[c.key] ?? "")}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <PrintFooter />
      </div>
    </div>
  );
}
