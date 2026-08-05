"use client";
import { useParams } from "next/navigation";
import { useDashboard } from "@/components/dashboard/BusinessContext";
import { CallDetailView } from "@/components/calls/CallDetailView";

export default function CallDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { role } = useDashboard();

  return (
    <CallDetailView
      apiBase={`/api/business/calls/${id}`}
      backHref="/dashboard/calls"
      backLabel="Call History"
      canDeleteRecording={role === "OWNER" || role === "ADMIN"}
    />
  );
}
