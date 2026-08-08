"use client";
import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Plus, FileText, FileArchive, Download, Printer, Users } from "lucide-react";
import { useApi, apiPost } from "@/lib/useApi";
import { Card } from "@/components/dashboard/ui/card";
import { Button } from "@/components/dashboard/ui/button";
import { Table, Thead, Th, Tbody, Tr, Td, EmptyState } from "@/components/dashboard/ui/table";
import { Badge } from "@/components/dashboard/ui/badge";
import { Select, Input, Label } from "@/components/dashboard/ui/input";
import { Pagination } from "@/components/dashboard/ui/pagination";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/dashboard/ui/dialog";
import { Topbar } from "@/components/platform-admin/Topbar";
import { formatCents } from "@/components/platform-admin/format";
import { exportToExcel, triggerPrint } from "@/lib/exportUtils";

interface InvoiceRow {
  id: string; invoiceNumber: string; status: string; overdue: boolean;
  totalCents: number; issuedAt: string; dueDate: string;
  periodStart: string; periodEnd: string;
  business: { id: string; name: string };
}
interface InvoiceListResponse { ok: boolean; data: InvoiceRow[]; pagination: { page: number; totalPages: number; total: number } }
interface BusinessOption { id: string; name: string }

function statusBadge(row: InvoiceRow) {
  if (row.status === "PAID") return <Badge tone="success">Paid</Badge>;
  if (row.status === "VOID") return <Badge tone="default">Void</Badge>;
  if (row.overdue) return <Badge tone="danger">Overdue</Badge>;
  return <Badge tone="warning">Issued</Badge>;
}

