"use client";
// Owner/Admin Financial Dashboard (Part 1) — MEDICAL/DENTAL only, OWNER/ADMIN
// only (backend 403s everyone else; the page itself is only linked from the
// sidebar for those roles, but we still gate the render in case of a direct
// link, matching the pattern elsewhere in this dashboard).
import { useState } from "react";
import { toast } from "sonner";
import { DollarSign, TrendingUp, Receipt, PiggyBank, Plus, Pencil, Download, Printer } from "lucide-react";
import { useApi, apiPost } from "@/lib/useApi";
import { useDashboard } from "@/components/dashboard/BusinessContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/dashboard/ui/card";
import { Button } from "@/components/dashboard/ui/button";
import { Input, Label, Select } from "@/components/dashboard/ui/input";
import { Table, Thead, Th, Tbody, Tr, Td, EmptyState } from "@/components/dashboard/ui/table";
import { Badge } from "@/components/dashboard/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/dashboard/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/dashboard/ui/dialog";
import { RevenueAreaChart, RevenueBarChart } from "@/components/dashboard/RevenueCharts";
import { exportToExcel, triggerPrint, type ExportColumn } from "@/lib/exportUtils";
import { getVerticalOps } from "@/lib/verticalOps";

function money(cents: number): string { return `$${(cents / 100).toLocaleString("en-AU", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`; }

interface Overview {
  revenue: {
    totalIncomeCents: number; medicareRebateCents: number; gapPaymentCents: number;
    byPayerType: { key: string; label: string; amountCents: number }[];
    byFund: { fund: string; amountCents: number }[];
    byDoctor: { doctor: string; amountCents: number; jobCount: number }[];
    byService: { service: string; amountCents: number }[];
    monthlyTrend: { month: string; amountCents: number }[];
    dailyTrend: { date: string; amountCents: number }[];
    partsCostCents: number; labourCostCents: number; grossMarginCents: number;
  };
  costs: {
    staffCostMonthlyCents: number; doctorCostMonthlyCents: number; operatingCostsMonthlyCents: number; zyncoAiSubscriptionCents: number;
    totalCostCents: number;
    staffCostRows: { name: string; role: string; payType: string; rateCents: number; monthlyEquivalentCents: number; annualLeaveBalanceHours: number; sickLeaveBalanceHours: number }[];
    operatingCosts: { id: string; label: string; amountCents: number; billingCycle: string; isActive: boolean }[];
  };
  netProfitCents: number;
}

