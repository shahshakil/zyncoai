"use client";
// Phase 6 — Sentiment Heatmap. Universal, same visual language as the Peak
// Rush Heatmap (Phase 3, restaurant) and the AI Operations call-volume
// heatmap — day-of-week x hour-of-day grid, this time colour-coded by
// average sentiment (red = negative, green = positive) instead of volume.
import { Smile } from "lucide-react";
import { useApi } from "@/lib/useApi";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/dashboard/ui/card";
import { Skeleton } from "@/components/dashboard/ui/skeleton";
import { EmptyState } from "@/components/dashboard/ui/table";

interface SentimentPayload {
  ok: boolean;
  summary: { totalAnalyzed: number; positivePct: number; neutralPct: number; negativePct: number };
  heatmap: { grid: (number | null)[][]; counts: number[][] };
  trend: { date: string; avgScore: number | null; count: number }[];
}

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function scoreColor(score: number | null): string {
  if (score === null) return "#f1f5f9";
  // -1 (red) .. 0 (grey) .. +1 (green)
  if (score > 0) return `rgba(22, 163, 74, ${0.15 + Math.min(1, score) * 0.75})`;
  if (score < 0) return `rgba(220, 38, 38, ${0.15 + Math.min(1, -score) * 0.75})`;
  return "#cbd5e1";
}

export default function SentimentHeatmapSection() {
  const { data: resp, isLoading } = useApi<SentimentPayload>("/api/business/sentiment-heatmap", { refreshInterval: 120000 });

  if (isLoading || !resp) return <Skeleton className="h-72 w-full" />;

  const { summary, heatmap } = resp;

  if (summary.totalAnalyzed === 0) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-1.5">
            <Smile className="h-4 w-4 text-amber-500" />
            <CardTitle>Sentiment Heatmap</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <EmptyState title="No calls with transcript in the last 30 days" description="Sentiment is derived from what callers say — this fills in once calls come through." />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-1.5">
          <Smile className="h-4 w-4 text-amber-500" />
          <CardTitle>Sentiment Heatmap</CardTitle>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1 text-[#16a34a]"><span className="h-2 w-2 rounded-sm bg-[#16a34a]" /> {summary.positivePct}% positive</span>
          <span className="flex items-center gap-1 text-[#64748b]"><span className="h-2 w-2 rounded-sm bg-[#cbd5e1]" /> {summary.neutralPct}% neutral</span>
          <span className="flex items-center gap-1 text-[#dc2626]"><span className="h-2 w-2 rounded-sm bg-[#dc2626]" /> {summary.negativePct}% negative</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-[auto_repeat(24,1fr)] gap-[3px]">
          <div />
          {Array.from({ length: 24 }).map((_, h) => (
            <div key={h} className="text-center text-[9px] text-slate-400">{h % 3 === 0 ? h : ""}</div>
          ))}
          {DAYS.map((day, di) => (
            <SentimentRow key={day} day={day} row={heatmap.grid[di]} counts={heatmap.counts[di]} />
          ))}
        </div>
        <p className="mt-3 text-[11px] text-[#94a3b8]">Last 30 days · {summary.totalAnalyzed} calls with transcript analyzed</p>
      </CardContent>
    </Card>
  );
}

function SentimentRow({ day, row, counts }: { day: string; row: (number | null)[]; counts: number[] }) {
  return (
    <>
      <div className="pr-1 text-[10px] text-slate-400">{day}</div>
      {row.map((score, h) => (
        <div
          key={h}
          title={`${day} ${h}:00 — ${counts[h]} calls${score !== null ? `, avg sentiment ${score > 0 ? "+" : ""}${score}` : ""}`}
          className="aspect-square rounded-[2px]"
          style={{ background: scoreColor(score) }}
        />
      ))}
    </>
  );
}
