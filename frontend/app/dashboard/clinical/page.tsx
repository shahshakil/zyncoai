import dynamic from "next/dynamic";
import { DashboardTabNav } from "@/components/dashboard/DashboardTabNav";

const ClinicalBillingDashboard = dynamic(() => import("@/components/dashboard/clinical/ClinicalBillingDashboard"), {
  loading: () => <div className="h-64 animate-pulse rounded-xl bg-slate-100" />,
  ssr: false,
});

export default function ClinicalPage() {
  return (
    <div className="space-y-6">
      <DashboardTabNav />
      <ClinicalBillingDashboard />
    </div>
  );
}
