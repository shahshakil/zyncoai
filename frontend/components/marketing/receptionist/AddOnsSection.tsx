"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import posthog from "posthog-js";
import { motion } from "framer-motion";
import { Lock, Video, Star, Languages, PhoneOutgoing, MessagesSquare, Building2 } from "lucide-react";
import { ADD_ONS, PRICING_PLANS } from "./data";

const ICONS: Record<string, any> = { telehealth: Video, reviews: Star, multilingual: Languages, recalls: PhoneOutgoing, "comms-hub": MessagesSquare, multisite: Building2 };

export function AddOnsSection({ showTitle = true }: { showTitle?: boolean }) {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [added, setAdded] = useState<Set<string>>(new Set());

  useEffect(() => {
    setSelectedPlan(sessionStorage.getItem("zynco_selected_plan"));
    posthog.capture("addon_page_viewed", {});
  }, []);

  const planName = PRICING_PLANS.find((p) => p.key === selectedPlan)?.name;

  function addToPlan(key: string) {
    setAdded((s) => new Set(s).add(key));
    posthog.capture("addon_clicked", { addon: key });
    toast.success("Added — we'll include this when your account is provisioned");
  }

  return (
    <section className="py-20">
      {showTitle && (
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-[#0f172a] sm:text-4xl">Supercharge your plan</h2>
          <p className="mt-3 text-[#475569]">Optional extras — purchase after selecting a plan</p>
        </div>
      )}

      {!selectedPlan && (
        <p className="mx-auto mt-6 max-w-md text-center text-xs text-[#94a3b8]">
          Add-ons require an active plan subscription.{" "}
          <a href="/pricing" className="text-[#6366f1] hover:underline">Choose a plan</a> to unlock them.
        </p>
      )}
      {selectedPlan && (
        <p className="mx-auto mt-6 max-w-md text-center text-xs text-[#10b981]">Unlocked with your {planName} plan.</p>
      )}

      <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {ADD_ONS.map((a, i) => {
          const Icon = ICONS[a.key];
          const locked = !selectedPlan;
          const isAdded = added.has(a.key);
          return (
            <motion.div
              key={a.key}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.05 }}
              className={`relative rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.04)] ${locked ? "opacity-70" : ""}`}
            >
              {locked && (
                <span title="Select a plan first to unlock add-ons" className="absolute right-4 top-4 text-[#94a3b8]">
                  <Lock className="h-4 w-4" />
                </span>
              )}
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#06b6d4]/15">
                <Icon className="h-5 w-5 text-[#0e7490]" />
              </div>
              <h3 className="mt-4 text-sm font-semibold text-[#0f172a]">{a.name}</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-[#475569]">{a.description}</p>
              <p className="mt-3 text-lg font-bold text-[#0f172a]">${a.priceMonthly}<span className="text-xs font-normal text-[#94a3b8]">/month</span></p>
              <button
                disabled={locked || isAdded}
                onClick={() => addToPlan(a.key)}
                title={locked ? "Select a plan first to unlock add-ons" : undefined}
                className="mt-4 w-full rounded-xl border border-[#e2e8f0] bg-white px-4 py-2 text-sm font-semibold text-[#0f172a] transition enabled:hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isAdded ? "Added ✓" : "Add to plan"}
              </button>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
