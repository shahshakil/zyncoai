"use client";
import { useParams } from "next/navigation";
import { CallDetailView } from "@/components/calls/CallDetailView";
import { Topbar } from "@/components/platform-admin/Topbar";

export default function AdminCallDetailPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="-m-6">
      <Topbar title="Call Detail" />
      <div className="p-6">
        <CallDetailView
          apiBase={`/api/admin/platform/calls/${id}`}
          backHref="/platform-admin/calls"
          backLabel="Calls Analytics"
          // Cross-tenant support access is view/audit only — deleting a
          // business's own call recording is their decision, not admin's.
          canDeleteRecording={false}
          showBusinessName
        />
      </div>
    </div>
  );
}
