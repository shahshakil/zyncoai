"use client";
// Insurance & Claims Management (Part 3) — all claims across all
// patients/customers/clients, filterable by type/status/date/insurer.
// OWNER/ADMIN/STAFF per spec (not DOCTOR — claims management isn't part of
// the doctor portal). Same Claim table doubles as "legal matter" (LAW) or
// "gift voucher" (SALON) depending on vertical — labels/options come from
// VerticalOpsConfig, not hardcoded here.
import { useState } from "react";
import Link from "next/link";
import { Download, Printer, ExternalLink } from "lucide-react";
import { useApi } from "@/lib/useApi";
import { useDashboard } from "@/components/dashboard/BusinessContext";
import { getVerticalOps, claimStatusLabel } from "@/lib/verticalOps";
import { Card } from "@/components/dashboard/ui/card";
import { Button } from "@/components/dashboard/ui/button";
import { Input, Select, Label } from "@/components/dashboard/ui/input";
import { Table, Thead, Th, Tbody, Tr, Td, EmptyState } from "@/components/dashboard/ui/table";
import { Badge } from "@/components/dashboard/ui/badge";
import { exportToExcel, triggerPrint } from "@/lib/exportUtils";

const CLAIM_STATUSES = ["LODGED", "APPROVED", "REJECTED", "PENDING"];
const STATUS_TONE: Record<string, "success" | "warning" | "danger" | "info"> = { APPROVED: "success", PENDING: "warning", LODGED: "info", REJECTED: "danger" };

function money(cents: number): string { return `$${(cents / 100).toFixed(2)}`; }

interface ClaimRow {
  id: string; claimType: string; insurerName: string | null; claimNumber: string | null;
  billedAmountCents: number; approvedAmountCents: number | null; paidAmountCents: number | null; outstandingAmountCents: number;
  status: string; createdAt: string;
  contact: { id: string; name: string | null; phone: string; dob: string | null };
}

export default function ClaimsPage() {
  const { business } = useDashboard();
  const ops = getVerticalOps(business.vertical);
  const [claimType, setClaimType] = useState("");
  const [status, setStatus] = useState("");
  const [insurer, setInsurer] = useState("");

  const qs = new URLSearchParams({ ...(claimType ? { claimType } : {}), ...(status ? { status } : {}), ...(insurer ? { insurer } : {}) }).toString();
  const { data } = useApi<{ ok: boolean; claims: ClaimRow[] }>(ops?.claimsEnabled ? `/api/business/claims?${qs}` : null);

  if (!ops?.claimsEnabled) {
    return <EmptyState title="Not available" description="This section isn't enabled for this business's vertical." />;
  }

  function exportReport() {
    if (!data || !ops) return;
    exportToExcel(
      [{
        name: ops.claimsLabel,
        columns: [
          { key: "patient", label: ops.contactLabel, width: 22 }, { key: "claimType", label: "Type", width: 18 },
          { key: "insurerName", label: ops.claimFieldLabels.insurerName, width: 20 }, { key: "claimNumber", label: ops.claimFieldLabels.claimNumber, width: 16 },
          { key: "billedAmountCents", label: `${ops.claimFieldLabels.billedAmountCents} ($)`, width: 12, align: "right", format: (v) => (v / 100).toFixed(2), total: "sum" },
          { key: "approvedAmountCents", label: `${ops.claimFieldLabels.approvedAmountCents} ($)`, width: 14, align: "right", format: (v) => v != null ? (v / 100).toFixed(2) : "—" },
          { key: "outstandingAmountCents", label: "Outstanding ($)", width: 14, align: "right", format: (v) => (v / 100).toFixed(2), total: "sum" },
          { key: "status", label: "Status", width: 12 },
        ],
        rows: data.claims.map((c) => ({ ...c, patient: c.contact.name || c.contact.phone, status: claimStatusLabel(ops, c.status) })),
        showTotals: true,
      }],
      { businessName: business.name, reportTitle: ops.claimsLabel },
      `${ops.claimsLabel.replace(/\s+/g, "-")}-${new Date().toISOString().slice(0, 10)}.xlsx`
    );
  }

  return (
    <div className="space-y-6">
      <div className="no-print flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-semibold text-slate-900">{ops.claimsLabel}</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={exportReport}><Download className="h-4 w-4" /> Excel</Button>
          <Button variant="outline" size="sm" onClick={() => triggerPrint("print")}><Printer className="h-4 w-4" /> Print</Button>
        </div>
      </div>

      <Card>
        <div className="no-print flex flex-wrap items-end gap-3 border-b border-slate-100 p-4">
          {ops.claimTypes.length > 1 && (
            <div>
              <Label>Type</Label>
              <Select value={claimType} onChange={(e) => setClaimType(e.target.value)} className="w-48">
                <option value="">All types</option>
                {ops.claimTypes.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </Select>
            </div>
          )}
          <div>
            <Label>Status</Label>
            <Select value={status} onChange={(e) => setStatus(e.target.value)} className="w-40">
              <option value="">All statuses</option>
              {CLAIM_STATUSES.map((s) => <option key={s} value={s}>{claimStatusLabel(ops, s)}</option>)}
            </Select>
          </div>
          <div>
            <Label>{ops.claimFieldLabels.insurerName}</Label>
            <Input value={insurer} onChange={(e) => setInsurer(e.target.value)} placeholder="Search…" className="w-56" />
          </div>
        </div>

        <Table>
          <Thead><tr><Th>{ops.contactLabel}</Th><Th>Type</Th><Th>{ops.claimFieldLabels.insurerName}</Th><Th>{ops.claimFieldLabels.billedAmountCents}</Th><Th>{ops.claimFieldLabels.approvedAmountCents}</Th><Th>Outstanding</Th><Th>Status</Th><Th></Th></tr></Thead>
          <Tbody>
            {data?.claims.map((c) => (
              <Tr key={c.id}>
                <Td className="font-medium text-slate-700">{c.contact.name || c.contact.phone}</Td>
                <Td>{ops.claimTypes.find((t) => t.value === c.claimType)?.label || c.claimType.replace(/_/g, " ")}</Td>
                <Td>{c.insurerName || "—"}</Td>
                <Td>{money(c.billedAmountCents)}</Td>
                <Td>{c.approvedAmountCents != null ? money(c.approvedAmountCents) : "—"}</Td>
                <Td>{money(c.outstandingAmountCents)}</Td>
                <Td><Badge tone={STATUS_TONE[c.status] || "default"}>{claimStatusLabel(ops, c.status)}</Badge></Td>
                <Td>
                  <Link href={`/dashboard/contacts/${c.contact.id}`} className="inline-flex items-center gap-1 text-xs text-[var(--accent,#2563eb)] hover:underline">
                    <ExternalLink className="h-3.5 w-3.5" /> {ops.contactLabel} file
                  </Link>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
        {data && !data.claims.length && <EmptyState title={`No ${ops.claimsLabel.toLowerCase()} match these filters`} description={`Add a record from a ${ops.contactLabel.toLowerCase()}'s file to track it here.`} />}
      </Card>
    </div>
  );
}