function StatTile({ label, value, icon: Icon, tone = "default" }: { label: string; value: string; icon: any; tone?: "default" | "success" | "danger" }) {
  const toneClass = tone === "success" ? "text-emerald-600" : tone === "danger" ? "text-red-600" : "text-slate-900";
  return (
    <Card>
      <CardContent className="flex items-center gap-4">
        <div className="rounded-xl bg-[var(--accent-soft,#eff6ff)] p-3"><Icon className="h-5 w-5 text-[var(--accent,#2563eb)]" /></div>
        <div>
          <p className="text-xs text-slate-400">{label}</p>
          <p className={`text-xl font-semibold ${toneClass}`}>{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export default function FinancePage() {
  const { role, business } = useDashboard();
  const ops = getVerticalOps(business.vertical);
  const fl = ops?.financeLabels;
  const { data } = useApi<{ ok: boolean } & Overview>("/api/business/finance/overview");

  if (role !== "OWNER" && role !== "ADMIN") {
    return <EmptyState title="Not available" description="The Financial Dashboard is only visible to Owners and Admins." />;
  }
  if (!data || !fl) return <div className="animate-pulse space-y-4"><div className="h-24 rounded-xl bg-slate-100" /><div className="h-64 rounded-xl bg-slate-100" /></div>;

  function exportRevenueReport() {
    if (!data) return;
    exportToExcel(
      [
        { name: "By Payer Type", columns: [{ key: "label", label: "Payer", width: 26 }, { key: "amountCents", label: "Amount ($)", width: 14, align: "right", format: (v) => (v / 100).toFixed(2), total: "sum" }], rows: data.revenue.byPayerType, showTotals: true },
        { name: "By Fund", columns: [{ key: "fund", label: "Fund", width: 20 }, { key: "amountCents", label: "Amount ($)", width: 14, align: "right", format: (v) => (v / 100).toFixed(2), total: "sum" }], rows: data.revenue.byFund, showTotals: true },
        { name: "By Doctor", columns: [{ key: "doctor", label: "Doctor", width: 22 }, { key: "amountCents", label: "Amount ($)", width: 14, align: "right", format: (v) => (v / 100).toFixed(2), total: "sum" }], rows: data.revenue.byDoctor, showTotals: true },
        { name: "By Service", columns: [{ key: "service", label: "Service", width: 22 }, { key: "amountCents", label: "Amount ($)", width: 14, align: "right", format: (v) => (v / 100).toFixed(2), total: "sum" }], rows: data.revenue.byService, showTotals: true },
      ],
      { businessName: "Clinic", reportTitle: "Revenue Report — This Month" },
      `Revenue-Report-${new Date().toISOString().slice(0, 10)}.xlsx`
    );
  }

  function exportCostReport() {
    if (!data) return;
    const columns: ExportColumn[] = [
      { key: "name", label: "Name", width: 22 }, { key: "role", label: "Role", width: 12 }, { key: "payType", label: "Pay type", width: 16 },
      { key: "rateCents", label: "Rate ($)", width: 12, align: "right", format: (v) => (v / 100).toFixed(2) },
      { key: "monthlyEquivalentCents", label: "Monthly est. ($)", width: 16, align: "right", format: (v) => (v / 100).toFixed(2), total: "sum" },
    ];
    exportToExcel(
      [{ name: "Staff & Doctor Costs", columns, rows: data.costs.staffCostRows, showTotals: true }],
      { businessName: "Clinic", reportTitle: "Cost & Salary Report" },
      `Cost-Report-${new Date().toISOString().slice(0, 10)}.xlsx`
    );
  }

  return (
    <div className="space-y-6">
      <div className="no-print flex items-center justify-between">
        <h1 className="text-xl font-semibold text-slate-900">Financial Dashboard</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={exportRevenueReport}><Download className="h-4 w-4" /> Revenue Report</Button>
          <Button variant="outline" size="sm" onClick={exportCostReport}><Download className="h-4 w-4" /> Cost Report</Button>
          <Button variant="outline" size="sm" onClick={() => triggerPrint("print")}><Printer className="h-4 w-4" /> Print</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile label="Revenue this month" value={money(data.revenue.totalIncomeCents)} icon={DollarSign} />
        {fl.rebateLabel && <StatTile label={fl.rebateLabel} value={money(data.revenue.medicareRebateCents)} icon={TrendingUp} />}
        {fl.gapLabel && <StatTile label={fl.gapLabel} value={money(data.revenue.gapPaymentCents)} icon={Receipt} />}
        {fl.partsLabourEnabled && <StatTile label="Parts cost" value={money(data.revenue.partsCostCents)} icon={Receipt} />}
        {fl.partsLabourEnabled && <StatTile label="Labour cost" value={money(data.revenue.labourCostCents)} icon={Receipt} />}
        <StatTile label="Net profit this month" value={money(data.netProfitCents)} icon={PiggyBank} tone={data.netProfitCents >= 0 ? "success" : "danger"} />
      </div>

      <Tabs defaultValue="revenue">
        <TabsList>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="costs">Costs</TabsTrigger>
          {role === "OWNER" && <TabsTrigger value="tax">Tax &amp; BAS</TabsTrigger>}
        </TabsList>

        <TabsContent value="revenue">
          <div className="space-y-6">
            <Card>
              <CardHeader><CardTitle>Monthly Revenue Trend — 12 Months</CardTitle></CardHeader>
              <CardContent><RevenueAreaChart data={data.revenue.monthlyTrend} /></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Daily Revenue — Last 30 Days</CardTitle></CardHeader>
              <CardContent><RevenueBarChart data={data.revenue.dailyTrend} /></CardContent>
            </Card>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {fl.byPayerEnabled && (
                <Card>
                  <CardHeader><CardTitle>{fl.byPayer}</CardTitle></CardHeader>
                  <Table>
                    <Thead><tr><Th>Type</Th><Th>Amount</Th></tr></Thead>
                    <Tbody>{data.revenue.byPayerType.map((p) => <Tr key={p.key}><Td>{p.label}</Td><Td>{money(p.amountCents)}</Td></Tr>)}</Tbody>
                  </Table>
                  {!data.revenue.byPayerType.length && <EmptyState title="No revenue recorded yet this month" />}
                </Card>
              )}
              {fl.byFundEnabled && (
                <Card>
                  <CardHeader><CardTitle>Private Health — by Fund</CardTitle></CardHeader>
                  <Table>
                    <Thead><tr><Th>Fund</Th><Th>Amount</Th></tr></Thead>
                    <Tbody>{data.revenue.byFund.map((f) => <Tr key={f.fund}><Td>{f.fund}</Td><Td>{money(f.amountCents)}</Td></Tr>)}</Tbody>
                  </Table>
                  {!data.revenue.byFund.length && <EmptyState title="No private health fund revenue this month" />}
                </Card>
              )}
              <Card>
                <CardHeader><CardTitle>{fl.byProvider}</CardTitle></CardHeader>
                <Table>
                  <Thead><tr><Th>{ops?.providerLabel || "Provider"}</Th><Th>Amount</Th><Th>{fl.productivity}</Th></tr></Thead>
                  <Tbody>{data.revenue.byDoctor.map((d) => <Tr key={d.doctor}><Td>{d.doctor}</Td><Td>{money(d.amountCents)}</Td><Td>{d.jobCount}</Td></Tr>)}</Tbody>
                </Table>
              </Card>
              <Card>
                <CardHeader><CardTitle>{fl.byService}</CardTitle></CardHeader>
                <Table>
                  <Thead><tr><Th>Type</Th><Th>Amount</Th></tr></Thead>
                  <Tbody>{data.revenue.byService.map((s) => <Tr key={s.service}><Td>{s.service}</Td><Td>{money(s.amountCents)}</Td></Tr>)}</Tbody>
                </Table>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="costs">
          <CostsTab costs={data.costs} providerLabel={ops?.providerLabel || "Doctor"} />
        </TabsContent>

        {role === "OWNER" && (
          <TabsContent value="tax">
            <TaxTab providerLabel={ops?.providerLabel || "Doctor"} />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}

function currentFinYearStart(): number {
  const now = new Date();
  return now.getMonth() >= 6 ? now.getFullYear() : now.getFullYear() - 1;
}

interface BasResult { label: string; g1Cents: number; oneACents: number; g2Cents: number; oneBCents: number; netPayableCents: number }
interface AnnualSummary {
  finYearLabel: string; quarters: BasResult[];
  revenueByType: { payerType: string; amountCents: number }[]; totalRevenueCents: number;
  expensesByCategory: { label: string; billingCycle: string; amountCents: number }[]; totalOperatingCostsCents: number;
  totalGrossPayCents: number; totalSuperCents: number;
  gstCollectedCents: number; gstPaidCents: number; netGstPayableCents: number; paygWithholdingCents: number | null;
  netProfitCents: number;
  payrollSummary: { name: string; role: string; payType: string; rateCents: number | null; totalGrossPayCents: number; totalSuperCents: number; totalHours: number }[];
}

function TaxTab({ providerLabel }: { providerLabel: string }) {
  const [finYearStart, setFinYearStart] = useState(currentFinYearStart());
  const [quarter, setQuarter] = useState(1);
  const { data: bas } = useApi<{ ok: boolean; bas: BasResult }>(`/api/business/tax/bas?finYearStart=${finYearStart}&quarter=${quarter}`);
  const { data: annual } = useApi<{ ok: boolean } & AnnualSummary>(`/api/business/tax/annual?finYearStart=${finYearStart}`);

  function exportPayroll() {
    if (!annual) return;
    const columns: ExportColumn[] = [
      { key: "name", label: "Name", width: 22 }, { key: "role", label: "Role", width: 12 }, { key: "payType", label: "Pay type", width: 16 },
      { key: "totalHours", label: "Hours (FY)", width: 12, align: "right" },
      { key: "totalGrossPayCents", label: "Gross pay ($)", width: 14, align: "right", format: (v) => (v / 100).toFixed(2), total: "sum" },
      { key: "totalSuperCents", label: "Superannuation ($)", width: 16, align: "right", format: (v) => (v / 100).toFixed(2), total: "sum" },
    ];
    exportToExcel([{ name: "Payroll Summary", columns, rows: annual.payrollSummary, showTotals: true }], { businessName: "Clinic", reportTitle: `Payroll & Super Summary — ${annual.finYearLabel}` }, `Payroll-Summary-${finYearStart}.xlsx`);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-xs text-sky-800">
        Helper only — figures here are computed from your recorded revenue, costs, and pay entries. Consult your accountant or BAS agent before lodging. PAYG withholding is not calculated (no tax-file-number/withholding-rate data is stored) — get that figure from your payroll software.
      </div>

      <Card>
        <div className="no-print flex flex-wrap items-end gap-3 border-b border-slate-100 p-4">
          <div><Label>Financial year starting</Label><Input type="number" value={finYearStart} onChange={(e) => setFinYearStart(Number(e.target.value))} className="w-28" /></div>
          <div>
            <Label>Quarter</Label>
            <Select value={quarter} onChange={(e) => setQuarter(Number(e.target.value))} className="w-40">
              <option value={1}>Jul–Sep</option><option value={2}>Oct–Dec</option><option value={3}>Jan–Mar</option><option value={4}>Apr–Jun</option>
            </Select>
          </div>
          <Button variant="outline" size="sm" className="ml-auto" onClick={() => triggerPrint("print")}><Printer className="h-4 w-4" /> Print BAS</Button>
        </div>
        {bas && (
          <div className="grid grid-cols-2 gap-4 p-5 sm:grid-cols-5">
            <div><p className="text-xs text-slate-400">G1 Total sales</p><p className="text-lg font-semibold">{money(bas.bas.g1Cents)}</p></div>
            <div><p className="text-xs text-slate-400">1A GST collected</p><p className="text-lg font-semibold">{money(bas.bas.oneACents)}</p></div>
            <div><p className="text-xs text-slate-400">1B GST paid</p><p className="text-lg font-semibold">{money(bas.bas.oneBCents)}</p></div>
            <div><p className="text-xs text-slate-400">Net GST payable</p><p className="text-lg font-semibold">{money(bas.bas.netPayableCents)}</p></div>
            <div><p className="text-xs text-slate-400">Period</p><p className="text-lg font-semibold">{bas.bas.label}</p></div>
          </div>
        )}
      </Card>

      {annual && (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatTile label="Total revenue (FY)" value={money(annual.totalRevenueCents)} icon={DollarSign} />
            <StatTile label="Total expenses (FY)" value={money(annual.totalOperatingCostsCents + annual.totalGrossPayCents)} icon={Receipt} />
            <StatTile label="Superannuation owed (FY)" value={money(annual.totalSuperCents)} icon={PiggyBank} />
            <StatTile label="Net profit (FY)" value={money(annual.netProfitCents)} icon={TrendingUp} tone={annual.netProfitCents >= 0 ? "success" : "danger"} />
          </div>

          <Card>
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <h3 className="text-sm font-semibold text-slate-900">Payroll &amp; Superannuation Summary — {annual.finYearLabel}</h3>
              <Button variant="outline" size="sm" onClick={exportPayroll}><Download className="h-4 w-4" /> Excel</Button>
            </div>
            <Table>
              <Thead><tr><Th>Name</Th><Th>Role</Th><Th>Pay type</Th><Th>Hours</Th><Th>Gross pay</Th><Th>Super (11.5%)</Th></tr></Thead>
              <Tbody>
                {annual.payrollSummary.map((p, i) => (
                  <Tr key={i}>
                    <Td className="font-medium text-slate-700">{p.name}</Td>
                    <Td><Badge tone={p.role === "DOCTOR" ? "info" : "default"}>{p.role === "DOCTOR" ? providerLabel : p.role}</Badge></Td>
                    <Td>{p.payType}</Td>
                    <Td>{p.totalHours || "—"}</Td>
                    <Td>{money(p.totalGrossPayCents)}</Td>
                    <Td>{money(p.totalSuperCents)}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
            {!annual.payrollSummary.length && <EmptyState title="No pay period entries recorded" description="Payroll entries are added manually (no time-clock exists) — see below." />}
          </Card>

          <Card>
            <CardHeader><CardTitle>BAS Quarters — {annual.finYearLabel}</CardTitle></CardHeader>
            <Table>
              <Thead><tr><Th>Quarter</Th><Th>G1</Th><Th>1A</Th><Th>1B</Th><Th>Net payable</Th></tr></Thead>
              <Tbody>
                {annual.quarters.map((q) => (
                  <Tr key={q.label}><Td>{q.label}</Td><Td>{money(q.g1Cents)}</Td><Td>{money(q.oneACents)}</Td><Td>{money(q.oneBCents)}</Td><Td>{money(q.netPayableCents)}</Td></Tr>
                ))}
              </Tbody>
            </Table>
          </Card>
        </>
      )}
    </div>
  );
}

function CostsTab({ costs, providerLabel }: { costs: Overview["costs"]; providerLabel: string }) {
  const { mutate } = useApi<{ ok: boolean } & Overview>("/api/business/finance/overview");
  const { data: staffData, mutate: mutateStaff } = useApi<{ ok: boolean; members: any[] }>("/api/business/finance/staff-pay");
  const [editingMember, setEditingMember] = useState<any | null>(null);
  const [costDialogOpen, setCostDialogOpen] = useState(false);
  const [editingCost, setEditingCost] = useState<any | null>(null);

  async function deactivateCost(id: string) {
    if (!confirm("Remove this operating cost from the monthly total?")) return;
    try {
      await apiPost(`/api/business/finance/operating-costs/${id}`, {}, "DELETE");
      toast.success("Removed");
      mutate();
    } catch {
      toast.error("Failed to remove");
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile label="Staff costs / mo" value={money(costs.staffCostMonthlyCents)} icon={Receipt} />
        <StatTile label={`${providerLabel} costs / mo`} value={money(costs.doctorCostMonthlyCents)} icon={Receipt} />
        <StatTile label="ZyncoAI subscription / mo" value={money(costs.zyncoAiSubscriptionCents)} icon={Receipt} />
        <StatTile label="Total costs / mo" value={money(costs.totalCostCents)} icon={PiggyBank} />
      </div>

      <Card>
        <CardHeader><CardTitle>Staff &amp; {providerLabel} Pay</CardTitle></CardHeader>
        <Table>
          <Thead><tr><Th>Name</Th><Th>Role</Th><Th>Pay type</Th><Th>Rate</Th><Th>Monthly est.</Th><Th>Leave (A/S hrs)</Th><Th></Th></tr></Thead>
          <Tbody>
            {staffData?.members.map((m) => (
              <Tr key={m.id}>
                <Td className="font-medium text-slate-700">{m.user.name || m.user.email}</Td>
                <Td><Badge tone={m.role === "DOCTOR" ? "info" : "default"}>{m.role === "DOCTOR" ? providerLabel : m.role}</Badge></Td>
                <Td>{m.staffPayProfile?.payType || "—"}</Td>
                <Td>{m.staffPayProfile ? (m.staffPayProfile.payType === "PERCENTAGE_OF_BILLINGS" ? `${(m.staffPayProfile.rateCents / 100).toFixed(1)}%` : money(m.staffPayProfile.rateCents)) : "—"}</Td>
                <Td>{costs.staffCostRows.find((r) => r.name === (m.user.name || m.user.email))?.monthlyEquivalentCents != null ? money(costs.staffCostRows.find((r) => r.name === (m.user.name || m.user.email))!.monthlyEquivalentCents) : "—"}</Td>
                <Td className="text-xs text-slate-400">{m.staffPayProfile ? `${m.staffPayProfile.annualLeaveBalanceHours}/${m.staffPayProfile.sickLeaveBalanceHours}` : "—"}</Td>
                <Td><button title="Edit pay" onClick={() => setEditingMember(m)} className="text-slate-400 hover:text-slate-900"><Pencil className="h-4 w-4" /></button></Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Card>

      <Card>
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <h3 className="text-sm font-semibold text-slate-900">Operating Costs</h3>
          <Button size="sm" onClick={() => { setEditingCost(null); setCostDialogOpen(true); }}><Plus className="h-4 w-4" /> Add cost</Button>
        </div>
        <Table>
          <Thead><tr><Th>Label</Th><Th>Amount</Th><Th>Cycle</Th><Th></Th></tr></Thead>
          <Tbody>
            {costs.operatingCosts.map((c) => (
              <Tr key={c.id}>
                <Td className="font-medium text-slate-700">{c.label}</Td>
                <Td>{money(c.amountCents)}</Td>
                <Td className="capitalize">{c.billingCycle.toLowerCase().replace("_", " ")}</Td>
                <Td>
                  <div className="flex items-center gap-2">
                    <button title="Edit" onClick={() => { setEditingCost(c); setCostDialogOpen(true); }} className="text-slate-400 hover:text-slate-900"><Pencil className="h-4 w-4" /></button>
                    <button title="Remove" onClick={() => deactivateCost(c.id)} className="text-slate-400 hover:text-red-600">×</button>
                  </div>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
        {!costs.operatingCosts.length && <EmptyState title="No operating costs recorded" description="Add software/tools costs or other misc expenses." />}
      </Card>

      <StaffPayDialog member={editingMember} onClose={() => setEditingMember(null)} onSaved={() => { mutateStaff(); mutate(); }} />
      <OperatingCostDialog open={costDialogOpen} editing={editingCost} onClose={() => setCostDialogOpen(false)} onSaved={() => mutate()} />
    </div>
  );
}

function StaffPayDialog({ member, onClose, onSaved }: { member: any | null; onClose: () => void; onSaved: () => void }) {
  const [payType, setPayType] = useState(member?.staffPayProfile?.payType || "HOURLY");
  const [rate, setRate] = useState(member?.staffPayProfile ? (member.staffPayProfile.payType === "PERCENTAGE_OF_BILLINGS" ? (member.staffPayProfile.rateCents / 100).toString() : (member.staffPayProfile.rateCents / 100).toString()) : "");
  const [annualLeave, setAnnualLeave] = useState(member?.staffPayProfile?.annualLeaveBalanceHours?.toString() || "0");
  const [sickLeave, setSickLeave] = useState(member?.staffPayProfile?.sickLeaveBalanceHours?.toString() || "0");
  const [saving, setSaving] = useState(false);

  async function save() {
    if (!member) return;
    const rateNum = parseFloat(rate || "0");
    if (!rateNum || rateNum <= 0) { toast.error("Enter a rate"); return; }
    setSaving(true);
    try {
      await apiPost(`/api/business/finance/staff-pay/${member.id}`, {
        payType, rateCents: Math.round(rateNum * 100),
        annualLeaveBalanceHours: parseFloat(annualLeave || "0"), sickLeaveBalanceHours: parseFloat(sickLeave || "0"),
      }, "PUT");
      toast.success("Pay details saved");
      onSaved();
      onClose();
    } catch {
      toast.error("Could not save");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={!!member} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent>
        <DialogHeader><DialogTitle>{member?.user?.name || member?.user?.email} — Pay details</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Pay type</Label>
            <Select value={payType} onChange={(e) => setPayType(e.target.value)}>
              <option value="HOURLY">Hourly rate</option>
              <option value="SALARY">Annual salary</option>
              <option value="PERCENTAGE_OF_BILLINGS">Percentage of billings (doctors)</option>
            </Select>
          </div>
          <div>
            <Label>{payType === "PERCENTAGE_OF_BILLINGS" ? "Percentage (%)" : payType === "SALARY" ? "Annual salary ($)" : "Hourly rate ($)"}</Label>
            <Input type="number" min="0" step="0.01" value={rate} onChange={(e) => setRate(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><Label>Annual leave balance (hrs)</Label><Input type="number" step="0.5" value={annualLeave} onChange={(e) => setAnnualLeave(e.target.value)} /></div>
            <div><Label>Sick leave balance (hrs)</Label><Input type="number" step="0.5" value={sickLeave} onChange={(e) => setSickLeave(e.target.value)} /></div>
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

function OperatingCostDialog({ open, editing, onClose, onSaved }: { open: boolean; editing: any | null; onClose: () => void; onSaved: () => void }) {
  const [label, setLabel] = useState(editing?.label || "");
  const [amount, setAmount] = useState(editing ? (editing.amountCents / 100).toFixed(2) : "");
  const [billingCycle, setBillingCycle] = useState(editing?.billingCycle || "MONTHLY");
  const [saving, setSaving] = useState(false);

  async function save() {
    const amountCents = Math.round(parseFloat(amount || "0") * 100);
    if (!label.trim() || !amountCents) { toast.error("Label and amount are required"); return; }
    setSaving(true);
    try {
      if (editing) await apiPost(`/api/business/finance/operating-costs/${editing.id}`, { label: label.trim(), amountCents, billingCycle }, "PUT");
      else await apiPost("/api/business/finance/operating-costs", { label: label.trim(), amountCents, billingCycle }, "POST");
      toast.success(editing ? "Cost updated" : "Cost added");
      onSaved();
      onClose();
    } catch {
      toast.error("Could not save");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent>
        <DialogHeader><DialogTitle>{editing ? "Edit" : "Add"} operating cost</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div><Label>Label</Label><Input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="e.g. Practice management software" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><Label>Amount ($)</Label><Input type="number" min="0" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} /></div>
            <div>
              <Label>Billing cycle</Label>
              <Select value={billingCycle} onChange={(e) => setBillingCycle(e.target.value)}>
                <option value="MONTHLY">Monthly</option>
                <option value="ANNUAL">Annual</option>
                <option value="ONE_OFF">One-off</option>
              </Select>
            </div>
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
