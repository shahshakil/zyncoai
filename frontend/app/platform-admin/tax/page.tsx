"use client";
import { useState } from "react";
import { AlertTriangle, Download, FileArchive, Receipt, TrendingUp, TrendingDown, Scale, Printer } from "lucide-react";
import { useApi } from "@/lib/useApi";
import { Card, CardHeader, CardTitle } from "@/components/dashboard/ui/card";
import { Button } from "@/components/dashboard/ui/button";
import { Table, Thead, Th, Tbody, Tr, Td } from "@/components/dashboard/ui/table";
import { Select, Input } from "@/components/dashboard/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/dashboard/ui/tabs";
import { Topbar } from "@/components/platform-admin/Topbar";
import { StatCard } from "@/components/platform-admin/StatCard";
import { formatCents } from "@/components/platform-admin/format";
import { triggerPrint } from "@/lib/exportUtils";

const QUARTER_OPTIONS = [
  { value: 1, label: "Q1 — Jul to Sep" },
  { value: 2, label: "Q2 — Oct to Dec" },
  { value: 3, label: "Q3 — Jan to Mar" },
  { value: 4, label: "Q4 — Apr to Jun" },
];

interface BasResult {
  label: string; start: string; end: string;
  g1Cents: number; oneACents: number; g2Cents: number; oneBCents: number; netPayableCents: number; invoiceCount: number;
}
interface AnnualQuarter extends BasResult {}
interface AnnualSummary {
  finYearStart: number; finYearLabel: string;
  quarters: AnnualQuarter[];
  totalRevenueExGstCents: number; totalGstCollectedCents: number; totalGstPaidCents: number; totalGstPayableCents: number;
  totalDeductibleCostsCents: number; invoiceCount: number;
}

function Disclaimer() {
  return (
    <div className="flex items-start gap-2 rounded-xl border border-[#FDE68A] bg-[#FFFBEB] px-4 py-3 text-sm text-[#92400E]">
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
      This is a helper calculation only, not a lodgment document. Always consult your accountant or BAS agent before lodging with the ATO.
    </div>
  );
}

