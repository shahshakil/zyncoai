"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Search, Bell } from "lucide-react";
import { useApi } from "@/lib/useApi";
import { timeAgo } from "./format";

interface BusinessHit { id: string; name: string; phoneNumber: string; vertical: string; status: string }

function SydneyClock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  const time = now.toLocaleTimeString("en-AU", { timeZone: "Australia/Sydney", hour: "2-digit", minute: "2-digit", second: "2-digit" });
  return <span className="hidden text-xs tabular-nums text-[#9CA3AF] lg:inline">{time} AEST/AEDT</span>;
}

function RefreshCountdown({ lastUpdated, refreshIntervalMs }: { lastUpdated: Date; refreshIntervalMs: number }) {
  const [, forceTick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => forceTick((n) => n + 1), 1000);
    return () => clearInterval(t);
  }, []);
  const elapsed = Date.now() - lastUpdated.getTime();
  const remainingSec = Math.max(0, Math.round((refreshIntervalMs - elapsed) / 1000));
  return <span className="hidden text-xs text-[#9CA3AF] sm:inline">· refreshes in {remainingSec}s</span>;
}

export function Topbar({ title, lastUpdated, refreshIntervalMs = 30000 }: { title: string; lastUpdated?: Date | null; refreshIntervalMs?: number }) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);
  const [, forceTick] = useState(0);

  const { data: me } = useApi<{ admin: { email: string; name?: string | null } }>("/api/admin-auth/me");
  const admin = me?.admin || null;

  const { data } = useApi<{ data: BusinessHit[] }>(q.trim().length >= 2 ? `/api/admin/platform/businesses?q=${encodeURIComponent(q)}&pageSize=8` : null);
  // Bell badge is wired to real system health, not a fake unread count —
  // it lights up when any service in /health reports unhealthy.
  const { data: health } = useApi<{ allHealthy: boolean; services: { name: string; ok: boolean }[] }>("/api/admin/platform/health", { refreshInterval: 15000 });
  const unhealthyCount = health ? health.services.filter((s) => !s.ok).length : 0;

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  useEffect(() => {
    const t = setInterval(() => forceTick((n) => n + 1), 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <header className="no-print sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-[#E5E7EB] bg-white/90 px-6 backdrop-blur">
      <h1 className="shrink-0 text-lg font-semibold text-[#1F2937]">{title}</h1>

      <div ref={boxRef} className="relative mx-auto w-full max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]" />
        <input
          value={q}
          onChange={(e) => { setQ(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          placeholder="Search businesses across the platform…"
          className="h-9 w-full rounded-lg border border-[#E5E7EB] bg-[#F8F9FA] pl-9 pr-3 text-sm text-[#1F2937] placeholder:text-[#9CA3AF] focus:border-[#6366F1] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6366F1]/20"
        />
        {open && q.trim().length >= 2 && (
          <div className="absolute left-0 right-0 top-11 max-h-80 overflow-y-auto rounded-xl border border-[#E5E7EB] bg-white p-1.5 shadow-xl">
            {data?.data.length ? (
              data.data.map((b) => (
                <Link
                  key={b.id}
                  href={`/platform-admin/businesses?open=${b.id}`}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between rounded-lg px-3 py-2 text-sm hover:bg-[#F8F9FA]"
                >
                  <span className="text-[#1F2937]">{b.name}</span>
                  <span className="text-xs text-[#9CA3AF]">{b.phoneNumber}</span>
                </Link>
              ))
            ) : (
              <p className="px-3 py-2 text-sm text-[#9CA3AF]">No businesses match &quot;{q}&quot;</p>
            )}
          </div>
        )}
      </div>

      <div className="ml-auto flex shrink-0 items-center gap-4">
        <SydneyClock />
        {lastUpdated && (
          <span className="hidden items-center gap-1 text-xs text-[#9CA3AF] sm:inline-flex">
            Stats updated {timeAgo(lastUpdated)}
            <RefreshCountdown lastUpdated={lastUpdated} refreshIntervalMs={refreshIntervalMs} />
          </span>
        )}
        <Link href="/platform-admin/health" title={unhealthyCount ? `${unhealthyCount} service(s) need attention` : "All systems healthy"} className="relative text-[#6B7280] hover:text-[#1F2937]">
          <Bell className="h-5 w-5" />
          {unhealthyCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#EF4444] text-[9px] font-bold text-white">
              {unhealthyCount}
            </span>
          )}
        </Link>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] text-xs font-semibold text-white">
            {(admin?.name || admin?.email || "A").slice(0, 1).toUpperCase()}
          </div>
          <span className="hidden text-sm font-medium text-[#1F2937] md:inline">{admin?.name || admin?.email}</span>
        </div>
      </div>
    </header>
  );
}
