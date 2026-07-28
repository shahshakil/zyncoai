import { CheckCircle2, XCircle, Mail } from "lucide-react";
import { ResourcePageShell, ResourceSection } from "@/components/marketing/receptionist/ResourcePageShell";
import { getApiHealth } from "@/lib/marketing-api";

export const metadata = {
  title: "System Status | ZyncoAI",
  description: "Live status of ZyncoAI's core platform.",
};

export default async function StatusPage() {
  const api = await getApiHealth();
  const ok = Boolean(api?.ok);

  return (
    <ResourcePageShell eyebrow="Resources" title="System Status" description="Live status, checked on every page load.">
      <ResourceSection title="Core platform">
        <div className="flex items-center justify-between rounded-xl border border-white/10 bg-[#030712] p-4">
          <div>
            <p className="font-medium text-[#f8fafc]">API & Voice Platform</p>
            <p className="mt-1 text-xs text-[#94a3b8]">Covers call answering, the dashboard API, and booking sync.</p>
          </div>
          <span className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${ok ? "bg-emerald-500/15 text-[#bbf7d0]" : "bg-red-500/15 text-[#fecaca]"}`}>
            {ok ? <CheckCircle2 className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
            {ok ? "Operational" : "Unavailable"}
          </span>
        </div>
        <p className="text-xs text-[#94a3b8]">
          We check the core API on every load of this page — that&apos;s a live signal, not a cached status page. Granular per-component status (voice gateway,
          booking engine individually) isn&apos;t broken out publicly yet.
        </p>
      </ResourceSection>

      <ResourceSection title="Subscribe to updates">
        <p>We don&apos;t yet have automated status-update emails. For now, email us and we&apos;ll add you to the list directly.</p>
        <a href="mailto:support@zyncoai.com?subject=Status%20updates" className="inline-flex items-center gap-1.5 text-sm font-medium text-[#8ab4ff] hover:underline">
          <Mail className="h-4 w-4" /> support@zyncoai.com
        </a>
      </ResourceSection>
    </ResourcePageShell>
  );
}