export default function InvoicesPage() {
  const [status, setStatus] = useState("");
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [generateOpen, setGenerateOpen] = useState(false);

  const qs = new URLSearchParams({ page: String(page), pageSize: "20", ...(status ? { status } : {}), ...(q ? { q } : {}) }).toString();
  const { data, mutate } = useApi<InvoiceListResponse>(`/api/admin/platform/invoices?${qs}`);
  const [exporting, setExporting] = useState<"revenue" | "client" | null>(null);

  async function fetchExportData(): Promise<InvoiceRow[]> {
    const filterQs = new URLSearchParams({ ...(status ? { status } : {}), ...(q ? { q } : {}) }).toString();
    const r = await fetch(`/api/admin/platform/invoices/export-data?${filterQs}`, { credentials: "include" });
    const json = await r.json();
    if (!json.ok) throw new Error("export_failed");
    return json.data;
  }

  async function exportRevenueReport() {
    setExporting("revenue");
    try {
      const invoices = await fetchExportData();
      exportToExcel(
        [{
          name: "Revenue Report",
          columns: [
            { key: "invoiceNumber", label: "Invoice #", width: 14 },
            { key: "businessName", label: "Business", width: 26 },
            { key: "period", label: "Period", width: 16 },
            { key: "totalCents", label: "Total ($)", width: 12, align: "right", format: (v) => (v / 100).toFixed(2), total: "sum" },
            { key: "gstCents", label: "GST ($)", width: 10, align: "right", format: (v) => (v / 100).toFixed(2), total: "sum" },
            { key: "status", label: "Status", width: 12 },
            { key: "issuedAt", label: "Issued", width: 14, format: (v) => new Date(v).toLocaleDateString("en-AU") },
            { key: "dueDate", label: "Due", width: 14, format: (v) => new Date(v).toLocaleDateString("en-AU") },
            { key: "paidAt", label: "Paid", width: 14, format: (v) => (v ? new Date(v).toLocaleDateString("en-AU") : "—") },
          ],
          rows: invoices.map((inv: any) => ({
            invoiceNumber: inv.invoiceNumber, businessName: inv.business.name,
            period: new Date(inv.periodStart).toLocaleDateString("en-AU", { month: "short", year: "numeric" }),
            totalCents: inv.totalCents, gstCents: inv.gstCents,
            status: inv.status === "ISSUED" && inv.overdue ? "OVERDUE" : inv.status,
            issuedAt: inv.issuedAt, dueDate: inv.dueDate, paidAt: inv.paidAt,
          })),
          showTotals: true,
        }],
        { businessName: "ZyncoAI Platform", reportTitle: "Revenue Report — All Invoices & Payments", dateRangeLabel: `Generated ${new Date().toLocaleString("en-AU")}` },
        `ZyncoAI-Revenue-Report-${new Date().toISOString().slice(0, 10)}.xlsx`
      );
    } catch {
      toast.error("Failed to build revenue report");
    } finally {
      setExporting(null);
    }
  }

  async function exportClientReport() {
    setExporting("client");
    try {
      const invoices = await fetchExportData();
      const byBusiness = new Map<string, { name: string; plan: string; invoiceCount: number; totalInvoicedCents: number; totalPaidCents: number; outstandingCents: number }>();
      for (const inv of invoices as any[]) {
        const key = inv.business.id;
        const row = byBusiness.get(key) || { name: inv.business.name, plan: inv.business.manualPlan || "—", invoiceCount: 0, totalInvoicedCents: 0, totalPaidCents: 0, outstandingCents: 0 };
        row.invoiceCount += 1;
        row.totalInvoicedCents += inv.totalCents;
        if (inv.status === "PAID") row.totalPaidCents += inv.paidAmountCents ?? inv.totalCents;
        else if (inv.status === "ISSUED") row.outstandingCents += inv.totalCents;
        byBusiness.set(key, row);
      }
      exportToExcel(
        [{
          name: "Client Report",
          columns: [
            { key: "name", label: "Business", width: 26 },
            { key: "plan", label: "Plan", width: 14 },
            { key: "invoiceCount", label: "Invoices", width: 10, align: "right", total: "sum" },
            { key: "totalInvoicedCents", label: "Total Invoiced ($)", width: 16, align: "right", format: (v) => (v / 100).toFixed(2), total: "sum" },
            { key: "totalPaidCents", label: "Total Paid ($)", width: 14, align: "right", format: (v) => (v / 100).toFixed(2), total: "sum" },
            { key: "outstandingCents", label: "Outstanding ($)", width: 16, align: "right", format: (v) => (v / 100).toFixed(2), total: "sum" },
          ],
          rows: Array.from(byBusiness.values()),
          showTotals: true,
        }],
        { businessName: "ZyncoAI Platform", reportTitle: "Client Report — Per-Client Billing Summary", dateRangeLabel: `Generated ${new Date().toLocaleString("en-AU")}` },
        `ZyncoAI-Client-Report-${new Date().toISOString().slice(0, 10)}.xlsx`
      );
    } catch {
      toast.error("Failed to build client report");
    } finally {
      setExporting(null);
    }
  }

  return (
    <div className="-m-6">
      <Topbar title="Invoices" />
      <div className="space-y-6 p-6">
        <Card>
          <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 p-4">
            <Select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} className="w-40">
              <option value="">All statuses</option>
              <option value="ISSUED">Issued</option>
              <option value="OVERDUE">Overdue</option>
              <option value="AWAITING_TRANSFER">Awaiting bank transfer</option>
              <option value="PAID">Paid</option>
              <option value="VOID">Void</option>
            </Select>
            <Input value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} placeholder="Search invoice # or business…" className="w-64" />
            <div className="no-print ml-auto flex flex-wrap items-center gap-2">
              <Button variant="outline" size="sm" onClick={exportRevenueReport} disabled={exporting === "revenue"}>
                <Download className="h-4 w-4" /> {exporting === "revenue" ? "Building…" : "Revenue Report"}
              </Button>
              <Button variant="outline" size="sm" onClick={exportClientReport} disabled={exporting === "client"}>
                <Users className="h-4 w-4" /> {exporting === "client" ? "Building…" : "Client Report"}
              </Button>
              <a href={`/api/admin/platform/invoices/export-zip?${new URLSearchParams({ ...(status ? { status } : {}), ...(q ? { q } : {}) }).toString()}`}>
                <Button variant="outline" size="sm"><FileArchive className="h-4 w-4" /> Download All (ZIP)</Button>
              </a>
              <Button variant="outline" size="sm" onClick={() => triggerPrint("print")}><Printer className="h-4 w-4" /> Print</Button>
              <Button size="sm" onClick={() => setGenerateOpen(true)}>
                <Plus className="h-4 w-4" /> Generate Invoice
              </Button>
            </div>
          </div>

          <Table>
            <Thead>
              <tr><Th>Invoice #</Th><Th>Business</Th><Th>Period</Th><Th>Total</Th><Th>Status</Th><Th>Due</Th><Th></Th></tr>
            </Thead>
            <Tbody>
              {data?.data.map((inv) => (
                <Tr key={inv.id}>
                  <Td className="font-medium text-[#1F2937]">{inv.invoiceNumber}</Td>
                  <Td>{inv.business.name}</Td>
                  <Td className="text-xs text-[#6B7280]">{new Date(inv.periodStart).toLocaleDateString("en-AU", { month: "short", year: "numeric" })}</Td>
                  <Td>{formatCents(inv.totalCents)}</Td>
                  <Td>{statusBadge(inv)}</Td>
                  <Td className="text-xs text-[#6B7280]">{new Date(inv.dueDate).toLocaleDateString("en-AU")}</Td>
                  <Td>
                    <Link href={`/platform-admin/invoices/${inv.id}`} className="inline-flex items-center gap-1 text-xs font-medium text-[#6366F1] hover:underline">
                      <FileText className="h-3.5 w-3.5" /> View
                    </Link>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
          {data && !data.data.length && <EmptyState title="No invoices yet" description="Invoices generate automatically on the 1st of each month, or trigger one manually above." />}
          {data && <Pagination page={data.pagination.page} totalPages={data.pagination.totalPages} onPageChange={setPage} />}
        </Card>
      </div>

      <GenerateInvoiceDialog open={generateOpen} onClose={() => setGenerateOpen(false)} onGenerated={() => mutate()} />
    </div>
  );
}

function GenerateInvoiceDialog({ open, onClose, onGenerated }: { open: boolean; onClose: () => void; onGenerated: () => void }) {
  const { data: businessesData } = useApi<{ data: BusinessOption[] }>(open ? "/api/admin/platform/businesses?pageSize=50&status=ACTIVE" : null);
  const [businessId, setBusinessId] = useState("");
  const [generating, setGenerating] = useState(false);

  async function generate() {
    if (!businessId) {
      toast.error("Pick a business");
      return;
    }
    setGenerating(true);
    try {
      const res = await apiPost<{ ok: boolean; created: boolean; error?: string }>("/api/admin/platform/invoices/generate", { businessId }, "POST");
      if (res.created) toast.success("Invoice generated and emailed");
      else toast("Invoice already existed for this business's last period", { icon: "ℹ️" });
      onGenerated();
      onClose();
    } catch (e: any) {
      toast.error(e?.message === "no_plan_assigned" ? "This business has no plan assigned yet" : "Failed to generate invoice");
    } finally {
      setGenerating(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent>
        <DialogHeader><DialogTitle>Generate Invoice</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Business</Label>
            <Select value={businessId} onChange={(e) => setBusinessId(e.target.value)}>
              <option value="">Select a business…</option>
              {businessesData?.data.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
            </Select>
          </div>
          <p className="text-xs text-[#9CA3AF]">Generates an invoice for the previous full calendar month and emails it to the business owner. The business must have a plan assigned in its billing settings.</p>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={onClose}>Cancel</Button>
            <Button onClick={generate} disabled={generating}>{generating ? "Generating…" : "Generate & Send"}</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
