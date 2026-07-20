"use client";
import { useMemo, useState } from "react";
import { Printer } from "lucide-react";
import { useApi } from "@/lib/useApi";
import { Card } from "@/components/dashboard/ui/card";
import { Button } from "@/components/dashboard/ui/button";
import { Select } from "@/components/dashboard/ui/input";
import { Table, Thead, Th, Tbody, Tr, Td, EmptyState } from "@/components/dashboard/ui/table";
import { SkeletonRow } from "@/components/dashboard/ui/skeleton";
import { Badge } from "@/components/dashboard/ui/badge";
import { Pagination } from "@/components/dashboard/ui/pagination";
import { Topbar } from "@/components/platform-admin/Topbar";
import { parseUserAgent } from "@/components/platform-admin/format";

interface AuditEntry {
  id: string; action: string; createdAt: string; ip: string | null; userAgent: string | null; details: any;
  admin: { email: string; name: string | null } | null;
  targetBusiness: { name: string } | null;
}

const ACTIONS = [
  "admin.login", "admin.login_failed", "admin.business_viewed", "admin.business_suspended",
  "admin.business_activated", "admin.business_emailed", "admin.impersonation_started", "admin.transcript_accessed",
  "admin.announcement_created", "admin.settings_updated", "admin.feature_flag_toggled", "admin.business_plan_assigned",
];

const QUICK_FILTERS: { label: string; match: (action: string) => boolean }[] = [
  { label: "All", match: () => true },
  { label: "Logins", match: (a) => a.startsWith("admin.login") },
  { label: "Suspensions", match: (a) => a.includes("suspend") || a.includes("activated") },
  { label: "Exports", match: (a) => a.includes("export") || a.includes("transcript") },
  { label: "Views", match: (a) => a.includes("viewed") },
  { label: "Errors", match: (a) => a.includes("failed") },
];

function actionTone(action: string): "danger" | "warning" | "info" | "success" | "purple" | "default" {
  if (action.includes("failed")) return "danger";
  if (action.includes("suspend")) return "warning";
  if (action.startsWith("admin.login")) return "info";
  if (action.includes("activated") || action.includes("created")) return "success";
  if (action.includes("export") || action.includes("transcript")) return "purple";
  return "default";
}

export default function AuditLogPage() {
  const [action, setAction] = useState("");
  const [quickFilter, setQuickFilter] = useState("All");
  const [page, setPage] = useState(1);

  const query = new URLSearchParams({ page: String(page), pageSize: "25", ...(action ? { action } : {}) }).toString();
  const { data, isLoading } = useApi<{ data: AuditEntry[]; pagination: { totalPages: number } }>(`/api/admin/platform/audit-log?${query}`);

  const filterFn = QUICK_FILTERS.find((f) => f.label === quickFilter)?.match || (() => true);
  const rows = (data?.data || []).filter((e) => filterFn(e.action));

  // Flags any admin with 10+ actions inside the same minute on this page —
  // a real, computed signal from the rows already loaded, not a fabricated
  // one; naturally only catches bursts that land within one fetched page.
  const burstyKeys = useMemo(() => {
    const perMinute = new Map<string, number>();
    for (const e of data?.data || []) {
      const key = `${e.admin?.email || "unknown"}-${new Date(e.createdAt).toISOString().slice(0, 16)}`;
      perMinute.set(key, (perMinute.get(key) || 0) + 1);
    }
    return new Set(Array.from(perMinute.entries()).filter(([, n]) => n >= 10).map(([k]) => k));
  }, [data]);

  return (
    <div className="-m-6">
      <Topbar title="Audit Log" refreshIntervalMs={30000} />
      <div className="space-y-4 p-6">
        <div className="flex flex-wrap gap-2">
          {QUICK_FILTERS.map((f) => (
            <button
              key={f.label}
              onClick={() => { setQuickFilter(f.label); setPage(1); }}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium ${
                quickFilter === f.label ? "border-[#6366F1] bg-[#EEF2FF] text-[#6366F1]" : "border-[#E5E7EB] bg-white text-[#6B7280] hover:bg-[#F8F9FA]"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <Card>
          <div className="flex flex-wrap items-center gap-3 border-b border-[#E5E7EB] p-4">
            <Select value={action} onChange={(e) => { setAction(e.target.value); setPage(1); }} className="w-64">
              <option value="">All action types</option>
              {ACTIONS.map((a) => <option key={a} value={a}>{a}</option>)}
            </Select>
            <p className="text-xs text-[#9CA3AF]">Append-only — entries here can&apos;t be edited or deleted.</p>
            <div className="ml-auto">
              <Button variant="outline" size="sm" onClick={() => window.print()}>
                <Printer className="h-4 w-4" /> Export to PDF
              </Button>
            </div>
          </div>

          <Table>
            <Thead>
              <tr><Th>Time</Th><Th>Admin</Th><Th>Action</Th><Th>Target Business</Th><Th>Details</Th><Th>Device</Th><Th>IP Address</Th></tr>
            </Thead>
            <Tbody>
              {isLoading ? (
                Array.from({ length: 10 }).map((_, i) => <SkeletonRow key={i} cols={7} />)
              ) : rows.length ? (
                rows.map((e) => {
                  const key = `${e.admin?.email || "unknown"}-${new Date(e.createdAt).toISOString().slice(0, 16)}`;
                  const bursty = burstyKeys.has(key);
                  return (
                    <Tr key={e.id} className={bursty ? "bg-[#FFFBEB]" : undefined}>
                      <Td className="whitespace-nowrap text-xs text-[#6B7280]">{new Date(e.createdAt).toLocaleString()}</Td>
                      <Td>{e.admin?.name || e.admin?.email || "—"}</Td>
                      <Td>
                        <Badge tone={actionTone(e.action)}>{e.action}</Badge>
                        {bursty && <span className="ml-1 text-[10px] font-semibold text-[#92400E]" title="10+ actions by this admin within the same minute">⚠ burst</span>}
                      </Td>
                      <Td>{e.targetBusiness?.name || "—"}</Td>
                      <Td className="max-w-xs truncate text-xs text-[#9CA3AF]">{e.details ? JSON.stringify(e.details) : "—"}</Td>
                      <Td className="text-xs text-[#9CA3AF]">{parseUserAgent(e.userAgent)}</Td>
                      <Td className="text-xs text-[#9CA3AF]">{e.ip || "—"}</Td>
                    </Tr>
                  );
                })
              ) : null}
            </Tbody>
          </Table>
          {!isLoading && !rows.length && <EmptyState title="No audit entries yet" description="Admin actions (logins, suspensions, transcript access) will show up here as they happen." />}
          {data && <Pagination page={page} totalPages={data.pagination.totalPages} onPageChange={setPage} />}
        </Card>
      </div>
    </div>
  );
}
