"use client";
import { useState } from "react";
import Link from "next/link";
import { Search, ShoppingBag } from "lucide-react";
import { useApi } from "@/lib/useApi";
import { useDashboard } from "@/components/dashboard/BusinessContext";
import { getVerticalOps } from "@/lib/verticalOps";
import { VerticalGate } from "@/components/dashboard/VerticalGate";
import { Card } from "@/components/dashboard/ui/card";
import { Button } from "@/components/dashboard/ui/button";
import { Input, Select } from "@/components/dashboard/ui/input";
import { Table, Thead, Th, Tbody, Tr, Td, EmptyState } from "@/components/dashboard/ui/table";
import { SkeletonRow } from "@/components/dashboard/ui/skeleton";
import { StatusBadge } from "@/components/dashboard/ui/badge";
import { Pagination } from "@/components/dashboard/ui/pagination";

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  priceCents: number;
}
interface Order {
  id: string;
  orderNumber: number;
  customerName: string | null;
  customerPhone: string | null;
  totalCents: number;
  status: "PLACED" | "PREPARING" | "READY" | "COLLECTED" | "CANCELLED";
  createdAt: string;
  orderItems: OrderItem[];
}

function money(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

// The gap this closes: the Kitchen board (/dashboard/kitchen) only ever
// shows active orders plus the last hour, and Analytics only shows
// aggregates — neither lets an owner find/search a specific past order.
// That was a real hole in the RESTAURANT core loop (call -> order ->
// status -> history), confirmed by this vertical's own dashboard audit.
function OrderHistoryContent() {
  const { business } = useDashboard();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [page, setPage] = useState(1);

  const query = new URLSearchParams({
    page: String(page),
    pageSize: "20",
    ...(q ? { q } : {}),
    ...(status ? { status } : {}),
    ...(from ? { from } : {}),
    ...(to ? { to } : {}),
  }).toString();
  const { data, isLoading } = useApi<{ data: Order[]; pagination: { totalPages: number } }>(`/api/business/orders/history?${query}`);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-[#0f172a]">Order History</h1>
        <Link href="/dashboard/kitchen"><Button variant="outline" size="sm">Back to Kitchen</Button></Link>
      </div>

      <Card>
        <div className="flex flex-wrap items-center gap-3 border-b border-slate-200 p-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input className="pl-9" placeholder="Search order #, name, or phone…" value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} />
          </div>
          <Select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} className="w-40">
            <option value="">All statuses</option>
            {["PLACED", "PREPARING", "READY", "COLLECTED", "CANCELLED"].map((s) => <option key={s} value={s}>{s}</option>)}
          </Select>
          <Input type="date" value={from} onChange={(e) => { setFrom(e.target.value); setPage(1); }} className="w-40" title="From date" />
          <Input type="date" value={to} onChange={(e) => { setTo(e.target.value); setPage(1); }} className="w-40" title="To date" />
        </div>

        <Table>
          <Thead>
            <tr>
              <Th>Order #</Th>
              <Th>Customer</Th>
              <Th>Items</Th>
              <Th>Total</Th>
              <Th>Status</Th>
              <Th>Placed</Th>
            </tr>
          </Thead>
          <Tbody>
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} cols={6} />)
            ) : data?.data.length ? (
              data.data.map((o) => (
                <Tr key={o.id}>
                  <Td className="font-medium text-slate-900">#{o.orderNumber}</Td>
                  <Td>
                    <p className="text-slate-900">{o.customerName || "—"}</p>
                    <p className="text-xs text-slate-400">{o.customerPhone || ""}</p>
                  </Td>
                  <Td className="text-slate-500">{o.orderItems.map((i) => `${i.quantity}× ${i.name}`).join(", ")}</Td>
                  <Td>{money(o.totalCents)}</Td>
                  <Td><StatusBadge status={o.status} /></Td>
                  <Td className="text-slate-500">{new Date(o.createdAt).toLocaleString("en-AU")}</Td>
                </Tr>
              ))
            ) : null}
          </Tbody>
        </Table>
        {!isLoading && !data?.data.length && <EmptyState icon={ShoppingBag} title="No orders yet" description="Phone orders will show up here once your AI receptionist takes them." />}
      </Card>

      {data && data.pagination.totalPages > 1 && (
        <Pagination page={page} totalPages={data.pagination.totalPages} onPageChange={setPage} />
      )}
    </div>
  );
}

export default function OrderHistoryPage() {
  const { business } = useDashboard();
  const enabled = !!getVerticalOps(business.vertical)?.kitchenEnabled;
  return (
    <VerticalGate enabled={enabled}>
      <OrderHistoryContent />
    </VerticalGate>
  );
}