export default function TaxPage() {
  const now = new Date();
  const defaultFinYear = now.getMonth() >= 6 ? now.getFullYear() : now.getFullYear() - 1;

  const [basYear, setBasYear] = useState(defaultFinYear);
  const [quarter, setQuarter] = useState(1);
  const [annualYear, setAnnualYear] = useState(defaultFinYear);

  const { data: basData } = useApi<{ ok: boolean; bas: BasResult }>(`/api/admin/platform/tax/bas?finYearStart=${basYear}&quarter=${quarter}`);
  const { data: annualData } = useApi<{ ok: boolean; summary: AnnualSummary }>(`/api/admin/platform/tax/annual?finYearStart=${annualYear}`);

  const bas = basData?.bas;
  const summary = annualData?.summary;

  return (
    <div className="-m-6">
      <Topbar title="Tax & BAS" />
      <div className="space-y-6 p-6">
        <div className="no-print flex justify-end">
          <Button variant="outline" size="sm" onClick={() => triggerPrint("print")}><Printer className="h-4 w-4" /> Print</Button>
        </div>
        <Disclaimer />

        <Tabs defaultValue="bas">
          <TabsList>
            <TabsTrigger value="bas">BAS</TabsTrigger>
            <TabsTrigger value="annual">Annual Tax Pack</TabsTrigger>
          </TabsList>

          <TabsContent value="bas">
            <div className="space-y-6">
              <Card>
                <div className="flex flex-wrap items-end gap-3 p-4">
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-slate-500">Financial year starting</label>
                    <Input type="number" value={basYear} onChange={(e) => setBasYear(Number(e.target.value))} className="w-28" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-slate-500">Quarter</label>
                    <Select value={quarter} onChange={(e) => setQuarter(Number(e.target.value))} className="w-48">
                      {QUARTER_OPTIONS.map((q) => <option key={q.value} value={q.value}>{q.label}</option>)}
                    </Select>
                  </div>
                  <a href={`/api/admin/platform/tax/bas/export?finYearStart=${basYear}&quarter=${quarter}`} target="_blank" rel="noreferrer" className="ml-auto">
                    <Button variant="outline" size="sm"><Download className="h-4 w-4" /> Download PDF</Button>
                  </a>
                </div>
              </Card>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard label="G1 — Total Sales" value={formatCents(bas?.g1Cents || 0)} icon={Receipt} gradient="linear-gradient(135deg,#6366F1,#8B5CF6)" loading={!bas} sublabel={bas ? `${bas.invoiceCount} invoice${bas.invoiceCount === 1 ? "" : "s"} · ${bas.label}` : undefined} />
                <StatCard label="1A — GST Collected" value={formatCents(bas?.oneACents || 0)} icon={TrendingUp} gradient="linear-gradient(135deg,#10B981,#34D399)" loading={!bas} />
                <StatCard label="1B — GST Paid (est.)" value={formatCents(bas?.oneBCents || 0)} icon={TrendingDown} gradient="linear-gradient(135deg,#F59E0B,#FBBF24)" loading={!bas} />
                <StatCard
                  label="Net GST Payable" value={formatCents(bas?.netPayableCents || 0)} icon={Scale}
                  gradient={bas && bas.netPayableCents < 0 ? "linear-gradient(135deg,#10B981,#34D399)" : "linear-gradient(135deg,#EF4444,#F87171)"}
                  loading={!bas}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="annual">
            <div className="space-y-6">
              <Card>
                <div className="flex flex-wrap items-end gap-3 p-4">
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-slate-500">Financial year starting</label>
                    <Input type="number" value={annualYear} onChange={(e) => setAnnualYear(Number(e.target.value))} className="w-28" />
                  </div>
                  <p className="text-xs text-[#9CA3AF]">{summary?.finYearLabel}</p>
                  <div className="ml-auto flex gap-2">
                    <a href={`/api/admin/platform/tax/annual/export?finYearStart=${annualYear}`}>
                      <Button variant="outline" size="sm"><FileArchive className="h-4 w-4" /> Download Full Pack (ZIP)</Button>
                    </a>
                  </div>
                </div>
              </Card>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <StatCard label="Revenue (ex. GST)" value={formatCents(summary?.totalRevenueExGstCents || 0)} icon={TrendingUp} gradient="linear-gradient(135deg,#10B981,#34D399)" loading={!summary} />
                <StatCard label="Net GST Payable (Year)" value={formatCents(summary?.totalGstPayableCents || 0)} icon={Scale} gradient="linear-gradient(135deg,#6366F1,#8B5CF6)" loading={!summary} />
                <StatCard label="Total Deductible Costs" value={formatCents(summary?.totalDeductibleCostsCents || 0)} icon={TrendingDown} gradient="linear-gradient(135deg,#F59E0B,#FBBF24)" loading={!summary} />
              </div>

              <Card>
                <CardHeader><CardTitle>Quarterly Breakdown</CardTitle></CardHeader>
                <Table>
                  <Thead><tr><Th>Quarter</Th><Th>G1</Th><Th>1A</Th><Th>1B</Th><Th>Net Payable</Th><Th>Invoices</Th></tr></Thead>
                  <Tbody>
                    {summary?.quarters.map((q) => (
                      <Tr key={q.label}>
                        <Td className="font-medium text-[#1F2937]">{q.label}</Td>
                        <Td>{formatCents(q.g1Cents)}</Td>
                        <Td>{formatCents(q.oneACents)}</Td>
                        <Td>{formatCents(q.oneBCents)}</Td>
                        <Td>{formatCents(q.netPayableCents)}</Td>
                        <Td>{q.invoiceCount}</Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
