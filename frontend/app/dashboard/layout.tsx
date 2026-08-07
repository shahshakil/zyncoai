"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { DashboardGate } from "@/components/dashboard/DashboardGate";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { SessionTimeoutGuard } from "@/components/dashboard/SessionTimeoutGuard";
import { KeyboardShortcuts } from "@/components/dashboard/KeyboardShortcuts";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { TrialBanner } from "@/components/dashboard/TrialBanner";
import { HoldBanner } from "@/components/dashboard/HoldBanner";
import { PastDueBanner } from "@/components/dashboard/PastDueBanner";
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
    if (!canManageBusiness && pathname?.startsWith("/dashboard/billing")) {
      toast.error("Access restricted");
      router.replace("/dashboard");
    }
    if (!canSeeFinancials && pathname?.startsWith("/dashboard/analytics")) {
      router.replace("/dashboard");
    }
  }, [canManageBusiness, canSeeFinancials, pathname, router]);

  // Elite light theme — base tokens are constant across verticals, accent
  // tokens (+ the derived --gradient) come from the business's vertical.
  // Every value here is a real CSS custom property on this wrapper (which,
  // since custom properties inherit, is functionally :root for everything
  // the dashboard renders) — components reference var(--accent-primary) etc
  // directly rather than re-deriving colors themselves.
  const themeVars = {
    "--bg-canvas": "#f8fafc",
    "--bg-card": "#ffffff",
    "--bg-card-hover": "#f8fafc",
    "--border": "#e2e8f0",
    "--border-subtle": "#f1f5f9",
    "--text-primary": "#0f172a",
    "--text-secondary": "#475569",
    "--text-muted": "#94a3b8",
    "--shadow-card": "0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)",
    "--shadow-card-hover": "0 4px 12px rgba(0,0,0,0.1)",
    "--accent": theme.accent,
    "--accent-soft": theme.accentSoft,
    "--sidebar-bg": theme.accentDark,
    "--accent-primary": theme.accentPrimary,
    "--accent-light": theme.accentLight,
    "--accent-border": theme.accentBorder,
    "--accent-text": theme.accentText,
    "--gradient": theme.gradient,
  } as React.CSSProperties;

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--bg-canvas)]" style={themeVars}>
      <SessionTimeoutGuard />
      <KeyboardShortcuts />
      <Sidebar open={sidebarOpen} onClose={onCloseSidebar} />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <TrialBanner business={business} />
        <HoldBanner business={business} />
        <PastDueBanner business={business} />
        <Topbar onMenuClick={onOpenSidebar} />
        <main
          className="flex-1 overflow-y-auto p-4 sm:p-6"
          style={{ backgroundImage: `radial-gradient(${theme.accentPrimary}08 1px, transparent 1px)`, backgroundSize: "20px 20px" }}
        >
          {/* mode="wait" (removed) forced every dashboard navigation to sit
              through the outgoing page's full exit animation before the new
              page even started rendering — a ~150ms+ dead pause on every
              single click, invisible to network/server diagnostics since
              it's pure client-side animation sequencing. Default mode runs
              enter/exit concurrently instead, keeping the fade/shift polish
              without the artificial wait. */}
          <AnimatePresence>
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
        <footer className="no-print shrink-0 border-t border-[var(--border)] bg-[var(--bg-card)] px-4 py-4 text-xs text-[var(--text-muted)] sm:px-6">
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
