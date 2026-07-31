"use client";
import { useState } from "react";
import { toast } from "sonner";
import { useApi, apiPost } from "@/lib/useApi";
import { Card } from "@/components/dashboard/ui/card";
import { Badge } from "@/components/dashboard/ui/badge";
import { Button } from "@/components/dashboard/ui/button";
import { Table, Thead, Tbody, Tr, Th, Td, EmptyState } from "@/components/dashboard/ui/table";
import { Topbar } from "@/components/platform-admin/Topbar";

interface ReferralRow {
  id: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
  decidedAt: string | null;
  referrerBusiness: { id: string; name: string };
  newBusiness: { id: string; name: string; createdAt: string };
}

const STATUS_TONE: Record<string, "success" | "warning" | "danger"> = { PENDING: "warning", APPROVED: "success", REJECTED: "danger" };

export default function ReferralsPage() {
  const { data, mutate } = useApi<{ referrals: ReferralRow[] }>("/api/admin/platform/referrals");
  const [busyId, setBusyId] = useState<string | null>(null);

  async function decide(id: string, action: "approve" | "reject") {
    setBusyId(id);
    try {
      await apiPost(`/api/admin/platform/referrals/${id}/${action}`);
      toast.success(action === "approve" ? "Referral approved — $50 credit applied" : "Referral rejected");
      mutate();
    } catch {
      toast.error(`Could not ${action} referral`);
    } finally {
      setBusyId(null);
    }
  }

  const referrals = data?.referrals || [];

  return (
    <div className="-m-6">
      <Topbar title="Referrals" />
      <div className="space-y-6 p-6">
        <Card className="p-4">
          <p className="text-sm text-[#374151]">
            New signups via a referral link get 20% off their first month automatically. Approving a referral here
            applies a $50 credit to the referrer&apos;s next invoice.
          </p>
        </Card>

        <Card>
          {referrals.length === 0 ? (
            <EmptyState title="No referrals yet" description="Referrals appear here once a business signs up via another business's referral link." />
          ) : (
            <Table>
              <Thead>
                <Tr><Th>Referrer</Th><Th>New business</Th><Th>Signed up</Th><Th>Status</Th><Th></Th></Tr>
              </Thead>
              <Tbody>
                {referrals.map((r) => (
                  <Tr key={r.id}>
                    <Td>{r.referrerBusiness.name}</Td>
                    <Td>{r.newBusiness.name}</Td>
                    <Td>{new Date(r.newBusiness.createdAt).toLocaleDateString()}</Td>
                    <Td><Badge tone={STATUS_TONE[r.status]}>{r.status.toLowerCase()}</Badge></Td>
                    <Td>
                      {r.status === "PENDING" && (
                        <div className="flex gap-2">
                          <Button size="sm" disabled={busyId === r.id} onClick={() => decide(r.id, "approve")}>Approve</Button>
                          <Button size="sm" variant="outline" disabled={busyId === r.id} onClick={() => decide(r.id, "reject")}>Reject</Button>
                        </div>
                      )}
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          )}
        </Card>
      </div>
    </div>
  );
}
