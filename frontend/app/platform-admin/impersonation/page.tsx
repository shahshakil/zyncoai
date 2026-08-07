"use client";
import { useState } from "react";
import { toast } from "sonner";
import { useApi, apiPost } from "@/lib/useApi";
import { Card } from "@/components/dashboard/ui/card";
import { Button } from "@/components/dashboard/ui/button";
import { Table, Thead, Th, Tbody, Tr, Td, EmptyState } from "@/components/dashboard/ui/table";
import { SkeletonRow } from "@/components/dashboard/ui/skeleton";
import { Badge } from "@/components/dashboard/ui/badge";
import { Pagination } from "@/components/dashboard/ui/pagination";
import { Topbar } from "@/components/platform-admin/Topbar";
import { VerticalBadge } from "@/components/platform-admin/VerticalBadge";

interface ImpersonationSessionRow {
  id: string;
  mode: "read" | "edit";
  reason: string;
  startedAt: string;
  lastActivityAt: string;
  editModeAt: string | null;
  endedAt: string | null;
  endReason: string | null;
  admin: { id: string; email: string; name: string | null };
  business: { id: string; name: string; vertical: string };
}

function formatDuration(startedAt: string, endedAt: string | null): string {
  const ms = (endedAt ? new Date(endedAt).getTime() : Date.now()) - new Date(startedAt).getTime();
  const min = Math.round(ms / 60000);
  if (min < 60) return `${min}m`;
  return `${Math.floor(min / 60)}h ${min % 60}m`;
}

export default function ImpersonationHistoryPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading, mutate } = useApi<{ data: ImpersonationSessionRow[]; pagination: { totalPages: number } }>(
    `/api/admin/platform/impersonation/history?page=${page}&pageSize=25`,
    { refreshInterval: 15000 }
  );
  const [revoking, setRevoking] = useState<string | null>(null);

  async function revoke(sessionId: string) {
    if (!confirm("Revoke this active impersonation session immediately?")) return;
    setRevoking(sessionId);
    try {
      await apiPost(`/api/admin/platform/impersonation/${sessionId}/revoke`);
      toast.success("Session revoked");
      mutate();
    } catch {
      toast.error("Failed to revoke session");
    } finally {
      setRevoking(null);
    }
  }

  const rows = data?.data || [];

  return (
    <div className="-m-6">
      <Topbar title="Impersonation History" refreshIntervalMs={15000} />
      <div className="space-y-4 p-6">
        <Card>
          <div className="flex items-center gap-3 border-b border-[#E5E7EB] p-4">
            <p className="text-xs text-[#9CA3AF]">
              Every &quot;View dashboard as this business&quot; session, newest first — reason, mode, duration. Active
              sessions can be revoked remotely.
            </p>
          </div>
          <Table>
            <Thead>
              <tr><Th>Admin</Th><Th>Business</Th><Th>Reason</Th><Th>Mode</Th><Th>Started</Th><Th>Duration</Th><Th>Status</Th><Th /></tr>
            </Thead>
            <Tbody>
              {isLoading ? (
                Array.from({ length: 10 }).map((_, i) => <SkeletonRow key={i} cols={8} />)
              ) : rows.length ? (
                rows.map((s) => {
                  const active = !s.endedAt;
                  return (
                    <Tr key={s.id}>
                      <Td>{s.admin.name || s.admin.email}</Td>
                      <Td>
                        <div className="flex items-center gap-1.5">
                          {s.business.name} <VerticalBadge vertical={s.business.vertical} />
                        </div>
                      </Td>
                      <Td className="max-w-xs truncate text-xs text-[#6B7280]" title={s.reason}>{s.reason}</Td>
                      <Td><Badge tone={s.mode === "edit" ? "warning" : "default"}>{s.mode}</Badge></Td>
                      <Td className="whitespace-nowrap text-xs text-[#6B7280]">{new Date(s.startedAt).toLocaleString()}</Td>
                      <Td className="text-xs text-[#6B7280]">{formatDuration(s.startedAt, s.endedAt)}</Td>
                      <Td>
                        {active ? (
                          <Badge tone="success">active</Badge>
                        ) : (
                          <Badge tone="default">{s.endReason || "ended"}</Badge>
                        )}
                      </Td>
                      <Td>
                        {active && (
                          <Button size="sm" variant="danger" disabled={revoking === s.id} onClick={() => revoke(s.id)}>
                            {revoking === s.id ? "Revoking…" : "Revoke"}
                          </Button>
                        )}
                      </Td>
                    </Tr>
                  );
                })
              ) : null}
            </Tbody>
          </Table>
          {!isLoading && !rows.length && (
            <EmptyState title="No impersonation sessions yet" description="Sessions started via a business's &quot;View dashboard as this business&quot; button will show up here." />
          )}
          {data && <Pagination page={page} totalPages={data.pagination.totalPages} onPageChange={setPage} />}
        </Card>
      </div>
    </div>
  );
}
