"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Wallet, Activity, CalendarDays, CalendarRange, Percent, PhoneCall, Plus, Pencil, Trash2, Download, Printer } from "lucide-react";
import { useApi, apiPost } from "@/lib/useApi";
import { Card, CardHeader, CardTitle } from "@/components/dashboard/ui/card";
import { Button } from "@/components/dashboard/ui/button";
import { Table, Thead, Th, Tbody, Tr, Td, EmptyState } from "@/components/dashboard/ui/table";
import { Badge } from "@/components/dashboard/ui/badge";
import { Input, Label, Select, Textarea } from "@/components/dashboard/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/dashboard/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/dashboard/ui/dialog";
import { Topbar } from "@/components/platform-admin/Topbar";
import { StatCard } from "@/components/platform-admin/StatCard";
import { BreakEvenCalculator } from "@/components/platform-admin/BreakEvenCalculator";
import { formatMicros, formatCents } from "@/components/platform-admin/format";
import { exportToExcel, triggerPrint, type ExportColumn } from "@/lib/exportUtils";

interface PricingPlan { key: string; name: string; priceCents: number }
interface CostsOverview {
  ok: boolean; stale?: boolean;
  today: { totalMicros: number; callMicros: number; smsMicros: number; emailMicros: number };
  week: { totalMicros: number };
  month: { totalMicros: number; callMicros: number; usageMicros: number; callCount: number };
  ytd: { totalMicros: number };
  costPerCallMicros: number; avgCostPerClientMicros: number;
  costPerClient: { businessId: string; name: string; costMicros: number }[];
  activeBusinessCount: number; payingBusinessCount: number; avgVariableCostPerPayingClientMicros: number;
  fixedCostsMonthlyCents: number; twilioNumberFeesMonthlyMicros: number;
  monthlyRecurringRevenueCents: number; monthlyRecurringCostCents: number; breakEvenGapCents: number;
  pricingPlans: PricingPlan[];
}

const CATEGORIES = [
  "DIGITALOCEAN", "CLOUDFLARE", "TWILIO_NUMBERS", "UPSTASH", "NEON", "RESEND", "ZOHO",
  "GCP", "OPENAI_OTHER", "DOMAIN", "VAPI", "ELEVENLABS", "MANUAL",
];
const CATEGORY_LABELS: Record<string, string> = {
  DIGITALOCEAN: "DigitalOcean", CLOUDFLARE: "Cloudflare", TWILIO_NUMBERS: "Twilio (account fee)",
  UPSTASH: "Upstash", NEON: "Neon (Postgres)", RESEND: "Resend", ZOHO: "Zoho", GCP: "GCP", OPENAI_OTHER: "OpenAI (non-metered, e.g. seat)",
  DOMAIN: "Domain", VAPI: "Vapi", ELEVENLABS: "ElevenLabs", MANUAL: "Manual / other",
};

interface FixedCostEntry {
  id: string; category: string; label: string; amountCents: number; billingCycle: string;
  gstApplicable: boolean; taxDeductible: boolean; isActive: boolean; isEstimate: boolean; notes: string | null;
}

const FIXED_COST_COLUMNS: ExportColumn[] = [
  { key: "category", label: "Category", width: 20 },
  { key: "label", label: "Label", width: 26 },
  { key: "amount", label: "Amount ($)", width: 14, align: "right" },
  { key: "cycle", label: "Billing Cycle", width: 14 },
  { key: "gst", label: "GST Applicable", width: 14 },
  { key: "deductible", label: "Tax Deductible", width: 14 },
  { key: "status", label: "Status", width: 12 },
];

