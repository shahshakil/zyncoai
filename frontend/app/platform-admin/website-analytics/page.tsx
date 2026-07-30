"use client";
import dynamic from "next/dynamic";
import { Users, Eye, PlayCircle, TrendingUp, Globe2, MapPin } from "lucide-react";
import { useApi } from "@/lib/useApi";
import { Card, CardHeader, CardTitle } from "@/components/dashboard/ui/card";
import { Table, Thead, Th, Tbody, Tr, Td, EmptyState } from "@/components/dashboard/ui/table";
import { Topbar } from "@/components/platform-admin/Topbar";
import { StatCard } from "@/components/platform-admin/StatCard";
import { formatNumber } from "@/components/platform-admin/format";

const ChartSkeleton = () => <div className="h-56 animate-pulse rounded-xl bg-slate-100" />;
const HorizontalBarChart = dynamic(() => import("@/components/platform-admin/charts").then((m) => ({ default: m.HorizontalBarChart })), { loading: ChartSkeleton, ssr: false });

interface WebsiteAnalyticsData {
  configured: boolean;
  visitorsToday: number; visitorsThisWeek: number; visitorsThisMonth: number;
  landingPageViews30d: number; demoPlays30d: number;
  mostVisitedPages: { path: string; views: number }[];
  trafficSources: { source: string; visits: number }[];
  countries: { country: string; visitors: number }[];
  newSignups30d: number; visitors30d: number; conversionRatePct: number | null;
  stale?: boolean;
}

const BAR_COLORS = ["#6366F1", "#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#F97316", "#14B8A6"];

export default function WebsiteAnalyticsPage() {
  const { data } = useApi<WebsiteAnalyticsData>("/api/admin/platform/website-analytics", { refreshInterval: 120000 });

  return (
    <div className="-m-6">
      <Topbar title="Website Analytics" />
      <div className="space-y-6 p-6">
        {data && !data.configured && (
          <div className="rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 text-sm text-[#6B7280]">
            PostHog personal API key / project ID isn&apos;t configured — this page has nothing to show until POSTHOG_PERSONAL_API_KEY and POSTHOG_PROJECT_ID are set.
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard label="Visitors Today" value={formatNumber(data?.visitorsToday || 0)} icon={Users} gradient="linear-gradient(135deg,#6366F1,#8B5CF6)" loading={!data} />
          <StatCard label="Visitors This Week" value={formatNumber(data?.visitorsThisWeek || 0)} icon={Users} gradient="linear-gradient(135deg,#3B82F6,#60A5FA)" loading={!data} />
          <StatCard label="Visitors This Month" value={formatNumber(data?.visitorsThisMonth || 0)} icon={Users} gradient="linear-gradient(135deg,#10B981,#34D399)" loading={!data} />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard label="Landing Page Views (30d)" value={formatNumber(data?.landingPageViews30d || 0)} icon={Eye} gradient="linear-gradient(135deg,#F59E0B,#FBBF24)" loading={!data} />
          <StatCard label="Demo Plays (30d)" value={formatNumber(data?.demoPlays30d || 0)} icon={PlayCircle} gradient="linear-gradient(135deg,#EF4444,#F87171)" loading={!data} />
          <StatCard
            label="Signup Conversion Rate" loading={!data}
            value={data?.conversionRatePct === null || data?.conversionRatePct === undefined ? "N/A" : `${data.conversionRatePct}%`}
            icon={TrendingUp} gradient="linear-gradient(135deg,#0EA5E9,#38BDF8)"
            sublabel={data ? `${formatNumber(data.newSignups30d)} signups / ${formatNumber(data.visitors30d)} visitors (30d)` : undefined}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Globe2 className="h-4 w-4 text-[#6366F1]" /> Traffic Sources (30d)</CardTitle></CardHeader>
            <div className="p-4">
              {data ? (
                data.trafficSources.length ? (
                  <HorizontalBarChart data={data.trafficSources.map((s) => ({ source: s.source, visits: s.visits }))} dataKey="visits" yKey="source" colors={BAR_COLORS} />
                ) : <EmptyState title="No traffic data yet" />
              ) : <ChartSkeleton />}
            </div>
          </Card>
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><MapPin className="h-4 w-4 text-[#6366F1]" /> Visitor Countries (30d)</CardTitle></CardHeader>
            <div className="p-4">
              {data ? (
                data.countries.length ? (
                  <HorizontalBarChart data={data.countries.map((c) => ({ country: c.country, visitors: c.visitors }))} dataKey="visitors" yKey="country" colors={BAR_COLORS} />
                ) : <EmptyState title="No country data yet" />
              ) : <ChartSkeleton />}
            </div>
          </Card>
        </div>

        <Card>
          <CardHeader><CardTitle>Most Visited Pages (30d)</CardTitle></CardHeader>
          <Table>
            <Thead><tr><Th>Page</Th><Th>Views</Th></tr></Thead>
            <Tbody>
              {data?.mostVisitedPages.map((p) => (
                <Tr key={p.path}>
                  <Td className="font-medium text-[#1F2937]">{p.path}</Td>
                  <Td>{formatNumber(p.views)}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
          {data && !data.mostVisitedPages.length && <EmptyState title="No page-view data yet" />}
        </Card>
      </div>
    </div>
  );
}
