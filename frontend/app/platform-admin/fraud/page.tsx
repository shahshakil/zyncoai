"use client";
import { useState } from "react";
import { toast } from "sonner";
import { ShieldAlert, Gauge, Link2, KeyRound, RefreshCw } from "lucide-react";
import { useApi, apiPost } from "@/lib/useApi";
import { Card, CardHeader, CardTitle } from "@/components/dashboard/ui/card";
import { Badge } from "@/components/dashboard/ui/badge";
import { Button } from "@/components/dashboard/ui/button";
import { Table, Thead, Th, Tbody, Tr, Td, EmptyState } from "@/components/dashboard/ui/table";
import { Topbar } from "@/components/platform-admin/Topbar";

export default function FraudMonitorPage() {
  const { data: velocity, mutate: mutateVelocity } = useApi<{ autoSuspended: { id: string; name: string; phoneNumber: string }[] }>("/api/admin/platform/fraud/velocity", { refreshInterval: 15000 });
  const { data: usage } = useApi<{ businesses: { businessId: string; businessName: string; minutesUsed: number; allowance: number | null; pctUsed: number | null }[] }>("/api/admin/platform/fraud/usage", { refreshInterval: 30000 });
  const { data: integrations, mutate: mutateIntegrations } = useApi<{ grid: { businessId: string; businessName: string; type: string; status: string }[] }>("/api/admin/platform/fraud/integrations", { refreshInterval: 30000 });
  const { data: tokenExpiry } = useApi<{ expiring: { type: string; businessId: string; businessName: string; expiresAt: string }[] }>("/api/admin/platform/fraud/token-expiry", { refreshInterval: 60000 });
  const [checking, setChecking] = useState(false);

  async function clearSuspension(businessId: string) {
    await apiPost(`/api/admin/platform/fraud/velocity/${businessId}/clear`);
    toast.success("Business re-enabled");
    mutateVelocity();
  }

  async function runCheckNow() {
    setChecking(true);
    try {
      await apiPost("/api/admin/platform/fraud/integrations/run-check-now");
      toast.success("Health check started — refresh in a few seconds");
    } finally {
      setChecking(false);
    }
  }

  const failedIntegrations = integrations?.grid.filter((g) => g.status === "failed") || [];

  return (
    <div className="-m-6">
      <Topbar title="Fraud Monitor" refreshIntervalMs={15000} />
      <div className="space-y-6 p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card className="p-4">
            <div className="flex items-center justify-between"><span className="text-xs font-medium text-[#6B7280]">Auto-Suspended (Velocity)</span><ShieldAlert className="h-4 w-4 text-[#EF4444]" /></div>
            <div className="mt-2 text-2xl font-semibold text-[#1F2937]">{velocity?.autoSuspended.length ?? "…"}</div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between"><span className="text-xs font-medium text-[#6B7280]">Businesses Near Minute Limit</span><Gauge className="h-4 w-4 text-[#F59E0B]" /></div>
            <div className="mt-2 text-2xl font-semibold text-[#1F2937]">{usage?.businesses.filter((b) => (b.pctUsed ?? 0) >= 90).length ?? "…"}</div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between"><span className="text-xs font-medium text-[#6B7280]">Failed Integrations</span><Link2 className="h-4 w-4 text-[#EF4444]" /></div>
            <div className="mt-2 text-2xl font-semibold text-[#1F2937]">{failedIntegrations.length}</div>
          </Card>
        </div>

        <Card>
          <CardHeader><CardTitle>Velocity abuse — auto-suspended businesses</CardTitle></CardHeader>
          <div className="p-2">
            {velocity?.autoSuspended.length ? (
              <Table>
                <Thead><tr><Th>Business</Th><Th>Number</Th><Th /></tr></Thead>
                <Tbody>
                  {velocity.autoSuspended.map((b) => (
                    <Tr key={b.id}>
                      <Td>{b.name}</Td><Td>{b.phoneNumber}</Td>
                      <Td><Button size="sm" variant="outline" onClick={() => clearSuspension(b.id)}>Re-enable</Button></Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            ) : <EmptyState title="No businesses currently suspended for velocity abuse" />}
          </div>
        </Card>

        <Card>
          <CardHeader><CardTitle>Minute usage this month</CardTitle></CardHeader>
          <div className="p-2">
            {usage?.businesses.length ? (
              <Table>
                <Thead><tr><Th>Business</Th><Th>Used</Th><Th>Allowance</Th><Th>%</Th></tr></Thead>
                <Tbody>
                  {usage.businesses.map((b) => (
                    <Tr key={b.businessId}>
                      <Td>{b.businessName}</Td><Td>{b.minutesUsed.toFixed(0)} min</Td><Td>{b.allowance ?? "Unlimited"}</Td>
                      <Td>{b.pctUsed != null ? <Badge tone={b.pctUsed >= 100 ? "danger" : b.pctUsed >= 90 ? "warning" : "default"}>{b.pctUsed}%</Badge> : "—"}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            ) : <EmptyState title="No businesses have a minute allowance configured" />}
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Integration health</CardTitle>
            <Button size="sm" variant="outline" disabled={checking} onClick={runCheckNow}><RefreshCw className="h-3.5 w-3.5" /> {checking ? "Running…" : "Run check now"}</Button>
          </CardHeader>
          <div className="p-2">
            {failedIntegrations.length > 0 && (
              <div className="mx-2 mb-2 rounded-lg bg-[#FEF2F2] px-3 py-2 text-sm text-[#991B1B]">
                {failedIntegrations.length} business{failedIntegrations.length === 1 ? "" : "es"} {failedIntegrations.length === 1 ? "has" : "have"} a failed integration — owners have been emailed to reconnect.
              </div>
            )}
            {integrations?.grid.length ? (
              <Table>
                <Thead><tr><Th>Business</Th><Th>Integration</Th><Th>Status</Th></tr></Thead>
                <Tbody>
                  {integrations.grid.map((g, i) => (
                    <Tr key={i}><Td>{g.businessName}</Td><Td className="capitalize">{g.type}</Td><Td><Badge tone={g.status === "ok" ? "success" : "danger"}>{g.status}</Badge></Td></Tr>
                  ))}
                </Tbody>
              </Table>
            ) : <EmptyState title="No integration health checks recorded yet" description="Runs automatically every 4 hours, or click Run check now." />}
          </div>
        </Card>

        <Card>
          <CardHeader><CardTitle>Token expiry (next 7 days)</CardTitle></CardHeader>
          <div className="p-2">
            {tokenExpiry?.expiring.length ? (
              <Table>
                <Thead><tr><Th>Business</Th><Th>Type</Th><Th>Expires</Th></tr></Thead>
                <Tbody>
                  {tokenExpiry.expiring.map((t, i) => (
                    <Tr key={i}><Td>{t.businessName}</Td><Td className="capitalize">{t.type}</Td><Td>{new Date(t.expiresAt).toLocaleDateString("en-AU")}</Td></Tr>
                  ))}
                </Tbody>
              </Table>
            ) : <EmptyState title="No tokens expiring in the next 7 days" />}
          </div>
        </Card>
      </div>
    </div>
  );
}
