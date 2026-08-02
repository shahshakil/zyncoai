"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Download, Send, CheckCircle2, Ban, ArrowLeft } from "lucide-react";
import { useApi, apiPost } from "@/lib/useApi";
import { Card, CardHeader, CardTitle } from "@/components/dashboard/ui/card";
import { Button } from "@/components/dashboard/ui/button";
import { Table, Thead, Th, Tbody, Tr, Td } from "@/components/dashboard/ui/table";
import { Badge } from "@/components/dashboard/ui/badge";
import { Input, Label, Select } from "@/components/dashboard/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/dashboard/ui/dialog";
import { Topbar } from "@/components/platform-admin/Topbar";
import { formatCents } from "@/components/platform-admin/format";

interface InvoiceItem { id: string; description: string; quantity: number; unitPriceCents: number; amountCents: number }
interface ReminderLog { id: string; kind: string; sentAt: string; emailedTo: string | null }
interface InvoiceDetail {
  id: string; invoiceNumber: string; status: string; overdue: boolean;
  periodStart: string; periodEnd: string; planName: string;
  subscriptionFeeCents: number; callAllowance: number | null; callsUsed: number;
  overageCalls: number; overageFeeCents: number; twilioNumberFeeCents: number;
  totalCents: number; gstCents: number; exGstCents: number;
  issuedAt: string; dueDate: string; paidAt: string | null; paidAmountCents: number | null; paidReference: string | null;
  businessAbn: string | null; zyncoAbn: string | null;
  items: InvoiceItem[]; reminders: ReminderLog[];
  business: { id: string; name: string; phoneNumber: string; abn: string | null };
}

const REMINDER_LABELS: Record<string, string> = {
  UPCOMING_7D: "Upcoming (7 days out)", DUE_TODAY: "Due today",
  OVERDUE_3D: "Overdue (3 days)", OVERDUE_7D_WARNING: "Overdue warning (7 days)", OVERDUE_14D_SUSPENDED: "Final notice (14 days)",
};

