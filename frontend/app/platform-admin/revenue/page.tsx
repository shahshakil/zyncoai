"use client";
import dynamic from "next/dynamic";
import { DollarSign, TrendingDown, TrendingUp, Percent, Download, Repeat, Users, Info } from "lucide-react";
import { toast } from "sonner";
import { useApi, apiPost } from "@/lib/useApi";
import { Card, CardHeader, CardTitle } from "@/components/dashboard/ui/card";
import { Button } from "@/components/dashboard/ui/button";
import { Table, Thead, Th, Tbody, Tr, Td, EmptyState } from "@/components/dashboard/ui/table";
import { Badge } from "@/components/dashboard/ui/badge";
import { Select } from "@/components/dashboard/ui/input";
import { Topbar } from "@/components/platform-admin/Topbar";
import { StatCard } from "@/components/platform-admin/StatCard";
import { formatCents, VERTICAL_LABELS } from "@/components/platform-admin/format";
import { exportToExcel, type ExportColumn } from "@/lib/exportUtils";

const ChartSkeleton = () => <div className="h-56 animate-pulse rounded-xl bg-slate-100" />;
const GradientBarChart = dynamic(() => import("@/components/platform-admin/charts").then((m) => ({ default: m.GradientBarChart })), { loading: ChartSkeleton, ssr: false });
const HorizontalBarChart = dynamic(() => import("@/components/platform-admin/charts").then((m) => ({ default: m.HorizontalBarChart })), { loading: ChartSkeleton, ssr: false });
const CostPieChart = dynamic(() => import("@/components/platform-admin/charts").then((m) => ({ default: m.CostPieChart })), { loading: ChartSkeleton, ssr: false });

interface PricingPlan { key: string; name: string; priceCents: number }
interface RevenueData {
  mrrCents: number; arrCents: number; arpuCents: number; revenueGrowthPct: number | null;
  totalIncomeCents: number; totalIncomeLastMonthCents: number; totalCostCents: number; netProfitCents: number; profitMarginPct: number;
  revenueByPlan: { plan: string; amountCents: number }[];
  churnRevenueLostCents: number | null; netRevenueRetentionPct: number | null; notAvailableReason: string;
  costBreakdown: { openAiCostCents: number; twilioCostCents: number; serverCostCents: number; numberCostCents: number };
  costsAreEstimated: boolean;
  openAiCostNote: string;
  grossRevenueCents: number; totalDiscountsCents: number; netRevenueCents: number; avgDiscountPerClientCents: number;
  addOnRevenueCents: number;
  addOnBreakdown: { key: string; name: string; activeCount: number; revenueCents: number }[];
  mostPopularAddOns: { key: string; name: string; activeCount: number; revenueCents: number }[];
  referralPerformance: { pendingCount: number; approvedCount: number; rejectedCount: number; totalSignupsFromReferral: number; totalCreditsGivenCents: number };
  monthlyRevenue: { month: string; amountCents: number }[];
  byVertical: { vertical: string; amountCents: number }[];
  businesses: { id: string; name: string; vertical: string; plan: string; planPriceCents: number; planIsManual: boolean; manualPlanKey: string | null; revenueThisMonthCents: number; totalRevenueCents: number; numberCostCents: number }[];
  pricingPlans: PricingPlan[];
  stale?: boolean;
}

const COLUMNS: ExportColumn[] = [
  { key: "rank", label: "Rank", width: 8 },
  { key: "name", label: "Business", width: 26 },
  { key: "vertical", label: "Vertical", width: 14 },
  { key: "revenueThisMonth", label: "Revenue This Month", width: 18, align: "right" },
  { key: "totalRevenue", label: "Total Revenue", width: 16, align: "right" },
  { key: "plan", label: "Plan", width: 16 },
];

const VERTICAL_COLORS = ["#6366F1", "#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#F97316", "#14B8A6"];

