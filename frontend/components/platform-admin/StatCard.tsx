"use client";
import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownRight, LucideIcon } from "lucide-react";

export function StatCard({
  label, value, icon: Icon, gradient, trend, sublabel, loading,
}: {
  label: string;
  value: string;
  icon: LucideIcon;
  gradient: string;
  trend?: { value: string; positive: boolean } | null;
  sublabel?: string;
  loading?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.18 }}
      className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="flex items-start justify-between">
        <div
          className="flex h-11 w-11 items-center justify-center rounded-xl text-white shadow-sm"
          style={{ background: gradient }}
        >
          <Icon className="h-5 w-5" />
        </div>
        {trend && (
          <span className={`flex items-center gap-0.5 text-xs font-semibold ${trend.positive ? "text-[#10B981]" : "text-[#EF4444]"}`}>
            {trend.positive ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
            {trend.value}
          </span>
        )}
      </div>
      <p className="mt-4 text-xs font-medium uppercase tracking-wide text-[#6B7280]">{label}</p>
      {loading ? (
        <div className="mt-2 h-8 w-24 animate-pulse rounded-md bg-slate-200/70" />
      ) : (
        <p className="mt-1 text-2xl font-bold text-[#1F2937]">{value}</p>
      )}
      {sublabel && <p className="mt-1 text-xs text-[#9CA3AF]">{sublabel}</p>}
    </motion.div>
  );
}
