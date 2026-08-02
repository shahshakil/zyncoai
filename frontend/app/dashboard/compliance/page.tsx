"use client";
import { ShieldCheck, ShieldAlert, FileText } from "lucide-react";
import { useApi } from "@/lib/useApi";
import { useDashboard } from "@/components/dashboard/BusinessContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/dashboard/ui/card";
import { Skeleton } from "@/components/dashboard/ui/skeleton";
import { EmptyState } from "@/components/dashboard/ui/table";
import { Badge } from "@/components/dashboard/ui/badge";

interface ComplianceResponse {
  consent: { privacyPolicyAcceptedAt: string | null; privacyPolicyVersion: string | null; currentPrivacyPolicyVersion: string };
  dataResidency: { requiredRegion: string; configuredRegion: string; compliant: boolean };
  incidentResponse: { contact: string; scheme: string };
  policyLinks: { privacyPolicy: string; termsOfService: string; dataProcessingAgreement: string };
  verticalLawReferences: { name: string; url?: string }[];
}

export default function CompliancePage() {
  const { canManageBusiness } = useDashboard();
  const { data, isLoading } = useApi<ComplianceResponse>(canManageBusiness ? "/api/business/compliance" : null);

  if (!canManageBusiness) {
    return <EmptyState title="Not available" description="Compliance evidence is only visible to business owners and admins." />;
  }

  if (isLoading || !data) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#0f172a]">Compliance Evidence Centre</h1>

      <Card>
        <CardHeader><CardTitle>Data residency</CardTitle></CardHeader>
        <CardContent>
          <div className="flex items-start gap-3 rounded-xl border p-4" style={{ background: data.dataResidency.compliant ? "#f0fdf4" : "#fffbeb", borderColor: data.dataResidency.compliant ? "#bbf7d0" : "#fde68a" }}>
            {data.dataResidency.compliant ? <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" /> : <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />}
            <div>
              <p className="text-sm font-medium text-slate-800">
                {data.dataResidency.compliant ? "Data residency compliant" : `Data stored in ${data.dataResidency.configuredRegion}, required region is ${data.dataResidency.requiredRegion}`}
              </p>
              <p className="mt-0.5 text-xs text-slate-500">Required region: {data.dataResidency.requiredRegion} · Configured region: {data.dataResidency.configuredRegion}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Consent</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Privacy policy accepted</span>
            <span className="text-slate-800">{data.consent.privacyPolicyAcceptedAt ? new Date(data.consent.privacyPolicyAcceptedAt).toLocaleDateString("en-AU") : "—"}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Policy version accepted</span>
            <span className="text-slate-800">{data.consent.privacyPolicyVersion || "—"}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Current policy version</span>
            <Badge tone={data.consent.privacyPolicyVersion === data.consent.currentPrivacyPolicyVersion ? "success" : "warning"}>{data.consent.currentPrivacyPolicyVersion}</Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Incident response</CardTitle></CardHeader>
        <CardContent className="text-sm text-slate-600">
          <p>{data.incidentResponse.scheme}</p>
          <p className="mt-1">Contact: <a href={`mailto:${data.incidentResponse.contact}`} className="text-[#2563eb] hover:underline">{data.incidentResponse.contact}</a></p>
        </CardContent>
      </Card>

      {data.verticalLawReferences.length > 0 && (
        <Card>
          <CardHeader><CardTitle>Applicable regulations</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {data.verticalLawReferences.map((ref) => (
              <a key={ref.name} href={ref.url || "#"} target={ref.url ? "_blank" : undefined} rel="noreferrer" className="flex items-center gap-2 text-sm text-slate-700 hover:text-[#2563eb]">
                <FileText className="h-4 w-4 shrink-0 text-slate-400" /> {ref.name}
              </a>
            ))}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader><CardTitle>Policy documents</CardTitle></CardHeader>
        <CardContent className="flex flex-wrap gap-4 text-sm">
          <a href={data.policyLinks.privacyPolicy} target="_blank" rel="noreferrer" className="text-[#2563eb] hover:underline">Privacy Policy</a>
          <a href={data.policyLinks.termsOfService} target="_blank" rel="noreferrer" className="text-[#2563eb] hover:underline">Terms of Service</a>
          <a href={data.policyLinks.dataProcessingAgreement} target="_blank" rel="noreferrer" className="text-[#2563eb] hover:underline">Data Processing Agreement</a>
        </CardContent>
      </Card>
    </div>
  );
}
