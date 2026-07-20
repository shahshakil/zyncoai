"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Eye, Ban, PlayCircle, Mail, Download, Search, CheckSquare, Square } from "lucide-react";
import { toast } from "sonner";
import { useApi, apiPost } from "@/lib/useApi";
import { Card } from "@/components/dashboard/ui/card";
import { Button } from "@/components/dashboard/ui/button";
import { Input, Select } from "@/components/dashboard/ui/input";
import { Table, Thead, Th, Tbody, Tr, Td, EmptyState } from "@/components/dashboard/ui/table";
import { SkeletonRow } from "@/components/dashboard/ui/skeleton";
import { StatusBadge } from "@/components/dashboard/ui/badge";
import { Pagination } from "@/components/dashboard/ui/pagination";
import { Topbar } from "@/components/platform-admin/Topbar";
import { BusinessDrawer } from "@/components/platform-admin/BusinessDrawer";
import { VerticalBadge } from "@/components/platform-admin/VerticalBadge";
import { VERTICAL_LABELS, timeAgo } from "@/components/platform-admin/format";
import { exportToExcel, exportToCsv, type ExportColumn } from "@/lib/exportUtils";

interface Business {
  id: string; name: string; phoneNumber: string; vertical: string; status: string; createdAt: string; lastCallAt: string | null;
  team: { name: string };
  _count: { calls: number; appointments: number; providers: number; contacts: number };
}

const COLUMNS: ExportColumn[] = [
  { key: "name", label: "Business Name", width: 26 },
  { key: "vertical", label: "Vertical", width: 14 },
  { key: "owner", label: "Owner (Team)", width: 20 },
  { key: "status", label: "Status", width: 12 },
  { key: "calls", label: "Calls", width: 10, align: "right", total: "sum" },
  { key: "bookings", label: "Bookings", width: 10, align: "right", total: "sum" },
  { key: "lastCall", label: "Last Call", width: 16 },
  { key: "joined", label: "Joined", width: 14 },
];