export default function RevenuePage() {
  const { data, mutate } = useApi<RevenueData>("/api/admin/platform/revenue", { refreshInterval: 60000 });

  const hasAnyRevenue = data ? data.totalIncomeCents > 0 || data.businesses.some((b) => b.totalRevenueCents > 0) : true;

  async function assignPlan(businessId: string, planKey: string) {
    try {
      await apiPost(`/api/admin/platform/businesses/${businessId}/plan`, { planKey: planKey || null });
      toast.success("Plan updated");
      mutate();
    } catch {
      toast.error("Failed to update plan");
    }
  }

  function rows() {
    return (data?.businesses || []).map((b, i) => ({
      rank: i + 1, name: b.name, vertical: VERTICAL_LABELS[b.vertical] || b.vertical,
      revenueThisMonth: (b.revenueThisMonthCents / 100).toFixed(2), totalRevenue: (b.totalRevenueCents / 100).toFixed(2), plan: b.plan,
    }));
  }

  return (
    <div className="-m-6">
      <Topbar title="Revenue & Profit" />
      <div className="space-y-6 p-6">
        {!hasAnyRevenue && data && (
          <div className="rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 text-sm text-[#6B7280]">
            No billing plans are attached to any business yet, so revenue below is genuinely $0 — not a bug. Costs are still shown (estimated from real call volume) since they don&apos;t depend on billing being configured.
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="MRR" value={formatCents(data?.mrrCents || 0)} icon={Repeat} gradient="linear-gradient(135deg,#6366F1,#8B5CF6)" loading={!data} sublabel="Active businesses' current plan price" />
          <StatCard label="ARR" value={formatCents(data?.arrCents || 0)} icon={TrendingUp} gradient="linear-gradient(135deg,#0EA5E9,#38BDF8)" loading={!data} sublabel="MRR x 12" />
          <StatCard label="ARPU" value={formatCents(data?.arpuCents || 0)} icon={Users} gradient="linear-gradient(135deg,#10B981,#34D399)" loading={!data} sublabel="MRR / active paying businesses" />
          <StatCard
            label="Revenue Growth (MoM)"
            value={data?.revenueGrowthPct === null || data?.revenueGrowthPct === undefined ? "N/A" : `${data.revenueGrowthPct > 0 ? "+" : ""}${data.revenueGrowthPct}%`}
            icon={data && (data.revenueGrowthPct ?? 0) < 0 ? TrendingDown : TrendingUp}
            gradient={data && (data.revenueGrowthPct ?? 0) < 0 ? "linear-gradient(135deg,#EF4444,#F87171)" : "linear-gradient(135deg,#F59E0B,#FBBF24)"}
            loading={!data}
            sublabel={data ? `${formatCents(data.totalIncomeLastMonthCents)} last month` : undefined}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Platform Revenue (Month)" value={formatCents(data?.totalIncomeCents || 0)} icon={DollarSign} gradient="linear-gradient(135deg,#10B981,#34D399)" loading={!data} />
          <StatCard label="Total Costs This Month (estimated)" value={formatCents(data?.totalCostCents || 0)} icon={TrendingDown} gradient="linear-gradient(135deg,#EF4444,#F87171)" loading={!data} sublabel="OpenAI + Twilio, estimated" />
          <StatCard
            label="Net Profit" value={formatCents(data?.netProfitCents || 0)} icon={TrendingUp}
            gradient={data && data.netProfitCents < 0 ? "linear-gradient(135deg,#EF4444,#F87171)" : "linear-gradient(135deg,#6366F1,#8B5CF6)"}
            loading={!data}
          />
          <StatCard label="Profit Margin" value={`${data?.profitMarginPct ?? 0}%`} icon={Percent} gradient="linear-gradient(135deg,#F59E0B,#FBBF24)" loading={!data} />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Gross Revenue (Month)" value={formatCents(data?.grossRevenueCents || 0)} icon={DollarSign} gradient="linear-gradient(135deg,#10B981,#34D399)" loading={!data} sublabel="Before discounts" />
          <StatCard label="Discounts Given (Month)" value={formatCents(data?.totalDiscountsCents || 0)} icon={TrendingDown} gradient="linear-gradient(135deg,#F59E0B,#FBBF24)" loading={!data} />
          <StatCard label="Net Revenue (Month)" value={formatCents(data?.netRevenueCents || 0)} icon={TrendingUp} gradient="linear-gradient(135deg,#6366F1,#8B5CF6)" loading={!data} sublabel="After discounts — what's actually collected" />
          <StatCard label="Avg Discount / Discounted Client" value={formatCents(data?.avgDiscountPerClientCents || 0)} icon={Percent} gradient="linear-gradient(135deg,#EC4899,#F472B6)" loading={!data} />
        </div>

        {data && (
          <div className="flex items-start gap-2 rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 text-sm text-[#6B7280]">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#9CA3AF]" />
            <div>
              <p><span className="font-medium text-[#1F2937]">Churn revenue lost</span> and <span className="font-medium text-[#1F2937]">Net Revenue Retention</span> are not available: {data.notAvailableReason}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader><CardTitle>Add-on Revenue — {formatCents(data?.addOnRevenueCents || 0)}/mo</CardTitle></CardHeader>
            {!data || data.addOnBreakdown.length === 0 ? (
              <div className="p-4"><EmptyState title="No add-ons active yet" /></div>
            ) : (
              <Table>
                <Thead><Tr><Th>Add-on</Th><Th>Active</Th><Th>Revenue/mo</Th></Tr></Thead>
                <Tbody>
                  {data.mostPopularAddOns.map((a) => (
                    <Tr key={a.key}><Td>{a.name}</Td><Td>{a.activeCount}</Td><Td>{formatCents(a.revenueCents)}</Td></Tr>
                  ))}
                </Tbody>
              </Table>
            )}
          </Card>
          <Card>
            <CardHeader><CardTitle>Referral Program</CardTitle></CardHeader>
            <div className="grid grid-cols-2 gap-3 p-4">
              <StatCard label="Pending" value={String(data?.referralPerformance.pendingCount ?? 0)} icon={Users} gradient="linear-gradient(135deg,#F59E0B,#FBBF24)" loading={!data} />
              <StatCard label="Approved" value={String(data?.referralPerformance.approvedCount ?? 0)} icon={Users} gradient="linear-gradient(135deg,#10B981,#34D399)" loading={!data} />
              <StatCard label="Total Signups" value={String(data?.referralPerformance.totalSignupsFromReferral ?? 0)} icon={Users} gradient="linear-gradient(135deg,#6366F1,#8B5CF6)" loading={!data} />
              <StatCard label="Credits Given" value={formatCents(data?.referralPerformance.totalCreditsGivenCents || 0)} icon={DollarSign} gradient="linear-gradient(135deg,#EC4899,#F472B6)" loading={!data} />
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader><CardTitle>Monthly Revenue — Last 12 Months</CardTitle></CardHeader>
            <div className="p-4">
              {data ? <GradientBarChart data={data.monthlyRevenue.map((m) => ({ date: m.month, amount: m.amountCents / 100 }))} dataKey="amount" color="#10B981" /> : <Skel />}
            </div>
          </Card>
          <Card>
            <CardHeader><CardTitle>Revenue by Vertical</CardTitle></CardHeader>
            <div className="p-4">
              {data ? (
                <HorizontalBarChart
                  data={data.byVertical.map((v) => ({ vertical: VERTICAL_LABELS[v.vertical] || v.vertical, amount: v.amountCents / 100 }))}
                  dataKey="amount" yKey="vertical" colors={VERTICAL_COLORS}
                />
              ) : <Skel />}
            </div>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Cost Breakdown — This Month {data?.costsAreEstimated && <span className="ml-2 text-xs font-normal text-[#9CA3AF]">(estimated — no real OpenAI/Twilio invoice is ingested)</span>}</CardTitle>
            {data?.openAiCostNote && <p className="mt-0.5 text-xs text-[#9CA3AF]">{data.openAiCostNote}</p>}
          </CardHeader>
          <div className="p-4">
            {data ? (
              <CostPieChart data={[
                { key: "openai", label: "OpenAI (estimated)", cents: data.costBreakdown.openAiCostCents },
                { key: "twilio", label: "Twilio calls (estimated)", cents: data.costBreakdown.twilioCostCents },
                { key: "numbers", label: "Twilio numbers (real)", cents: data.costBreakdown.numberCostCents },
                { key: "server", label: "Server & other", cents: data.costBreakdown.serverCostCents },
              ]} />
            ) : <Skel height={180} />}
            {data && (
              <p className="mt-3 text-xs text-[#6B7280]">
                Twilio numbers: <a href="/platform-admin/phone-numbers" className="text-[#6366F1] hover:underline">{formatCents(data.costBreakdown.numberCostCents)}/mo</a> — real, not estimated ($1.50/mo per purchased number, see the Phone Numbers page).
              </p>
            )}
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pricing Plans</CardTitle>
            <p className="mt-0.5 text-xs text-[#9CA3AF]">Manual plan tiers — edit in Platform Settings. Businesses are assigned a plan manually until real Stripe billing exists.</p>
          </CardHeader>
          <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-3">
            {data?.pricingPlans.map((p) => {
              const revenueForPlan = data.revenueByPlan.find((r) => r.plan === p.name)?.amountCents || 0;
              return (
                <div key={p.key} className="rounded-xl border border-[#E5E7EB] p-4">
                  <p className="text-sm font-semibold text-[#1F2937]">{p.name}</p>
                  <p className="mt-1 text-2xl font-bold text-[#1F2937]">{formatCents(p.priceCents)}<span className="text-xs font-normal text-[#9CA3AF]">/mo</span></p>
                  <p className="mt-1 text-xs text-[#9CA3AF]">{data.businesses.filter((b) => b.manualPlanKey === p.key).length} businesses on this plan</p>
                  <p className="mt-0.5 text-xs font-medium text-[#10B981]">{formatCents(revenueForPlan)}/mo MRR from this plan</p>
                </div>
              );
            })}
            {!data && <Skel height={100} />}
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between border-b border-[#E5E7EB] p-4">
            <CardTitle>Business Revenue</CardTitle>
            <Button
              size="sm"
              onClick={() => exportToExcel(
                [{ name: "Revenue", columns: COLUMNS, rows: rows(), showTotals: true }],
                { businessName: "ZyncoAI Platform", reportTitle: "Revenue Report" },
                `ZyncoAI-Revenue-${new Date().toISOString().slice(0, 10)}.xlsx`
              )}
            >
              <Download className="h-4 w-4" /> Excel
            </Button>
          </div>
          <Table>
            <Thead>
              <tr><Th>Rank</Th><Th>Business</Th><Th>Vertical</Th><Th>Revenue (Month)</Th><Th>Total Revenue</Th><Th>Number Cost</Th><Th>Plan</Th></tr>
            </Thead>
            <Tbody>
              {data?.businesses.map((b, i) => (
                <Tr key={b.id}>
                  <Td>{i + 1}</Td>
                  <Td className="font-medium text-[#1F2937]">{b.name}</Td>
                  <Td><Badge tone="purple">{VERTICAL_LABELS[b.vertical] || b.vertical}</Badge></Td>
                  <Td>{formatCents(b.revenueThisMonthCents)}</Td>
                  <Td>{formatCents(b.totalRevenueCents)}</Td>
                  <Td className="text-xs text-[#6B7280]">{b.numberCostCents ? `${formatCents(b.numberCostCents)}/mo` : "—"}</Td>
                  <Td>
                    {b.plan === "No plan" || b.planIsManual ? (
                      <Select value={b.manualPlanKey || ""} onChange={(e) => assignPlan(b.id, e.target.value)} className="h-8 w-36 text-xs">
                        <option value="">No plan</option>
                        {data?.pricingPlans.map((p) => <option key={p.key} value={p.key}>{p.name}</option>)}
                      </Select>
                    ) : (
                      <Badge tone="success">{b.plan} (Stripe)</Badge>
                    )}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
          {data && !data.businesses.length && <EmptyState title="No businesses yet" />}
        </Card>
      </div>
    </div>
  );
}

function Skel({ height = 240 }: { height?: number }) {
  return <div className="animate-pulse rounded-lg bg-slate-100" style={{ height }} />;
}
