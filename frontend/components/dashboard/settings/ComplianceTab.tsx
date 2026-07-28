"use client";
import { useState } from "react";
import { toast } from "sonner";
import { useApi, apiPost } from "@/lib/useApi";
import { useDashboard } from "@/components/dashboard/BusinessContext";
import { getVerticalOps } from "@/lib/verticalOps";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Input, Label, Textarea } from "../ui/input";
import { Table, Thead, Th, Tbody, Tr, Td, EmptyState } from "../ui/table";

interface ComplianceStatus {
  consent: {
    privacyPolicyAcceptedAt: string | null;
    privacyPolicyVersion: string | null;
    currentPrivacyPolicyVersion: string;
  };
  dataResidency: {
    requiredRegion: string;
    configuredRegion: string;
    compliant: boolean;
  };
  incidentResponse: {
    contact: string;
    scheme: string;
  };
  policyLinks: {
    privacyPolicy: string;
    termsOfService: string;
    dataProcessingAgreement: string;
  };
  verticalLawReferences: { law: string; note: string }[];
}

export function ComplianceTab() {
  const { business } = useDashboard();
  const ops = getVerticalOps(business.vertical);
  const { data, isLoading } = useApi<ComplianceStatus>("/api/business/compliance");

  if (isLoading) return <Skeleton className="h-64 w-full" />;
  if (!data) return null;

  return (
    <div className="space-y-4">
      {!!data.verticalLawReferences?.length && (
        <Card>
          <CardHeader>
            <CardTitle>Australian Law Compliance — {ops?.contactLabel ? business.vertical : "General"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-500">
            {data.verticalLawReferences.map((ref) => (
              <div key={ref.law} className="border-b border-slate-100 pb-2 last:border-0 last:pb-0">
                <p className="font-medium text-slate-700">{ref.law}</p>
                <p className="text-xs text-slate-400">{ref.note}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {ops && <ComplianceLogCard ops={ops} />}

      <Card>
        <CardHeader>
          <CardTitle>Privacy consent</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-slate-500">
          {data.consent.privacyPolicyAcceptedAt ? (
            <div className="flex items-center gap-2">
              <Badge tone="success">accepted</Badge>
              <span>
                Privacy Policy v{data.consent.privacyPolicyVersion} accepted on{" "}
                {new Date(data.consent.privacyPolicyAcceptedAt).toLocaleDateString()}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Badge tone="warning">not recorded</Badge>
              <span>No Privacy Policy acceptance found for this business.</span>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Data residency</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <Badge tone={data.dataResidency.compliant ? "success" : "warning"}>
              {data.dataResidency.compliant ? "compliant" : "action needed"}
            </Badge>
            <span>
              Configured region: <span className="text-slate-700">{data.dataResidency.configuredRegion}</span> · Required:{" "}
              <span className="text-slate-700">{data.dataResidency.requiredRegion}</span> (Sydney)
            </span>
          </div>
          {!data.dataResidency.compliant && (
            <p className="text-xs text-amber-400/80">
              Personal data is not currently hosted in the required Australian region. Contact support to plan a
              migration.
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notifiable Data Breaches — incident response</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-slate-500">
          <p>{data.incidentResponse.scheme}</p>
          <p>
            Incident contact:{" "}
            <a href={`mailto:${data.incidentResponse.contact}`} className="text-[var(--accent,#4f46e5)] underline">
              {data.incidentResponse.contact}
            </a>
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Policies</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3 text-sm">
          <a href={data.policyLinks.privacyPolicy} target="_blank" rel="noreferrer" className="text-[var(--accent,#4f46e5)] underline">Privacy Policy</a>
          <a href={data.policyLinks.termsOfService} target="_blank" rel="noreferrer" className="text-[var(--accent,#4f46e5)] underline">Terms of Service</a>
          <a href={data.policyLinks.dataProcessingAgreement} target="_blank" rel="noreferrer" className="text-[var(--accent,#4f46e5)] underline">Data Processing Agreement</a>
        </CardContent>
      </Card>
    </div>
  );
}

interface AuditLogRow { id: string; action: string; details: { category?: string; note?: string; loggedByUserId?: string } | null; createdAt: string }

// Generic append-only compliance log — food safety checks (RESTAURANT),
// workshop/WorkCover incidents (MECHANIC), or any other timestamped
// compliance record. Backed by the same VoiceAuditLog table every other
// audit event writes to (business/audit.ts's POST /compliance-log),
// filtered here to just action: "compliance.log_entry".
function ComplianceLogCard({ ops }: { ops: ReturnType<typeof getVerticalOps> }) {
  const { data, mutate } = useApi<{ ok: boolean; data: AuditLogRow[] }>("/api/business/audit?action=compliance.log_entry&pageSize=20");
  const [category, setCategory] = useState("");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  async function addEntry() {
    if (!note.trim()) { toast.error("Enter a note"); return; }
    setSaving(true);
    try {
      await apiPost("/api/business/audit/compliance-log", { category: category || undefined, note: note.trim() }, "POST");
      toast.success("Logged");
      setNote(""); setCategory("");
      mutate();
    } catch {
      toast.error("Could not log entry");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{ops?.complianceLogLabel || "Compliance Log"}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap items-end gap-2">
          <div className="w-40"><Label>Category</Label><Input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="e.g. Food safety" /></div>
          <div className="flex-1 min-w-[220px]"><Label>Note</Label><Textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder={ops?.complianceLogPlaceholder} rows={1} /></div>
          <Button size="sm" onClick={addEntry} disabled={saving}>{saving ? "Logging…" : "Log entry"}</Button>
        </div>
        <Table>
          <Thead><tr><Th>Date</Th><Th>Category</Th><Th>Note</Th></tr></Thead>
          <Tbody>
            {data?.data.map((l) => (
              <Tr key={l.id}>
                <Td className="text-xs text-slate-400">{new Date(l.createdAt).toLocaleString("en-AU")}</Td>
                <Td>{l.details?.category || "general"}</Td>
                <Td>{l.details?.note}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
        {data && !data.data.length && <EmptyState title="No compliance log entries yet" />}
      </CardContent>
    </Card>
  );
}
