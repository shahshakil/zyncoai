"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Building2, PhoneCall, CalendarCheck, DollarSign, PhoneMissed, UserPlus, Bell, BellOff, FileText } from "lucide-react";
import { useApi } from "@/lib/useApi";
import { Card, CardHeader, CardTitle } from "@/components/dashboard/ui/card";
import { Topbar } from "@/components/platform-admin/Topbar";
import { StatCard } from "@/components/platform-admin/StatCard";
import { GradientAreaChart, GradientBarChart, DonutChart } from "@/components/platform-admin/charts";
import { formatNumber, formatCents, timeAgo, activityDotColor, VERTICAL_ICONS } from "@/components/platform-admin/format";
import { TranscriptModal } from "@/components/platform-admin/TranscriptModal";

interface Stats {
  totalBusinesses: number; activeBusinesses: number; suspendedBusinesses: number;
  totalCalls: number; callsToday: number; callsYesterday: number; bookingsToday: number; bookingsYesterday: number;
  newBusinessesThisWeek: number; newBusinessesPriorWeek: number;
  platformRevenueThisMonthCents: number; billingConfigured: boolean;
}
interface ActivityItem {
  type: "call" | "booking" | "signup" | "callback" | "emergency" | "abandoned";
  businessName: string; businessVertical: string; text: string; urgent: boolean; callId: string | null; at: string;
}
interface CommandCentre {
  signups30d: { date: string; count: number }[];
  calls30d: { date: string; count: number }[];
  outcomeBreakdown: { outcome: string; count: number }[];
  topBusinesses: { id: string; name: string; calls: number }[];
  activity: ActivityItem[];
}

function pctTrend(today: number, yesterday: number): { value: string; positive: boolean } | null {
  if (!yesterday) return null;
  const pct = Math.round(((today - yesterday) / yesterday) * 100);
  return { value: `${pct > 0 ? "+" : ""}${pct}% vs yesterday`, positive: pct >= 0 };
}

// Short synthesized "ding" so the sound toggle doesn't need a bundled audio
// asset — two quick sine-wave blips via the Web Audio API.
function playBookingChime() {
  try {
    const Ctx = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new Ctx();
    const now = ctx.currentTime;
    [880, 1320].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.001, now + i * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.15, now + i * 0.12 + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.12 + 0.18);
      osc.connect(gain).connect(ctx.destination);
      osc.start(now + i * 0.12);
      osc.stop(now + i * 0.12 + 0.2);
    });
  } catch {
    // Web Audio unavailable/blocked — silently skip, this is a nice-to-have.
  }
}

