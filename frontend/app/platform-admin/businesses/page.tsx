"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Eye, Ban, PlayCircle, Mail, Download, Search, CheckSquare, Square, Plus } from "lucide-react";
import { toast } from "sonner";
import { useApi, apiPost } from "@/lib/useApi";
import { Card } from "@/components/dashboard/ui/card";
import { Button } from "@/components/dashboard/ui/button";
import { Input, Select, Label } from "@/components/dashboard/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/dashboard/ui/dialog";
import { Table, Thead, Th, Tbody, Tr, Td, EmptyState } from "@/components/dashboard/ui/table";
import { SkeletonRow } from "@/components/dashboard/ui/skeleton";
import { StatusBadge } from "@/components/dashboard/ui/badge";
import { Pagination } from "@/components/dashboard/ui/pagination";
import { Topbar } from "@/components/platform-admin/Topbar";
import { BusinessDrawer } from "@/components/platform-admin/BusinessDrawer";
import { VerticalBadge } from "@/components/platform-admin/VerticalBadge";
import { VERTICAL_LABELS, timeAgo, formatCents } from "@/components/platform-admin/format";
import { exportToExcel, exportToCsv, type ExportColumn } from "@/lib/exportUtils";

interface Business {
  id: string; name: string; phoneNumber: string; vertical: string; status: string; createdAt: string; lastCallAt: string | null;
  team: { name: string };
  _count: { calls: number; appointments: number; providers: number; contacts: number };
  plan: string; manualPlan: string | null; monthlyRevenueCents: number; callAllowance: number | null; callsUsedThisMonth: number; callsUsedPct: number | null;
  trialStatus: "none" | "active" | "expired"; trialEndsAt: string | null;
  twilioNumberSid: string | null; provisioningStatus: "PENDING" | "ACTIVE" | "FAILED"; provisioningError: string | null;
  totalOrders: number;
}

