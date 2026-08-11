"use client";
import { useState } from "react";
import { Search, ExternalLink } from "lucide-react";
import { useApi } from "@/lib/useApi";
import { Card } from "@/components/dashboard/ui/card";
import { Table, Thead, Th, Tbody, Tr, Td, EmptyState } from "@/components/dashboard/ui/table";
import { SkeletonRow } from "@/components/dashboard/ui/skeleton";
import { Pagination } from "@/components/dashboard/ui/pagination";
import { Topbar } from "@/components/platform-admin/Topbar";
import { VerticalBadge } from "@/components/platform-admin/VerticalBadge";
import { timeAgo } from "@/components/platform-admin/format";

// Leads captured by the personalized /demo generator's optional "email me
// this recording" — no forced gate (see PersonalizedDemoForm.tsx), so this
// is purely a marketing signal, not tenant data. See backend's
// api/routes/admin/demoLeads.ts for the query this reads.
interface DemoLead {
  id: string;
  businessName: string;
  vertical: string;
  email: string;
  service: string | null;
  createdAt: string;
  demoUrl: string;
}

const API_ORIGIN = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.zyncoai.com";

export default function DemoLeadsPage() {
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);

  const query = new URLSearchParams({ page: String(page), ...(q ? { q } : {}) }).toString();
  const { data, isLoading } = useApi<{ leads: DemoLead[]; total: number; pageSize: number }>(`/api/admin/platform/demo-leads?${query}`);

  const totalPages = data ? Math.max(1, Math.ceil(data.total / data.pageSize)) : 1;

  return (
    <div>
      <Topbar title="Demo Leads" />

      <div className="p-6">
        <p className="mb-4 text-sm text-[#6B7280]">Visitors who asked to be emailed their personalized /demo recording.</p>
        <Card>
          <div className="flex items-center gap-2 border-b border-[#E5E7EB] p-4">
            <Search className="h-4 w-4 text-[#9CA3AF]" />
            <input
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setPage(1);
              }}
              placeholder="Search business name or email…"
              className="flex-1 border-none bg-transparent text-sm outline-none"
            />
            {data && <span className="text-xs text-[#9CA3AF]">{data.total} total</span>}
          </div>

          <Table>
            <Thead>
              <tr>
                <Th>Business</Th>
                <Th>Vertical</Th>
                <Th>Email</Th>
                <Th>Service asked for</Th>
                <Th>Captured</Th>
                <Th>Demo</Th>
              </tr>
            </Thead>
            <Tbody>
              {isLoading && Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} cols={6} />)}
              {!isLoading && data?.leads.length === 0 && (
                <tr>
                  <Td colSpan={6}>
                    <EmptyState title="No demo leads yet" description="They'll show up here as soon as a visitor emails themselves a personalized demo recording." />
                  </Td>
                </tr>
              )}
              {!isLoading &&
                data?.leads.map((lead) => (
                  <Tr key={lead.id}>
                    <Td className="font-medium text-[#111827]">{lead.businessName}</Td>
                    <Td><VerticalBadge vertical={lead.vertical} /></Td>
                    <Td>{lead.email}</Td>
                    <Td className="text-[#6B7280]">{lead.service || "—"}</Td>
                    <Td className="text-[#6B7280]">{timeAgo(lead.createdAt)}</Td>
                    <Td>
                      <a
                        href={`${API_ORIGIN}${lead.demoUrl}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[#6366F1] hover:underline"
                      >
                        Listen <ExternalLink className="h-3 w-3" />
                      </a>
                    </Td>
                  </Tr>
                ))}
            </Tbody>
          </Table>

          {data && totalPages > 1 && (
            <div className="border-t border-[#E5E7EB] p-4">
              <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
