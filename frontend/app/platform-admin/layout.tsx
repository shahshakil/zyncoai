"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { AlertTriangle } from "lucide-react";
import { Sidebar } from "@/components/platform-admin/Sidebar";
import { useApi } from "@/lib/useApi";

const PAGE_TITLES: Record<string, string> = {
  "/platform-admin": "Command Centre",
  "/platform-admin/businesses": "Businesses",
  "/platform-admin/tenants": "Tenant & Staff Registry",
  "/platform-admin/calls": "Calls Analytics",
  "/platform-admin/revenue": "Revenue & Profit",
  "/platform-admin/costs": "Cost Tracking",
  "/platform-admin/invoices": "Invoices",
  "/platform-admin/tax": "Tax & BAS",
  "/platform-admin/health": "System Health",
  "/platform-admin/audit": "Audit Log",
  "/platform-admin/notifications": "Notifications Centre",
  "/platform-admin/settings": "Platform Settings",
  "/platform-admin/infrastructure": "Infrastructure",
  "/platform-admin/ai-engine": "AI Engine",
  "/platform-admin/fraud": "Fraud Monitor",
  "/platform-admin/security": "Security",
  "/platform-admin/alerts": "Alert Inbox",
};

function SitewideHealthBanner() {
  const { data } = useApi<{ allHealthy: boolean; services: { name: string; ok: boolean }[] }>("/api/admin/platform/health", { refreshInterval: 15000 });
  if (!data || data.allHealthy) return null;
  const down = data.services.filter((s) => !s.ok).map((s) => s.name);
  return (
    <div className="no-print flex items-center gap-2 border-b border-[#FCA5A5] bg-[#FEF2F2] px-6 py-2 text-sm font-medium text-[#991B1B]">
      <AlertTriangle className="h-4 w-4 shrink-0" />
      {down.join(", ")} {down.length > 1 ? "are" : "is"} degraded or unreachable — see System Health for details.
    </div>
  );
}

export default function PlatformAdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isLogin = pathname === "/platform-admin/login";
  const [checked, setChecked] = useState(isLogin);
  const [admin, setAdmin] = useState<{ email: string; name?: string | null } | null>(null);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (isLogin) return;
    (async () => {
      const r = await fetch("/api/admin-auth/me", { credentials: "include" });
      if (!r.ok) {
        router.replace("/platform-admin/login");
        return;
      }
      const data = await r.json();
      setAdmin(data.admin);
      setChecked(true);
    })();
  }, [isLogin, router]);

  async function logout() {
    await fetch("/api/admin-auth/logout", { method: "POST" });
    toast.success("Signed out");
    router.push("/platform-admin/login");
  }

  if (isLogin) return <>{children}</>;

  if (!checked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8F9FA]">
        <p className="text-sm text-[#9CA3AF]">Checking access…</p>
      </div>
    );
  }

  const title = PAGE_TITLES[pathname || ""] || "Platform Admin";

  return (
    <div className="min-h-screen bg-[#F8F9FA]" style={{ ["--accent" as any]: "#6366F1" }}>
      <style jsx global>{`
        @media print {
          .no-print { display: none !important; }
          .admin-content-shell { margin-left: 0 !important; }
          body { background: white !important; }
        }
      `}</style>
      <Sidebar admin={admin} onLogout={logout} collapsed={collapsed} setCollapsed={setCollapsed} />
      <div className="admin-content-shell transition-[margin] duration-200" style={{ marginLeft: collapsed ? 72 : 240 }}>
        <SitewideHealthBanner />
        {/* Each page renders its own Topbar so it can pass a page-specific
            lastUpdated timestamp sourced from its own data fetch. */}
        <main className="p-6" data-admin-title={title}>{children}</main>
      </div>
    </div>
  );
}
