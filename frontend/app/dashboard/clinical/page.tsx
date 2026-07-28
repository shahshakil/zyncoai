import ClinicalBillingDashboard from "@/components/dashboard/clinical/ClinicalBillingDashboard";
import { DashboardTabNav } from "@/components/dashboard/DashboardTabNav";

export default function ClinicalPage() {
  return (
    <div className="space-y-6">
      <DashboardTabNav />
      <ClinicalBillingDashboard />
    </div>
  );
}
