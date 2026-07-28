import OverviewDashboard from "@/components/dashboard/overview/OverviewDashboard";
import { DashboardTabNav } from "@/components/dashboard/DashboardTabNav";

export default function DashboardHome() {
  return (
    <div className="space-y-6">
      <DashboardTabNav />
      <OverviewDashboard />
    </div>
  );
}