export default function InvoiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { data, mutate } = useApi<{ ok: boolean; invoice: InvoiceDetail }>(`/api/admin/platform/invoices/${id}`);
  const [sending, setSending] = useState(false);
  const [voiding, setVoiding] = useState(false);
  const [paidOpen, setPaidOpen] = useState(false);

  const invoice = data?.invoice;

  async function resend() {
    setSending(true);
    try {
      await apiPost(`/api/admin/platform/invoices/${id}/send`);
      toast.success("Invoice re-sent");
    } catch {
      toast.error("Failed to send");
    } finally {
      setSending(false);
    }
  }

  async function voidInvoice() {
    if (!confirm("Void this invoice? It stays in history but is no longer payable or chased for reminders.")) return;
    setVoiding(true);
    try {
      await apiPost(`/api/admin/platform/invoices/${id}/void`, {}, "POST");
      toast.success("Invoice voided");
      mutate();
    } catch {
      toast.error("Failed to void invoice");
    } finally {
      setVoiding(false);
    }
  }

  return (
    <div className="-m-6">
      <Topbar title="Invoices" />
      <div className="space-y-6 p-6">
        <button onClick={() => router.push("/platform-admin/invoices")} className="inline-flex items-center gap-1 text-sm text-[#6B7280] hover:text-[#1F2937]">
          <ArrowLeft className="h-4 w-4" /> Back to invoices
        </button>

        {!invoice ? (
          <div className="animate-pulse rounded-2xl bg-slate-100" style={{ height: 400 }} />
        ) : (
          <>
            <Card>
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 p-5">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-semibold text-[#1F2937]">{invoice.invoiceNumber}</h2>
                    {invoice.status === "PAID" && <Badge tone="success">Paid</Badge>}
                    {invoice.status === "VOID" && <Badge tone="default">Void</Badge>}
                    {invoice.status === "ISSUED" && invoice.overdue && <Badge tone="danger">Overdue</Badge>}
                    {invoice.status === "ISSUED" && !invoice.overdue && <Badge tone="warning">Issued</Badge>}
                  </div>
                  <p className="mt-1 text-sm text-[#6B7280]">{invoice.business.name} · {invoice.planName} plan</p>
                  <p className="text-xs text-[#9CA3AF]">
                    {new Date(invoice.periodStart).toLocaleDateString("en-AU")} — {new Date(invoice.periodEnd).toLocaleDateString("en-AU")} ·
                    Issued {new Date(invoice.issuedAt).toLocaleDateString("en-AU")} · Due {new Date(invoice.dueDate).toLocaleDateString("en-AU")}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <a href={`/api/admin/platform/invoices/${id}/pdf`} target="_blank" rel="noreferrer">
                    <Button variant="outline" size="sm"><Download className="h-4 w-4" /> PDF</Button>
                  </a>
                  {invoice.status === "ISSUED" && (
                    <>
                      <Button variant="outline" size="sm" onClick={resend} disabled={sending}><Send className="h-4 w-4" /> Resend</Button>
                      <Button size="sm" onClick={() => setPaidOpen(true)}><CheckCircle2 className="h-4 w-4" /> Mark Paid</Button>
                      <Button variant="danger" size="sm" onClick={voidInvoice} disabled={voiding}><Ban className="h-4 w-4" /> Void</Button>
                    </>
                  )}
                </div>
              </div>

              <Table>
                <Thead><tr><Th>Description</Th><Th>Qty</Th><Th>Unit</Th><Th>Amount</Th></tr></Thead>
                <Tbody>
                  {invoice.items.map((it) => (
                    <Tr key={it.id}>
                      <Td>{it.description}</Td>
                      <Td>{it.quantity}</Td>
                      <Td>{formatCents(it.unitPriceCents)}</Td>
                      <Td>{formatCents(it.amountCents)}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>

              <div className="ml-auto max-w-xs space-y-1 p-5">
                <div className="flex justify-between text-sm text-[#6B7280]"><span>Subtotal (ex. GST)</span><span>{formatCents(invoice.exGstCents)}</span></div>
                <div className="flex justify-between text-sm text-[#6B7280]"><span>GST (10%)</span><span>{formatCents(invoice.gstCents)}</span></div>
                <div className="flex justify-between border-t border-slate-200 pt-2 text-base font-bold text-[#1F2937]"><span>Total</span><span>{formatCents(invoice.totalCents)}</span></div>
              </div>

              {invoice.status === "PAID" && (
                <div className="mx-5 mb-5 rounded-xl bg-[#ECFDF5] p-4 text-sm text-[#065F46]">
                  {formatCents(invoice.paidAmountCents || invoice.totalCents)} received {invoice.paidAt && new Date(invoice.paidAt).toLocaleDateString("en-AU")}
                  {invoice.paidReference && ` · Ref: ${invoice.paidReference}`}
                </div>
              )}
            </Card>

            {invoice.overageCalls > 0 && (
              <Card>
                <CardHeader><CardTitle>Usage this period</CardTitle></CardHeader>
                <div className="grid grid-cols-3 gap-4 p-5 text-sm">
                  <div><p className="text-xs text-[#9CA3AF]">Call allowance</p><p className="font-semibold text-[#1F2937]">{invoice.callAllowance ?? "Unlimited"}</p></div>
                  <div><p className="text-xs text-[#9CA3AF]">Calls used</p><p className="font-semibold text-[#1F2937]">{invoice.callsUsed}</p></div>
                  <div><p className="text-xs text-[#9CA3AF]">Overage calls</p><p className="font-semibold text-[#EF4444]">{invoice.overageCalls}</p></div>
                </div>
              </Card>
            )}

            {invoice.reminders.length > 0 && (
              <Card>
                <CardHeader><CardTitle>Reminders sent</CardTitle></CardHeader>
                <ul className="divide-y divide-slate-100">
                  {invoice.reminders.map((r) => (
                    <li key={r.id} className="flex items-center justify-between px-5 py-3 text-sm">
                      <span className="text-[#1F2937]">{REMINDER_LABELS[r.kind] || r.kind}</span>
                      <span className="text-xs text-[#9CA3AF]">{new Date(r.sentAt).toLocaleString("en-AU")}{r.emailedTo ? ` · ${r.emailedTo}` : ""}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            )}
          </>
        )}
      </div>

      {invoice && <MarkPaidDialog open={paidOpen} onClose={() => setPaidOpen(false)} invoice={invoice} onSaved={() => mutate()} />}
    </div>
  );
}

function MarkPaidDialog({ open, onClose, invoice, onSaved }: { open: boolean; onClose: () => void; invoice: InvoiceDetail; onSaved: () => void }) {
  const [amount, setAmount] = useState((invoice.totalCents / 100).toFixed(2));
  const [reference, setReference] = useState("");
  const [paidVia, setPaidVia] = useState("BANK_TRANSFER");
  const [paidAt, setPaidAt] = useState(new Date().toISOString().slice(0, 10));
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    try {
      await apiPost(`/api/admin/platform/invoices/${invoice.id}/paid`, {
        paidAmountCents: Math.round(parseFloat(amount || "0") * 100),
        paidReference: reference.trim() || undefined,
        paidVia,
        paidAt,
      }, "PUT");
      toast.success("Marked as paid");
      onSaved();
      onClose();
    } catch {
      toast.error("Failed to mark as paid");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent>
        <DialogHeader><DialogTitle>Mark {invoice.invoiceNumber} as Paid</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Payment method</Label>
            <Select value={paidVia} onChange={(e) => setPaidVia(e.target.value)}>
              <option value="BANK_TRANSFER">Bank Transfer</option>
              <option value="SQUARE">Card</option>
              <option value="PAYPAL">PayPal</option>
              <option value="BPAY">BPAY</option>
            </Select>
          </div>
          <div>
            <Label>Amount received ($)</Label>
            <Input type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} />
          </div>
          <div>
            <Label>Date received</Label>
            <Input type="date" value={paidAt} onChange={(e) => setPaidAt(e.target.value)} />
          </div>
          <div>
            <Label>Payment reference (optional)</Label>
            <Input value={reference} onChange={(e) => setReference(e.target.value)} placeholder="Bank transfer / BPAY / PayPal reference" />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={onClose}>Cancel</Button>
            <Button onClick={save} disabled={saving}>{saving ? "Saving…" : "Mark as Paid"}</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
