"use client";
// RESTAURANT-only phone-order analytics — separate endpoint/component from
// the shared Analytics overview above (which is call/booking-shaped and
// generic across every vertical), inserted into AnalyticsDashboard.tsx only
// when business.vertical === "RESTAURANT".
import { ShoppingBag, DollarSign, Receipt, Clock, Flame, Tag } from "lucide-react";
import { useApi } from "@/lib/useApi";
import { Card, CardHeader, CardTitle } from "@/components/dashboard/ui/card";
import { Skeleton } from "@/components/dashboard/ui/skeleton";

interface OrderAnalytics {
  ordersToday: number; ordersWeek: number; ordersMonth: number;
  revenueTodayCents: number; revenueWeekCents: number; revenueMonthCents: number;
  avgOrderValueCents: number;
  mostPopularItems: { name: string; count: number }[];
  mostCommonCustomizations: { label: string; count: number }[];
  busiestHours: { hour: number; count: number }[];
  ordersBySource: { source: string; count: number }[];
}

function money(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

function hourLabel(hour: number): string {
  const h = hour % 12 === 0 ? 12 : hour % 12;
  return `${h}${hour < 12 ? "am" : "pm"}`;
}

function StatTile({ label, value, icon: Icon }: { label: string; value: string; icon: any }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-center gap-2 text-slate-400"><Icon className="h-4 w-4" /><span className="text-xs font-medium">{label}</span></div>
      <p className="mt-2 text-2xl font-bold text-[#0f172a]">{value}</p>
    </div>
  );
}

export function RestaurantOrderAnalytics() {
  const { data, isLoading } = useApi<{ ok: boolean } & OrderAnalytics>("/api/business/orders/analytics", { refreshInterval: 60000 });

  if (isLoading || !data) {
    return (
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 w-full" />)}</div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-[#0f172a]">Phone Orders</h2>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatTile label="Orders today" value={String(data.ordersToday)} icon={ShoppingBag} />
        <StatTile label="Orders this week" value={String(data.ordersWeek)} icon={ShoppingBag} />
        <StatTile label="Revenue this month" value={money(data.revenueMonthCents)} icon={DollarSign} />
        <StatTile label="Avg order value" value={money(data.avgOrderValueCents)} icon={Receipt} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2 text-sm"><Flame className="h-4 w-4" /> Most Popular Items</CardTitle></CardHeader>
          <div className="space-y-1.5 p-4 pt-0">
            {data.mostPopularItems.length ? data.mostPopularItems.map((i) => (
              <div key={i.name} className="flex items-center justify-between text-sm">
                <span className="text-slate-700">{i.name}</span>
                <span className="font-medium text-slate-400">{i.count}x</span>
              </div>
            )) : <p className="text-xs text-slate-400">No orders yet this month.</p>}
          </div>
        </Card>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2 text-sm"><Tag className="h-4 w-4" /> Common Customizations</CardTitle></CardHeader>
          <div className="space-y-1.5 p-4 pt-0">
            {data.mostCommonCustomizations.length ? data.mostCommonCustomizations.map((c) => (
              <div key={c.label} className="flex items-center justify-between text-sm">
                <span className="text-slate-700">{c.label}</span>
                <span className="font-medium text-slate-400">{c.count}x</span>
              </div>
            )) : <p className="text-xs text-slate-400">No customizations recorded yet.</p>}
          </div>
        </Card>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2 text-sm"><Clock className="h-4 w-4" /> Busiest Hours</CardTitle></CardHeader>
          <div className="space-y-1.5 p-4 pt-0">
            {data.busiestHours.filter((h) => h.count > 0).length ? data.busiestHours.filter((h) => h.count > 0).map((h) => (
              <div key={h.hour} className="flex items-center justify-between text-sm">
                <span className="text-slate-700">{hourLabel(h.hour)}</span>
                <span className="font-medium text-slate-400">{h.count} order{h.count === 1 ? "" : "s"}</span>
              </div>
            )) : <p className="text-xs text-slate-400">No orders yet this month.</p>}
          </div>
        </Card>
      </div>
    </div>
  );
}
