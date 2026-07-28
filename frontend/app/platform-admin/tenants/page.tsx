"use client";
// Tenant & Staff Registry — cross-tenant view of every business's owner(s),
// full staff roster, and invite status in one place. Distinct from
// /platform-admin/businesses (billing/lifecycle: plan, suspend/activate)
// which already exists; this is purely a read-only registry. Uses the same
// requireSuperAdmin-gated /api/admin/platform/* surface as every other
// platform-admin page — no new auth path.
import { useState } from "react";
import { Search, Crown, User, Mail } from "lucide-react";
import { useApi } from "@/lib/useApi";
import { Card } from "@/components/dashboard/ui/card";
import { Input } from "@/components/dashboard/ui/input";
import { Badge } from "@/components/dashboard/ui/badge";
import { EmptyState } from "@/components/dashboard/ui/table";
import { Skeleton } from "@/components/dashboard/ui/skeleton";
import { Pagination } from "@/components/dashboard/ui/pagination";
import { Topbar } from "@/components/platform-admin/Topbar";
import { VerticalBadge } from "@/components/platform-admin/VerticalBadge";
import { timeAgo } from "@/components/platform-admin/format";

interface Member {
  userId: string;
  email: string;
  name: string | null;
}
interface StaffMember extends Member {
  role: string;
}
interface Invite {
  id: string;
  email: string;
  role: string;
  status: "pending" | "expired" | "accepted";
  createdAt: string;
  expiresAt: string;
}
interface TenantRow {
  id: string;
  name: string;
  vertical: string;
  status: string;
  teamName: string;
  createdAt: string;
  owners: Member[];
  staff: StaffMember[];
  invites: Invite[];
}

const INVITE_TONE: Record<Invite["status"], "success" | "warning" | "default"> = {
  accepted: "success",
  pending: "warning",
  expired: "default",
};

export default function TenantRegistryPage() {
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);

  const query = new URLSearchParams({ page: String(page), pageSize: "20", ...(q ? { q } : {}) }).toString();
  const { data, isLoading } = useApi<{ data: TenantRow[]; pagination: { totalPages: number }; stale?: boolean }>(
    `/api/admin/platform/tenant-registry?${query}`
  );

  return (
    <>
      <Topbar />
      <div className="space-y-4 p-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-lg font-semibold text-[#1F2937]">Tenant & Staff Registry</h1>
            <p className="text-sm text-[#6B7280]">Every business, its owner(s), staff roster, and invite status.</p>
          </div>
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]" />
            <Input
              className="pl-9"
              placeholder="Search business name or phone…"
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setPage(1);
              }}
            />
          </div>
        </div>

        {isLoading || !data ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-40 w-full" />
            ))}
          </div>
        ) : data.data.length === 0 ? (
          <Card className="p-6">
            <EmptyState title="No businesses found" />
          </Card>
        ) : (
          <div className="space-y-3">
            {data.data.map((b) => (
              <Card key={b.id} className="p-5">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-[#E5E7EB] pb-3">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-[#1F2937]">{b.name}</h3>
                    <VerticalBadge vertical={b.vertical} />
                    <Badge tone={b.status === "ACTIVE" ? "success" : "default"}>{b.status}</Badge>
                  </div>
                  <p className="text-xs text-[#9CA3AF]">Team: {b.teamName} · Joined {timeAgo(b.createdAt)}</p>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div>
                    <p className="mb-1.5 flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-[#9CA3AF]">
                      <Crown className="h-3.5 w-3.5" /> Owner{b.owners.length !== 1 ? "s" : ""}
                    </p>
                    {b.owners.length === 0 ? (
                      <p className="text-xs text-[#9CA3AF]">No owner on record</p>
                    ) : (
                      <div className="space-y-1">
                        {b.owners.map((o) => (
                          <div key={o.userId} className="text-xs">
                            <p className="font-medium text-[#1F2937]">{o.name || "(no name)"}</p>
                            <p className="text-[#6B7280]">{o.email}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <p className="mb-1.5 flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-[#9CA3AF]">
                      <User className="h-3.5 w-3.5" /> Staff ({b.staff.length})
                    </p>
                    {b.staff.length === 0 ? (
                      <p className="text-xs text-[#9CA3AF]">No staff members</p>
                    ) : (
                      <div className="max-h-32 space-y-1 overflow-y-auto pr-1">
                        {b.staff.map((s) => (
                          <div key={s.userId} className="flex items-center justify-between gap-2 text-xs">
                            <div className="min-w-0">
                              <p className="truncate font-medium text-[#1F2937]">{s.name || s.email}</p>
                              <p className="truncate text-[#6B7280]">{s.email}</p>
                            </div>
                            <Badge className="shrink-0">{s.role}</Badge>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <p className="mb-1.5 flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-[#9CA3AF]">
                      <Mail className="h-3.5 w-3.5" /> Invites ({b.invites.length})
                    </p>
                    {b.invites.length === 0 ? (
                      <p className="text-xs text-[#9CA3AF]">No invites sent</p>
                    ) : (
                      <div className="max-h-32 space-y-1 overflow-y-auto pr-1">
                        {b.invites.map((inv) => (
                          <div key={inv.id} className="flex items-center justify-between gap-2 text-xs">
                            <div className="min-w-0">
                              <p className="truncate font-medium text-[#1F2937]">{inv.email}</p>
                              <p className="text-[#6B7280]">{inv.role} · {timeAgo(inv.createdAt)}</p>
                            </div>
                            <Badge tone={INVITE_TONE[inv.status]} className="shrink-0">{inv.status}</Badge>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {data && data.pagination.totalPages > 1 && (
          <Pagination page={page} totalPages={data.pagination.totalPages} onPageChange={setPage} />
        )}
      </div>
    </>
  );
}
