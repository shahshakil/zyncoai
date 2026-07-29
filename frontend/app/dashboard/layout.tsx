"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { DashboardGate } from "@/components/dashboard/DashboardGate";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { useDashboard } from "@/components/dashboard/BusinessContext";
import { getVerticalTheme } from "@/components/dashboard/verticalTheme";
import "../print.css";

function ThemedShell({ children, sidebarOpen, onCloseSidebar, onOpenSidebar }: { children: React.ReactNode; sidebarOpen: boolean; onCloseSidebar: () => void; onOpenSidebar: () => void }) {
  const { business, canManageBusiness, canSeeFinancials } = useDashboard();
  const pathname = usePathname();
  const router = useRouter();
  const theme = getVerticalTheme(business.vertical);
  const isMedical = business.vertical === "MEDICAL" || business.vertical === "DENTAL";

  // Settings/billing/integrations are OWNER/ADMIN-only — the backend already
  // 403s these calls for STAFF/DOCTOR, this just avoids showing a broken
  // page if someone lands here directly (e.g. a stale bookmark). Analytics
  // is OWNER/ADMIN-only too (revenue/ROI data) — same reasoning, backend
  // 403s STAFF/DOCTOR via requireBusinessRole on analyticsDashboard.ts.
  useEffect(() => {
    if (!canManageBusiness && pathname?.startsWith("/dashboard/settings")) {
      router.replace("/dashboard");
    }
    if (!canSeeFinancials && pathname?.startsWith("/dashboard/analytics")) {
      router.replace("/dashboard");
    }
  }, [canManageBusiness, canSeeFinancials, pathname, router]);

  return (
    <div
      className="flex h-screen overflow-hidden bg-slate-50"
      style={
        {
          "--accent": theme.accent,
          "--accent-soft": theme.accentSoft,
          "--sidebar-bg": theme.accentDark,
        } as React.CSSProperties
      }
    >
      <Sidebar open={sidebarOpen} onClose={onCloseSidebar} />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Topbar onMenuClick={onOpenSidebar} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
            >
              <ErrorBoundary>{children}</ErrorBoundary>
            </motion.div>
          </AnimatePresence>
        </main>
        <footer className="no-print shrink-0 border-t border-slate-200 bg-white px-4 py-4 text-xs text-slate-400 sm:px-6">
          <p>
            {isMedical
              ? "ZyncoAI complies with the Australian Privacy Act 1988, My Health Records Act 2012, and applicable healthcare regulations."
              : "ZyncoAI complies with the Australian Privacy Act 1988 and applicable industry regulations."}
          </p>
          <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1">
            <a href="/privacy" className="hover:text-slate-600">Privacy Policy</a>
            <a href="/terms" className="hover:text-slate-600">Terms of Service</a>
            <a href="/legal/dpa" className="hover:text-slate-600">Data Processing Agreement</a>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <DashboardGate>
      <ThemedShell sidebarOpen={sidebarOpen} onCloseSidebar={() => setSidebarOpen(false)} onOpenSidebar={() => setSidebarOpen(true)}>
        {children}
      </ThemedShell>
    </DashboardGate>
  );
}
