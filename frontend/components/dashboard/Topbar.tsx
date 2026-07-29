"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Menu, LogOut, ChevronDown, Search, Maximize, Minimize, Bell, Settings as SettingsIcon, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useDashboard } from "./BusinessContext";
import { Badge } from "./ui/badge";
import { getVerticalTheme } from "./verticalTheme";

interface SearchResults {
  contacts: { id: string; name: string | null; phone: string }[];
  appointments: { id: string; startAt: string; recordType: string | null; contactName: string | null; providerName: string | null }[];
  calls: { id: string; startedAt: string; outcome: string | null; contactName: string | null; transcriptSnippet: string | null }[];
}

function highlightSnippet(text: string, q: string): string {
  const idx = text.toLowerCase().indexOf(q.toLowerCase());
  if (idx === -1) return text.length > 80 ? text.slice(0, 80) + "…" : text;
  const start = Math.max(0, idx - 30);
  const end = Math.min(text.length, idx + q.length + 30);
  return `${start > 0 ? "…" : ""}${text.slice(start, end)}${end < text.length ? "…" : ""}`;
}

const ROLE_LABEL: Record<string, string> = { OWNER: "Owner", ADMIN: "Admin", STAFF: "Staff", DOCTOR: "Doctor" };

function GlobalSearch() {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<SearchResults | null>(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  useEffect(() => {
    if (q.trim().length < 2) {
      setResults(null);
      return;
    }
    setLoading(true);
    const t = setTimeout(async () => {
      try {
        const r = await fetch(`/api/business/search?q=${encodeURIComponent(q)}`, { credentials: "include" });
        const data = await r.json();
        setResults(data);
        setOpen(true);
      } catch {
        // silent — search is a convenience affordance, not critical path
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(t);
  }, [q]);

  const hasResults = results && (results.contacts.length || results.appointments.length || results.calls.length);

  return (
    <div ref={boxRef} className="relative hidden w-full max-w-sm sm:block">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        onFocus={() => q.length >= 2 && setOpen(true)}
        placeholder="Search patients, bookings, calls…"
        className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-8 text-sm text-slate-900 outline-none transition focus:border-[var(--accent,#4f46e5)]/50 focus:bg-white focus:ring-2 focus:ring-[var(--accent,#4f46e5)]/20"
      />
      {loading && <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-slate-400" />}

      {open && q.trim().length >= 2 && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-96 overflow-y-auto rounded-xl border border-slate-200 bg-white p-2 shadow-xl">
          {!hasResults && !loading && <p className="px-3 py-4 text-center text-sm text-slate-400">No results for &ldquo;{q}&rdquo;</p>}

          {results && results.contacts.length > 0 && (
            <div className="mb-1">
              <p className="px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400">Patients</p>
              {results.contacts.map((c) => (
                <button
                  key={c.id}
                  onClick={() => { router.push(`/dashboard/contacts/${c.id}`); setOpen(false); setQ(""); }}
                  className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm hover:bg-slate-50"
                >
                  <span className="text-slate-800">{c.name || "Unnamed"}</span>
                  <span className="text-xs text-slate-400">{c.phone}</span>
                </button>
              ))}
            </div>
          )}

          {results && results.appointments.length > 0 && (
            <div className="mb-1">
              <p className="px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400">Bookings</p>
              {results.appointments.map((a) => (
                <button
                  key={a.id}
                  onClick={() => { router.push(`/dashboard/bookings`); setOpen(false); setQ(""); }}
                  className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm hover:bg-slate-50"
                >
                  <span className="text-slate-800">{a.contactName || "Unknown"} — {a.recordType || "Appointment"}</span>
                  <span className="text-xs text-slate-400">{new Date(a.startAt).toLocaleDateString()}</span>
                </button>
              ))}
            </div>
          )}

          {results && results.calls.length > 0 && (
            <div>
              <p className="px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400">Calls</p>
              {results.calls.map((c) => (
                <button
                  key={c.id}
                  onClick={() => { router.push(`/dashboard/calls`); setOpen(false); setQ(""); }}
                  className="flex w-full flex-col rounded-lg px-3 py-2 text-left text-sm hover:bg-slate-50"
                >
                  <span className="flex w-full items-center justify-between">
                    <span className="text-slate-800">{c.contactName || "Unknown"}</span>
                    <span className="text-xs text-slate-400">{c.outcome?.replace(/_/g, " ") || "—"}</span>
                  </span>
                  {c.transcriptSnippet && (
                    <span className="mt-0.5 truncate text-xs italic text-slate-400">&ldquo;{highlightSnippet(c.transcriptSnippet, q)}&rdquo;</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  const { user, business, role, providerName, canManageBusiness } = useDashboard();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const theme = getVerticalTheme(business.vertical);

  useEffect(() => {
    const onChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  function toggleFullscreen() {
    if (document.fullscreenElement) document.exitFullscreen();
    else document.documentElement.requestFullscreen().catch(() => {});
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
    toast.success("Signed out");
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="no-print sticky top-0 z-30 flex h-14 items-center justify-between gap-4 border-b border-[var(--border,#e2e8f0)] bg-white/80 px-4 backdrop-blur-md">
      <div className="flex flex-1 items-center gap-3">
        <button onClick={onMenuClick} className="text-slate-500 hover:text-slate-900 lg:hidden">
          <Menu className="h-5 w-5" />
        </button>
        <GlobalSearch />
        <div className="hidden items-center gap-2 md:flex">
          <span className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium" style={{ background: "var(--accent-light)", color: "var(--accent-text)", borderColor: "var(--accent-border)" }}>
            <span className="mr-1">{theme.icon}</span>
            {theme.badge}
          </span>
          {business.status === "SUSPENDED" && <Badge tone="danger">suspended</Badge>}
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        <button onClick={toggleFullscreen} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700" title="Toggle fullscreen">
          {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
        </button>
        <button className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700" title="Notifications">
          <Bell className="h-4 w-4" />
        </button>
        {canManageBusiness && (
          <Link href="/dashboard/settings" className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700" title="Settings">
            <SettingsIcon className="h-4 w-4" />
          </Link>
        )}

        <div className="relative ml-1">
          <button onClick={() => setOpen((v) => !v)} className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-slate-600 hover:bg-slate-100">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--accent-soft,#eef2ff)] text-xs font-semibold text-[var(--accent,#4f46e5)]">
              {(user.name || user.email || "?").charAt(0).toUpperCase()}
            </div>
            <span className="hidden text-left sm:block">
              <span className="block text-sm leading-tight text-slate-800">{user.name || user.email}</span>
              <span className="block text-[11px] leading-tight text-slate-400">{ROLE_LABEL[role] || role}{providerName ? ` · ${providerName}` : ""}</span>
            </span>
            <ChevronDown className="h-3.5 w-3.5" />
          </button>
          {open && (
            <div className="absolute right-0 mt-2 w-44 rounded-lg border border-slate-200 bg-white py-1 shadow-xl">
              <button onClick={logout} className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900">
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