export default function CostsPage() {
  const { data } = useApi<CostsOverview>("/api/admin/platform/costs", { refreshInterval: 20000 });
  const { data: fixedData, mutate: mutateFixed } = useApi<{ ok: boolean; data: FixedCostEntry[] }>("/api/admin/platform/costs/fixed?all=true");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<FixedCostEntry | null>(null);

  const fixed = fixedData?.data || [];
  // Break-Even Calculator answers "how many PAYING clients do we need" —
  // seeded from the paying-client population, not every active business
  // (which would mix free-riding complimentary/trial accounts into the
  // per-client average). Server computes both figures once
  // (admin/costs.ts) so this page never has two different "avg variable
  // cost/client" numbers on screen again.
  const avgRevenuePerClientCents = data && data.payingBusinessCount > 0 ? Math.round(data.monthlyRecurringRevenueCents / data.payingBusinessCount) : 0;
  const avgVariableCostPerClientMicros = data?.avgVariableCostPerPayingClientMicros || 0;

  function exportCostReport() {
    if (!data) return;
    const variableRows = [
      { category: "Calls (OpenAI + Twilio, this month)", amount: (data.month.callMicros / 1_000_000).toFixed(2), type: "Variable", note: `${data.month.callCount} calls` },
      { category: "SMS + Email (this month)", amount: (data.month.usageMicros / 1_000_000).toFixed(2), type: "Variable", note: "" },
      { category: "Phone number rental (all active businesses)", amount: (data.twilioNumberFeesMonthlyMicros / 1_000_000).toFixed(2), type: "Variable", note: `${data.activeBusinessCount} businesses` },
    ];
    const fixedRows = fixed.filter((f) => f.isActive).map((f) => ({
      category: `${CATEGORY_LABELS[f.category] || f.category} — ${f.label}`,
      amount: (f.amountCents / 100).toFixed(2),
      type: "Fixed", note: `${f.billingCycle.toLowerCase().replace("_", " ")}${f.taxDeductible ? ", deductible" : ""}`,
    }));
    exportToExcel(
      [{
        name: "Cost Report",
        columns: [
          { key: "category", label: "Category", width: 34 },
          { key: "type", label: "Type", width: 12 },
          { key: "amount", label: "Amount ($)", width: 14, align: "right" },
          { key: "note", label: "Notes", width: 24 },
        ],
        rows: [...fixedRows, ...variableRows],
        showTotals: false,
      }],
      { businessName: "ZyncoAI Platform", reportTitle: "Cost Report — All Costs Categorised", dateRangeLabel: `This month, generated ${new Date().toLocaleString("en-AU")}` },
      `ZyncoAI-Cost-Report-${new Date().toISOString().slice(0, 10)}.xlsx`
    );
  }

  async function deactivate(id: string) {
    if (!confirm("Deactivate this fixed cost entry? It stays in historical BAS/tax reports but stops counting toward the monthly baseline.")) return;
    try {
      await apiPost(`/api/admin/platform/costs/fixed/${id}`, {}, "DELETE");
      toast.success("Deactivated");
      mutateFixed();
    } catch {
      toast.error("Failed to deactivate");
    }
  }

  return (
    <div className="-m-6">
      <Topbar title="Cost Tracking" />
      <div className="space-y-6 p-6">
        <div className="no-print flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={exportCostReport}><Download className="h-4 w-4" /> Cost Report (Excel)</Button>
          <Button variant="outline" size="sm" onClick={() => triggerPrint("print")}><Printer className="h-4 w-4" /> Print</Button>
        </div>
        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="fixed">Fixed Costs</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="space-y-6">
              {data?.stale && (
                <div className="rounded-xl border border-[#FDE68A] bg-[#FFFBEB] px-4 py-3 text-sm text-[#92400E]">
                  Showing a slightly stale snapshot — live aggregates are momentarily unavailable, refreshing shortly.
                </div>
              )}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard label="Today" value={formatMicros(data?.today.totalMicros || 0)} icon={Activity} gradient="linear-gradient(135deg,#F97316,#FB923C)" loading={!data} sublabel="Live — updates within seconds" />
                <StatCard label="This Week" value={formatMicros(data?.week.totalMicros || 0)} icon={CalendarDays} gradient="linear-gradient(135deg,#6366F1,#8B5CF6)" loading={!data} />
                <StatCard label="This Month" value={formatMicros(data?.month.totalMicros || 0)} icon={CalendarRange} gradient="linear-gradient(135deg,#3B82F6,#60A5FA)" loading={!data} sublabel={data ? `${data.month.callCount} calls` : undefined} />
                <StatCard label="Year to Date" value={formatMicros(data?.ytd.totalMicros || 0)} icon={Wallet} gradient="linear-gradient(135deg,#10B981,#34D399)" loading={!data} />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard label="Avg Cost / Call" value={formatMicros(data?.costPerCallMicros || 0)} icon={PhoneCall} gradient="linear-gradient(135deg,#EF4444,#F87171)" loading={!data} />
                <StatCard
                  label="Avg Variable Cost / Client / mo" value={formatMicros(data?.avgCostPerClientMicros || 0)} icon={Percent}
                  gradient="linear-gradient(135deg,#F59E0B,#FBBF24)" loading={!data}
                  sublabel="Real AI/call/SMS/email cost + Twilio number rental, per active business"
                />
                <StatCard label="Fixed Costs / mo" value={formatCents(data?.fixedCostsMonthlyCents || 0)} icon={Wallet} gradient="linear-gradient(135deg,#8B5CF6,#A78BFA)" loading={!data} />
                <StatCard
                  label="Break-Even Gap / mo" value={formatCents(data?.breakEvenGapCents || 0)} icon={Wallet}
                  gradient={data && data.breakEvenGapCents < 0 ? "linear-gradient(135deg,#EF4444,#F87171)" : "linear-gradient(135deg,#10B981,#34D399)"}
                  loading={!data} sublabel="Recurring revenue minus recurring cost"
                />
              </div>

              <BreakEvenCalculator
                activeBusinessCount={data?.payingBusinessCount || 0}
                avgRevenuePerClientCents={avgRevenuePerClientCents}
                avgVariableCostPerClientMicros={avgVariableCostPerClientMicros}
                fixedCostsMonthlyCents={data?.fixedCostsMonthlyCents || 0}
                loading={!data}
              />
              <p className="-mt-3 text-xs text-[#9CA3AF]">
                Seeded from your {data?.payingBusinessCount ?? 0} paying client(s) — not the same population as &quot;Avg Variable Cost / Client / mo&quot; above, which spreads real cost across every active business, paying or not.
              </p>

              <Card>
                <CardHeader><CardTitle>Cost per Client — This Month</CardTitle></CardHeader>
                <Table>
                  <Thead><tr><Th>Business</Th><Th>Cost this month</Th></tr></Thead>
                  <Tbody>
                    {data?.costPerClient.map((c) => (
                      <Tr key={c.businessId}>
                        <Td className="font-medium text-[#1F2937]">{c.name}</Td>
                        <Td>{formatMicros(c.costMicros)}</Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
                {data && !data.costPerClient.length && <EmptyState title="No cost activity yet this month" description="Costs populate as real calls, SMS, and emails flow through the platform." />}
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="fixed">
            <Card>
              <div className="flex items-center justify-between border-b border-slate-100 p-4">
                <CardTitle>Fixed & Recurring Costs</CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant="outline" size="sm"
                    onClick={() => exportToExcel(
                      [{ name: "Fixed Costs", columns: FIXED_COST_COLUMNS, rows: fixed.map((f) => ({
                        category: CATEGORY_LABELS[f.category] || f.category, label: f.label, amount: (f.amountCents / 100).toFixed(2),
                        cycle: f.billingCycle, gst: f.gstApplicable ? "Yes" : "No", deductible: f.taxDeductible ? "Yes" : "No", status: f.isActive ? "Active" : "Inactive",
                      })), showTotals: false }],
                      { businessName: "ZyncoAI Platform", reportTitle: "Fixed Costs" },
                      `ZyncoAI-Fixed-Costs-${new Date().toISOString().slice(0, 10)}.xlsx`
                    )}
                  >
                    <Download className="h-4 w-4" /> Excel
                  </Button>
                  <Button size="sm" onClick={() => { setEditing(null); setDialogOpen(true); }}>
                    <Plus className="h-4 w-4" /> Add Cost
                  </Button>
                </div>
              </div>
              <p className="border-b border-slate-100 px-4 py-2 text-xs text-[#9CA3AF]">
                Twilio number rental is calculated automatically from active businesses — use &quot;Twilio (account fee)&quot; here only for flat account-level charges, not per-number rental, to avoid double-counting.
              </p>
              <Table>
                <Thead>
                  <tr><Th>Category</Th><Th>Label</Th><Th>Amount</Th><Th>Cycle</Th><Th>GST</Th><Th>Tax deductible</Th><Th>Status</Th><Th></Th></tr>
                </Thead>
                <Tbody>
                  {fixed.map((f) => (
                    <Tr key={f.id}>
                      <Td>{CATEGORY_LABELS[f.category] || f.category}</Td>
                      <Td className="font-medium text-[#1F2937]">{f.label}</Td>
                      <Td>{formatCents(f.amountCents)}</Td>
                      <Td className="capitalize">{f.billingCycle.toLowerCase().replace("_", " ")}</Td>
                      <Td>{f.gstApplicable ? <Badge tone="info">GST</Badge> : <Badge tone="default">No GST</Badge>}</Td>
                      <Td>{f.taxDeductible ? <Badge tone="success">Deductible</Badge> : <Badge tone="default">—</Badge>}</Td>
                      <Td>
                        <div className="flex flex-wrap items-center gap-1">
                          {f.isActive ? <Badge tone="success">Active</Badge> : <Badge tone="danger">Inactive</Badge>}
                          {f.isEstimate && <Badge tone="warning">Estimate</Badge>}
                        </div>
                      </Td>
                      <Td>
                        <div className="flex items-center gap-2">
                          <button title="Edit" onClick={() => { setEditing(f); setDialogOpen(true); }} className="text-[#9CA3AF] hover:text-[#1F2937]">
                            <Pencil className="h-4 w-4" />
                          </button>
                          {f.isActive && (
                            <button title="Deactivate" onClick={() => deactivate(f.id)} className="text-[#9CA3AF] hover:text-[#EF4444]">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
              {fixedData && !fixed.length && <EmptyState title="No fixed costs recorded yet" description="Add hosting, domain, and other recurring platform costs to track true monthly overhead." />}
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <FixedCostDialog open={dialogOpen} onClose={() => setDialogOpen(false)} editing={editing} onSaved={() => mutateFixed()} />
    </div>
  );
}

function FixedCostDialog({
  open, onClose, editing, onSaved,
}: { open: boolean; onClose: () => void; editing: FixedCostEntry | null; onSaved: () => void }) {
  const [category, setCategory] = useState(editing?.category || "MANUAL");
  const [label, setLabel] = useState(editing?.label || "");
  const [amount, setAmount] = useState(editing ? (editing.amountCents / 100).toFixed(2) : "");
  const [billingCycle, setBillingCycle] = useState(editing?.billingCycle || "MONTHLY");
  const [gstApplicable, setGstApplicable] = useState(editing?.gstApplicable || false);
  const [taxDeductible, setTaxDeductible] = useState(editing ? editing.taxDeductible : true);
  const [isEstimate, setIsEstimate] = useState(editing?.isEstimate || false);
  const [notes, setNotes] = useState(editing?.notes || "");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setCategory(editing?.category || "MANUAL");
    setLabel(editing?.label || "");
    setAmount(editing ? (editing.amountCents / 100).toFixed(2) : "");
    setBillingCycle(editing?.billingCycle || "MONTHLY");
    setGstApplicable(editing?.gstApplicable || false);
    setTaxDeductible(editing ? editing.taxDeductible : true);
    setIsEstimate(editing?.isEstimate || false);
    setNotes(editing?.notes || "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, editing]);

  async function save() {
    const amountCents = Math.round(parseFloat(amount || "0") * 100);
    if (!label.trim() || !Number.isFinite(amountCents) || amountCents <= 0) {
      toast.error("Label and a positive amount are required");
      return;
    }
    setSaving(true);
    try {
      const body = { category, label: label.trim(), amountCents, billingCycle, gstApplicable, taxDeductible, isEstimate, notes: notes.trim() || undefined };
      if (editing) {
        await apiPost(`/api/admin/platform/costs/fixed/${editing.id}`, body, "PUT");
      } else {
        await apiPost("/api/admin/platform/costs/fixed", body, "POST");
      }
      toast.success(editing ? "Cost updated" : "Cost added");
      onSaved();
      onClose();
    } catch {
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent>
        <DialogHeader><DialogTitle>{editing ? "Edit Fixed Cost" : "Add Fixed Cost"}</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Category</Label>
            <Select value={category} onChange={(e) => setCategory(e.target.value)}>
              {CATEGORIES.map((c) => <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>)}
            </Select>
          </div>
          <div>
            <Label>Label</Label>
            <Input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="e.g. DigitalOcean droplet" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Amount ($)</Label>
              <Input type="number" min="0" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} />
            </div>
            <div>
              <Label>Billing cycle</Label>
              <Select value={billingCycle} onChange={(e) => setBillingCycle(e.target.value)}>
                <option value="MONTHLY">Monthly</option>
                <option value="ANNUAL">Annual</option>
                <option value="ONE_OFF">One-off</option>
              </Select>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 text-sm text-[#374151]">
              <input type="checkbox" checked={gstApplicable} onChange={(e) => setGstApplicable(e.target.checked)} />
              GST applicable
            </label>
            <label className="flex items-center gap-2 text-sm text-[#374151]">
              <input type="checkbox" checked={taxDeductible} onChange={(e) => setTaxDeductible(e.target.checked)} />
              Tax deductible
            </label>
            <label className="flex items-center gap-2 text-sm text-[#374151]">
              <input type="checkbox" checked={isEstimate} onChange={(e) => setIsEstimate(e.target.checked)} />
              This is an estimate
            </label>
          </div>
          <div>
            <Label>Notes (optional)</Label>
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={onClose}>Cancel</Button>
            <Button onClick={save} disabled={saving}>{saving ? "Saving…" : "Save"}</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