export default function BusinessesPage() {
  const search = useSearchParams();
  const [q, setQ] = useState("");
  const [vertical, setVertical] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [drawerId, setDrawerId] = useState<string | null>(search.get("open"));
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkBusy, setBulkBusy] = useState(false);

  const query = new URLSearchParams({
    page: String(page), pageSize: "20",
    ...(q ? { q } : {}), ...(status ? { status } : {}), ...(vertical ? { vertical } : {}),
  }).toString();
  const { data, isLoading, mutate } = useApi<{ data: Business[]; pagination: { totalPages: number }; stale?: boolean }>(`/api/admin/platform/businesses?${query}`);

  function toggleOne(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }
  function toggleAll() {
    if (!data?.data.length) return;
    setSelected((prev) => (prev.size === data.data.length ? new Set() : new Set(data.data.map((b) => b.id))));
  }

  async function quickToggle(b: Business) {
    const action = b.status === "SUSPENDED" ? "activate" : "suspend";
    if (action === "suspend" && !confirm(`Suspend ${b.name}? Their AI receptionist will stop taking calls.`)) return;
    try {
      await apiPost(`/api/admin/platform/businesses/${b.id}/${action}`);
      toast.success(`${b.name} ${action}d`);
      mutate();
    } catch {
      toast.error("Action failed");
    }
  }

  async function bulkAction(action: "suspend" | "activate" | "email") {
    if (!selected.size) return;
    if (action === "suspend" && !confirm(`Suspend ${selected.size} businesses? Their AI receptionists will stop taking calls.`)) return;
    let subject: string | undefined, message: string | undefined;
    if (action === "email") {
      subject = window.prompt("Email subject:") || undefined;
      if (!subject) return;
      message = window.prompt("Email message:") || undefined;
      if (!message) return;
    }
    setBulkBusy(true);
    try {
      const res = await apiPost<{ count: number }>("/api/admin/platform/businesses/bulk", { ids: Array.from(selected), action, subject, message });
      toast.success(`${action === "email" ? `Emailed ${res.count} owner(s)` : `${res.count} businesses ${action}d`}`);
      setSelected(new Set());
      mutate();
    } catch {
      toast.error("Bulk action failed");
    } finally {
      setBulkBusy(false);
    }
  }

  function rows() {
    return (data?.data || []).map((b) => ({
      name: b.name, vertical: VERTICAL_LABELS[b.vertical] || b.vertical, owner: b.team.name,
      status: b.status, calls: b._count.calls, bookings: b._count.appointments,
      lastCall: b.lastCallAt ? timeAgo(b.lastCallAt) : "Never",
      joined: new Date(b.createdAt).toLocaleDateString(),
    }));
  }

  function bulkRows() {
    const set = selected;
    return (data?.data || []).filter((b) => set.has(b.id)).map((b) => ({
      name: b.name, vertical: VERTICAL_LABELS[b.vertical] || b.vertical, owner: b.team.name,
      status: b.status, calls: b._count.calls, bookings: b._count.appointments,
      lastCall: b.lastCallAt ? timeAgo(b.lastCallAt) : "Never",
      joined: new Date(b.createdAt).toLocaleDateString(),
    }));
  }

  return (
    <div className="-m-6">
      <Topbar title="Businesses" refreshIntervalMs={30000} />
      <div className="space-y-4 p-6">
        {data?.stale && (
          <div className="rounded-xl border border-[#FDE68A] bg-[#FFFBEB] px-4 py-2 text-sm text-[#92400E]">Data may be delayed — showing the last known values.</div>
        )}

        {selected.size > 0 && (
          <div className="flex items-center gap-3 rounded-xl border border-[#C7D2FE] bg-[#EEF2FF] px-4 py-2.5 text-sm">
            <span className="font-medium text-[#1F2937]">{selected.size} selected</span>
            <Button size="sm" variant="outline" disabled={bulkBusy} onClick={() => bulkAction("suspend")}>Suspend all</Button>
            <Button size="sm" variant="outline" disabled={bulkBusy} onClick={() => bulkAction("activate")}>Activate all</Button>
            <Button size="sm" variant="outline" disabled={bulkBusy} onClick={() => bulkAction("email")}>Email all</Button>
            <Button
              size="sm" variant="outline"
              onClick={() => exportToCsv(COLUMNS, bulkRows(), `ZyncoAI-Businesses-Selection-${new Date().toISOString().slice(0, 10)}.csv`)}
            >
              <Download className="h-4 w-4" /> Export selected
            </Button>
            <button className="ml-auto text-xs text-[#6B7280] hover:text-[#1F2937]" onClick={() => setSelected(new Set())}>Clear</button>
          </div>
        )}

        <Card>
          <div className="flex flex-wrap items-center gap-3 border-b border-[#E5E7EB] p-4">
            <div className="relative min-w-[220px] flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]" />
              <Input className="pl-9" placeholder="Search by name or phone…" value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} />
            </div>
            <Select value={vertical} onChange={(e) => { setVertical(e.target.value); setPage(1); }} className="w-44">
              <option value="">All verticals</option>
              {Object.entries(VERTICAL_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </Select>
            <Select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} className="w-40">
              <option value="">All statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="SUSPENDED">Suspended</option>
            </Select>
            <div className="ml-auto flex gap-2">
              <Button variant="outline" size="sm" onClick={() => exportToCsv(COLUMNS, rows(), `ZyncoAI-Businesses-${new Date().toISOString().slice(0, 10)}.csv`)}>
                <Download className="h-4 w-4" /> CSV
              </Button>
              <Button
                size="sm"
                onClick={() => exportToExcel(
                  [{ name: "Businesses", columns: COLUMNS, rows: rows(), showTotals: true }],
                  { businessName: "ZyncoAI Platform", reportTitle: "Businesses Report", filtersLabel: [status, vertical, q].filter(Boolean).join(", ") || undefined },
                  `ZyncoAI-Businesses-${new Date().toISOString().slice(0, 10)}.xlsx`
                )}
              >
                <Download className="h-4 w-4" /> Excel
              </Button>
            </div>
          </div>

          <Table>
            <Thead>
              <tr>
                <Th>
                  <button onClick={toggleAll} className="flex items-center text-[#9CA3AF] hover:text-[#1F2937]">
                    {data?.data.length && selected.size === data.data.length ? <CheckSquare className="h-4 w-4" /> : <Square className="h-4 w-4" />}
                  </button>
                </Th>
                <Th>Business</Th><Th>Vertical</Th><Th>Owner</Th><Th>Status</Th>
                <Th>Calls</Th><Th>Bookings</Th><Th>Last Call</Th><Th>Joined</Th><Th></Th>
              </tr>
            </Thead>
            <Tbody>
              {isLoading ? (
                Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} cols={9} />)
              ) : data?.data.length ? (
                data.data.map((b) => (
                  <Tr key={b.id}>
                    <Td>
                      <button onClick={() => toggleOne(b.id)} className="flex items-center text-[#9CA3AF] hover:text-[#1F2937]">
                        {selected.has(b.id) ? <CheckSquare className="h-4 w-4 text-[#6366F1]" /> : <Square className="h-4 w-4" />}
                      </button>
                    </Td>
                    <Td>
                      <button onClick={() => setDrawerId(b.id)} className="text-left font-medium text-[#1F2937] hover:text-[#6366F1]">{b.name}</button>
                      <p className="text-xs text-[#9CA3AF]">{b.phoneNumber}</p>
                    </Td>
                    <Td><VerticalBadge vertical={b.vertical} /></Td>
                    <Td>{b.team.name}</Td>
                    <Td><StatusBadge status={b.status} /></Td>
                    <Td>{b._count.calls}</Td>
                    <Td>{b._count.appointments}</Td>
                    <Td className="text-xs text-[#6B7280]">{b.lastCallAt ? timeAgo(b.lastCallAt) : "Never"}</Td>
                    <Td>{new Date(b.createdAt).toLocaleDateString()}</Td>
                    <Td>
                      <div className="flex items-center gap-1">
                        <IconBtn title="View" onClick={() => setDrawerId(b.id)}><Eye className="h-4 w-4" /></IconBtn>
                        <IconBtn title={b.status === "SUSPENDED" ? "Activate" : "Suspend"} onClick={() => quickToggle(b)} danger={b.status !== "SUSPENDED"}>
                          {b.status === "SUSPENDED" ? <PlayCircle className="h-4 w-4" /> : <Ban className="h-4 w-4" />}
                        </IconBtn>
                        <IconBtn title="Send message" onClick={() => setDrawerId(b.id)}><Mail className="h-4 w-4" /></IconBtn>
                      </div>
                    </Td>
                  </Tr>
                ))
              ) : null}
            </Tbody>
          </Table>
          {!isLoading && !data?.data.length && <EmptyState title="No businesses found" />}
          {data && <Pagination page={page} totalPages={data.pagination.totalPages} onPageChange={setPage} />}
        </Card>
      </div>

      <BusinessDrawer businessId={drawerId} onClose={() => setDrawerId(null)} onChanged={() => mutate()} />
    </div>
  );
}

function IconBtn({ children, title, onClick, danger }: { children: React.ReactNode; title: string; onClick: () => void; danger?: boolean }) {
  return (
    <button
      title={title}
      onClick={onClick}
      className={`flex h-7 w-7 items-center justify-center rounded-md text-[#6B7280] hover:bg-[#F8F9FA] ${danger ? "hover:text-[#EF4444]" : "hover:text-[#6366F1]"}`}
    >
      {children}
    </button>
  );
}
