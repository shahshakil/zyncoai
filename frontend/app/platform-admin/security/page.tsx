"use client";
import { toast } from "sonner";
import { LockKeyhole, Activity, ShieldOff, AlertTriangle } from "lucide-react";
import { useApi, apiPost } from "@/lib/useApi";
import { Card, CardHeader, CardTitle } from "@/components/dashboard/ui/card";
import { Badge } from "@/components/dashboard/ui/badge";
import { Button } from "@/components/dashboard/ui/button";
import { Table, Thead, Th, Tbody, Tr, Td, EmptyState } from "@/components/dashboard/ui/table";
import { Topbar } from "@/components/platform-admin/Topbar";

interface Overview {
  blockedIps: { ip: string; reason: string }[];
  cloudflareConfigured: boolean;
  rps: { current: number; level: "ok" | "warning" | "critical" };
  emergencyModeActive: boolean;
  injectionEventsToday: number;
}

export default function SecurityPage() {
  const { data, mutate } = useApi<Overview>("/api/admin/platform/security/overview", { refreshInterval: 10000 });
  const { data: events } = useApi<{ events: any[] }>("/api/admin/platform/security/events", { refreshInterval: 15000 });

  async function unblock(ip: string) {
    await apiPost(`/api/admin/platform/security/blocked-ips/${encodeURIComponent(ip)}/unblock`);
    toast.success(`Unblocked ${ip}`);
    mutate();
  }

  async function disableEmergency() {
    await apiPost("/api/admin/platform/security/emergency-mode/disable");
    toast.success("Emergency mode disabled");
    mutate();
  }

  return (
    <div className="-m-6">
      <Topbar title="Security" refreshIntervalMs={10000} />
      <div className="space-y-6 p-6">
        {data?.emergencyModeActive && (
          <div className="flex items-center justify-between gap-2 rounded-xl border border-[#FCA5A5] bg-[#FEF2F2] px-4 py-3 text-sm font-medium text-[#991B1B]">
            <span className="flex items-center gap-2"><AlertTriangle className="h-5 w-5" /> Emergency mode is ACTIVE — non-essential endpoints are returning 503. Auto-expires in up to 5 minutes.</span>
            <Button size="sm" variant="outline" onClick={disableEmergency}>Disable now</Button>
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="p-4">
            <div className="flex items-center justify-between"><span className="text-xs font-medium text-[#6B7280]">Blocked IPs</span><LockKeyhole className="h-4 w-4 text-[#EF4444]" /></div>
            <div className="mt-2 text-2xl font-semibold text-[#1F2937]">{data?.blockedIps.length ?? "…"}</div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between"><span className="text-xs font-medium text-[#6B7280]">Injection Attempts Today</span><ShieldOff className="h-4 w-4 text-[#F59E0B]" /></div>
            <div className="mt-2 text-2xl font-semibold text-[#1F2937]">{data?.injectionEventsToday ?? "…"}</div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between"><span className="text-xs font-medium text-[#6B7280]">Requests/sec</span><Activity className="h-4 w-4 text-[#3B82F6]" /></div>
            <div className="mt-2 text-2xl font-semibold text-[#1F2937]">{data?.rps.current ?? "…"}</div>
            {data && data.rps.level !== "ok" && <Badge tone={data.rps.level === "critical" ? "danger" : "warning"} className="mt-2">{data.rps.level}</Badge>}
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between"><span className="text-xs font-medium text-[#6B7280]">Cloudflare Auto-Block</span></div>
            <div className="mt-2"><Badge tone={data?.cloudflareConfigured ? "success" : "default"}>{data?.cloudflareConfigured ? "Configured" : "Not configured"}</Badge></div>
            {!data?.cloudflareConfigured && <p className="mt-1 text-[11px] text-[#9CA3AF]">Set CLOUDFLARE_ACCOUNT_ID/API_KEY/EMAIL to enable — IPs are still blocked in-app either way.</p>}
          </Card>
        </div>

        <Card>
          <CardHeader><CardTitle>Blocked IPs</CardTitle></CardHeader>
          <div className="p-2">
            {data?.blockedIps.length ? (
              <Table>
                <Thead><tr><Th>IP</Th><Th>Reason</Th><Th /></tr></Thead>
                <Tbody>
                  {data.blockedIps.map((b) => (
                    <Tr key={b.ip}><Td className="font-mono">{b.ip}</Td><Td>{b.reason}</Td><Td><Button size="sm" variant="outline" onClick={() => unblock(b.ip)}>Unblock</Button></Td></Tr>
                  ))}
                </Tbody>
              </Table>
            ) : <EmptyState title="No IPs currently blocked" />}
          </div>
        </Card>

        <Card>
          <CardHeader><CardTitle>Recent security events</CardTitle></CardHeader>
          <div className="p-2">
            {events?.events.length ? (
              <Table>
                <Thead><tr><Th>Type</Th><Th>IP</Th><Th>Endpoint</Th><Th>Business</Th><Th>When</Th></tr></Thead>
                <Tbody>
                  {events.events.map((e) => (
                    <Tr key={e.id}>
                      <Td><Badge tone="danger">{e.type}</Badge></Td>
                      <Td className="font-mono">{e.ip}</Td>
                      <Td>{e.endpoint}</Td>
                      <Td>{e.business?.name || "—"}</Td>
                      <Td>{new Date(e.createdAt).toLocaleString("en-AU")}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            ) : <EmptyState title="No security events recorded" />}
          </div>
        </Card>
      </div>
    </div>
  );
}