const COLUMNS: ExportColumn[] = [
  { key: "name", label: "Business Name", width: 26 },
  { key: "vertical", label: "Vertical", width: 14 },
  { key: "owner", label: "Owner (Team)", width: 20 },
  { key: "status", label: "Status", width: 12 },
  { key: "plan", label: "Plan", width: 16 },
  { key: "monthlyRevenue", label: "Monthly Revenue", width: 14, align: "right" },
  { key: "callsUsage", label: "Calls Used / Allowance", width: 16 },
  { key: "calls", label: "Calls", width: 10, align: "right", total: "sum" },
  { key: "bookings", label: "Bookings", width: 10, align: "right", total: "sum" },
  { key: "orders", label: "Orders (RESTAURANT)", width: 12, align: "right" },
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

  const [createOpen, setCreateOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newBusinessName, setNewBusinessName] = useState("");
  const [newOwnerEmail, setNewOwnerEmail] = useState("");
  const [newOwnerName, setNewOwnerName] = useState("");
  const [newPhoneNumber, setNewPhoneNumber] = useState("");
  const [newVertical, setNewVertical] = useState("MEDICAL");

  async function createBusiness() {
    if (!newBusinessName.trim() || !newOwnerEmail.trim() || !newPhoneNumber.trim()) {
      toast.error("Business name, owner email, and phone number are required");
      return;
    }
    setCreating(true);
    try {
      await apiPost("/api/admin/platform/businesses", {
        businessName: newBusinessName.trim(),
        ownerEmail: newOwnerEmail.trim(),
        ownerName: newOwnerName.trim() || undefined,
        phoneNumber: newPhoneNumber.trim(),
        vertical: newVertical,
      });
      toast.success("Business created — a set-password email was sent to the owner");
      setCreateOpen(false);
      setNewBusinessName(""); setNewOwnerEmail(""); setNewOwnerName(""); setNewPhoneNumber(""); setNewVertical("MEDICAL");
      mutate();
    } catch (e: any) {
      toast.error(e?.message === "owner_email_already_registered" ? "That email is already registered" : e?.message === "phone_number_already_in_use" ? "That phone number is already in use" : "Failed to create business");
    } finally {
      setCreating(false);
    }
  }

  const query = new URLSearchParams({
    page: String(page), pageSize: "20",
    ...(q ? { q } : {}), ...(status ? { status } : {}), ...(vertical ? { vertical } : {}),
  }).toString();
  const { data, isLoading, mutate } = useApi<{ data: Business[]; pagination: { totalPages: number }; stale?: boolean }>(`/api/admin/platform/businesses?${query}`);
  const { data: settingsData } = useApi<{ settings: { pricingPlans: { key: string; name: string }[] } }>("/api/admin/platform/settings/");

  async function assignPlan(businessId: string, planKey: string) {
    try {
      await apiPost(`/api/admin/platform/businesses/${businessId}/plan`, { planKey: planKey || null });
      toast.success("Plan updated");
      mutate();
    } catch {
      toast.error("Failed to update plan");
    }
  }

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
      status: b.status, plan: b.plan, monthlyRevenue: (b.monthlyRevenueCents / 100).toFixed(2),
      callsUsage: b.callAllowance ? `${b.callsUsedThisMonth}/${b.callAllowance}` : `${b.callsUsedThisMonth}/unlimited`,
      calls: b._count.calls, bookings: b._count.appointments,
      orders: b.vertical === "RESTAURANT" ? b.totalOrders : "",
      lastCall: b.lastCallAt ? timeAgo(b.lastCallAt) : "Never",
      joined: new Date(b.createdAt).toLocaleDateString(),
    }));
  }

  function bulkRows() {
    const set = selected;
    return (data?.data || []).filter((b) => set.has(b.id)).map((b) => ({
      name: b.name, vertical: VERTICAL_LABELS[b.vertical] || b.vertical, owner: b.team.name,
      status: b.status, plan: b.plan, monthlyRevenue: (b.monthlyRevenueCents / 100).toFixed(2),
      callsUsage: b.callAllowance ? `${b.callsUsedThisMonth}/${b.callAllowance}` : `${b.callsUsedThisMonth}/unlimited`,
      calls: b._count.calls, bookings: b._count.appointments,
      orders: b.vertical === "RESTAURANT" ? b.totalOrders : "",
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
              <Button size="sm" onClick={() => setCreateOpen(true)}>
                <Plus className="h-4 w-4" /> Add Business
              </Button>
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
                <Th>Plan</Th><Th>Monthly Revenue</Th><Th>Calls Used</Th>
                <Th>Calls</Th><Th>Bookings</Th><Th>Orders</Th><Th>Last Call</Th><Th>Joined</Th><Th></Th>
              </tr>
            </Thead>
            <Tbody>
              {isLoading ? (
                Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} cols={13} />)
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
                      <p className="text-xs text-[#9CA3AF]">{b.provisioningStatus === "PENDING" ? "Setting up…" : b.phoneNumber}</p>
                      {b.provisioningStatus === "FAILED" && <p className="text-[10px] font-medium text-[#EF4444]">Number provisioning failed</p>}
                    </Td>
                    <Td><VerticalBadge vertical={b.vertical} /></Td>
                    <Td>{b.team.name}</Td>
                    <Td>
                      <StatusBadge status={b.status} />
                      {b.trialStatus === "active" && <p className="mt-1 text-[10px] font-medium text-[#F59E0B]">Trial active</p>}
                      {b.trialStatus === "expired" && <p className="mt-1 text-[10px] font-medium text-[#EF4444]">Trial expired</p>}
                    </Td>
                    <Td>
                      <Select value={b.manualPlan || ""} onChange={(e) => assignPlan(b.id, e.target.value)} className="h-8 w-32 text-xs">
                        <option value="">No plan</option>
                        {settingsData?.settings.pricingPlans.map((p) => <option key={p.key} value={p.key}>{p.name}</option>)}
                      </Select>
                    </Td>
                    <Td>{formatCents(b.monthlyRevenueCents)}</Td>
                    <Td className={b.callsUsedPct !== null && b.callsUsedPct >= 90 ? "font-medium text-[#EF4444]" : undefined}>
                      {b.callAllowance ? `${b.callsUsedThisMonth}/${b.callAllowance}` : `${b.callsUsedThisMonth}/∞`}
                    </Td>
                    <Td>{b._count.calls}</Td>
                    <Td>{b._count.appointments}</Td>
                    <Td>{b.vertical === "RESTAURANT" ? b.totalOrders : "—"}</Td>
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

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Add a new business</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>Business name</Label>
              <Input value={newBusinessName} onChange={(e) => setNewBusinessName(e.target.value)} placeholder="Bright Smile Dental" />
            </div>
            <div>
              <Label>Owner email</Label>
              <Input type="email" value={newOwnerEmail} onChange={(e) => setNewOwnerEmail(e.target.value)} placeholder="owner@example.com" />
            </div>
            <div>
              <Label>Owner name (optional)</Label>
              <Input value={newOwnerName} onChange={(e) => setNewOwnerName(e.target.value)} placeholder="Jane Smith" />
            </div>
            <div>
              <Label>Phone number (Twilio number)</Label>
              <Input value={newPhoneNumber} onChange={(e) => setNewPhoneNumber(e.target.value)} placeholder="+61..." />
            </div>
            <div>
              <Label>Vertical</Label>
              <Select value={newVertical} onChange={(e) => setNewVertical(e.target.value)}>
                {Object.entries(VERTICAL_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </Select>
            </div>
            <p className="text-[11px] text-[#9CA3AF]">The owner will get an email to set their own password — no password is created or seen here.</p>
            <Button className="w-full" onClick={createBusiness} disabled={creating}>{creating ? "Creating…" : "Create business"}</Button>
          </div>
        </DialogContent>
      </Dialog>
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