export default function CommandCentrePage() {
  const { data: stats, isLoading: statsLoading } = useApi<Stats & { stale?: boolean }>("/api/admin/platform/stats", { refreshInterval: 30000 });
  const { data: cc } = useApi<CommandCentre & { stale?: boolean }>("/api/admin/platform/command-centre", { refreshInterval: 30000 });

  const [soundOn, setSoundOn] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [transcriptCallId, setTranscriptCallId] = useState<string | null>(null);
  const feedRef = useRef<HTMLDivElement>(null);
  const seenKeys = useRef<Set<string>>(new Set());
  const firstLoad = useRef(true);

  useEffect(() => {
    setSoundOn(localStorage.getItem("admin-feed-sound") === "1");
  }, []);
  function toggleSound() {
    setSoundOn((v) => {
      localStorage.setItem("admin-feed-sound", v ? "0" : "1");
      return !v;
    });
  }

  // Detects genuinely new booking events across polls (not just "list
  // changed") so the chime only fires once per real event, not on every
  // 30s re-render.
  useEffect(() => {
    if (!cc) return;
    const currentKeys = new Set(cc.activity.map((a) => `${a.businessName}-${a.at}-${a.text}`));
    if (!firstLoad.current) {
      const isNewBooking = cc.activity.some((a) => a.type === "booking" && !seenKeys.current.has(`${a.businessName}-${a.at}-${a.text}`));
      if (isNewBooking && soundOn) playBookingChime();
      if (!hovering && feedRef.current) feedRef.current.scrollTop = 0;
    }
    seenKeys.current = currentKeys;
    firstLoad.current = false;
  }, [cc, soundOn, hovering]);

  const bookingsTrend = pctTrend(stats?.bookingsToday || 0, stats?.bookingsYesterday || 0);
  const callsTrend = pctTrend(stats?.callsToday || 0, stats?.callsYesterday || 0);
  const signupsTrend = pctTrend(stats?.newBusinessesThisWeek || 0, stats?.newBusinessesPriorWeek || 0);

  const topMax = Math.max(1, ...(cc?.topBusinesses.map((b) => b.calls) || [1]));

  return (
    <div className="-m-6">
      <Topbar title="Command Centre" lastUpdated={stats ? new Date() : null} refreshIntervalMs={30000} />
      <div className="space-y-6 p-6">
        {stats?.stale && <StaleBanner />}

        <div className={`grid grid-cols-1 gap-4 sm:grid-cols-2 ${stats?.billingConfigured ? "lg:grid-cols-5" : "lg:grid-cols-4"}`}>
          <StatCard
            label="Active Businesses" loading={statsLoading}
            value={formatNumber(stats?.activeBusinesses || 0)}
            icon={Building2} gradient="linear-gradient(135deg,#6366F1,#8B5CF6)"
            sublabel={`${formatNumber(stats?.totalBusinesses || 0)} total`}
          />
          <StatCard
            label="Calls Today" loading={statsLoading}
            value={formatNumber(stats?.callsToday || 0)}
            icon={PhoneCall} gradient="linear-gradient(135deg,#10B981,#34D399)"
            trend={callsTrend} sublabel={callsTrend ? undefined : "across all businesses"}
          />
          <StatCard
            label="Bookings Today" loading={statsLoading}
            value={formatNumber(stats?.bookingsToday || 0)}
            icon={CalendarCheck} gradient="linear-gradient(135deg,#3B82F6,#60A5FA)"
            trend={bookingsTrend}
          />
          <StatCard
            label="New Signups This Week" loading={statsLoading}
            value={formatNumber(stats?.newBusinessesThisWeek || 0)}
            icon={UserPlus} gradient="linear-gradient(135deg,#F59E0B,#FBBF24)"
            trend={signupsTrend}
          />
          {stats?.billingConfigured && (
            <StatCard
              label="Platform Revenue (Month)" loading={statsLoading}
              value={formatCents(stats?.platformRevenueThisMonthCents || 0)}
              icon={DollarSign} gradient="linear-gradient(135deg,#10B981,#059669)"
            />
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader><CardTitle>New Signups — Last 30 Days</CardTitle></CardHeader>
            <div className="p-4">
              {cc ? <GradientAreaChart data={cc.signups30d} color="#6366F1" /> : <ChartSkeleton />}
            </div>
          </Card>
          <Card>
            <CardHeader><CardTitle>Total Calls — Last 30 Days</CardTitle></CardHeader>
            <div className="p-4">
              {cc ? <GradientBarChart data={cc.calls30d} color="#3B82F6" /> : <ChartSkeleton />}
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[2fr_1.2fr_1.2fr]">
          <Card>
            <div className="flex items-center justify-between border-b border-[#E5E7EB] px-4 py-3">
              <CardTitle>Live Activity Feed</CardTitle>
              <button
                onClick={toggleSound}
                title={soundOn ? "Mute booking sound" : "Play a sound on new bookings"}
                className={`flex h-7 w-7 items-center justify-center rounded-md ${soundOn ? "bg-[#EEF2FF] text-[#6366F1]" : "text-[#9CA3AF] hover:bg-[#F8F9FA]"}`}
              >
                {soundOn ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
              </button>
            </div>
            <div
              ref={feedRef}
              onMouseEnter={() => setHovering(true)}
              onMouseLeave={() => setHovering(false)}
              className="max-h-96 space-y-1 overflow-y-auto p-3"
            >
              {cc?.activity.map((a, i) => {
                const VIcon = VERTICAL_ICONS[a.businessVertical] || Building2;
                return (
                  <motion.div
                    key={i} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.02 }}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-[#F8F9FA]"
                  >
                    <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: activityDotColor(a.type) }} />
                    <VIcon className="h-3.5 w-3.5 shrink-0 text-[#9CA3AF]" />
                    <span className="flex-1 truncate text-[#1F2937]"><span className="font-medium">{a.businessName}</span> — {a.text}</span>
                    {a.callId && (
                      <button onClick={() => setTranscriptCallId(a.callId)} className="flex shrink-0 items-center gap-1 text-xs text-[#6366F1] hover:underline">
                        <FileText className="h-3 w-3" /> View call
                      </button>
                    )}
                    <span className="shrink-0 text-xs text-[#9CA3AF]">{timeAgo(a.at)}</span>
                  </motion.div>
                );
              })}
              {cc && !cc.activity.length && <p className="p-3 text-sm text-[#9CA3AF]">No recent activity.</p>}
              {!cc && <ChartSkeleton height={200} />}
            </div>
          </Card>

          <Card>
            <CardHeader><CardTitle>Calls by Outcome</CardTitle></CardHeader>
            <div className="p-4">
              {cc ? <DonutChart data={cc.outcomeBreakdown} height={200} /> : <ChartSkeleton height={200} />}
            </div>
          </Card>

          <Card>
            <CardHeader><CardTitle>Top Businesses by Calls</CardTitle></CardHeader>
            <div className="space-y-3 p-4">
              {cc?.topBusinesses.map((b, i) => (
                <Link key={b.id} href={`/platform-admin/businesses?open=${b.id}`} className="block">
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-[#1F2937]">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#EEF2FF] text-[10px] font-bold text-[#6366F1]">{i + 1}</span>
                      {b.name}
                    </span>
                    <span className="font-semibold text-[#1F2937]">{b.calls}</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#F1F5F9]">
                    <div className="h-full rounded-full bg-gradient-to-r from-[#6366F1] to-[#8B5CF6]" style={{ width: `${(b.calls / topMax) * 100}%` }} />
                  </div>
                </Link>
              ))}
              {cc && !cc.topBusinesses.length && <p className="text-sm text-[#9CA3AF]">No calls yet.</p>}
              {!cc && <ChartSkeleton height={160} />}
            </div>
          </Card>
        </div>
      </div>

      <TranscriptModal callId={transcriptCallId} onClose={() => setTranscriptCallId(null)} />
    </div>
  );
}

function ChartSkeleton({ height = 240 }: { height?: number }) {
  return <div className="animate-pulse rounded-lg bg-slate-100" style={{ height }} />;
}

function StaleBanner() {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-[#FDE68A] bg-[#FFFBEB] px-4 py-2 text-sm text-[#92400E]">
      <PhoneMissed className="h-4 w-4" /> Data may be delayed — showing the last known values while we reconnect.
    </div>
  );
}
