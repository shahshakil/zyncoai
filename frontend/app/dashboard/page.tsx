"use client";
import OverviewDashboard from "@/components/dashboard/overview/OverviewDashboard";
import { StaffOverview } from "@/components/dashboard/overview/StaffOverview";
import { DashboardTabNav } from "@/components/dashboard/DashboardTabNav";
import { useDashboard } from "@/components/dashboard/BusinessContext";

export default function DashboardHome() {
  const { role } = useDashboard();

  // STAFF get a deliberately simplified landing page (today's appointments,
  // check-in queue, call log, patient search) — no analytics/revenue/ROI
  // panels or tab nav to other analytics-bearing pages.
  if (role === "STAFF") {
    return <StaffOverview />;
  }

  return (
    <div className="space-y-6">
      <DashboardTabNav />
      <OverviewDashboard />
    </div>
  );
}
