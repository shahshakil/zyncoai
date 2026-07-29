"use client";
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Stethoscope, Smile, Scale, Wrench, UtensilsCrossed, Landmark, GraduationCap, Sparkles, PiggyBank, Home, type LucideIcon,
} from "lucide-react";
import { INDUSTRIES } from "./data";

const ICONS: Record<string, LucideIcon> = {
  healthcare: Stethoscope,
  dental: Smile,
  legal: Scale,
  mechanic: Wrench,
  restaurant: UtensilsCrossed,
  bank: Landmark,
  university: GraduationCap,
  salon: Sparkles,
  "financial-services": PiggyBank,
  "home-services": Home,
};

export function IndustriesSection() {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <section className="py-20">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold text-[#0f172a] sm:text-4xl">Built for every Australian business</h2>
      </div>

      <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {INDUSTRIES.map((ind, i) => {
          const Icon = ICONS[ind.slug] || Sparkles;
          const isHovered = hovered === ind.slug;
          return (
            <Link key={ind.slug} href={`/solutions/${ind.slug}`}>
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: i * 0.04 }}
                whileHover={{ scale: 1.04 }}
                onHoverStart={() => setHovered(ind.slug)}
                onHoverEnd={() => setHovered(null)}
                className="relative flex h-40 flex-col justify-between overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.04)] transition-shadow hover:border-[#6366f1]/40 hover:shadow-[0_4px_16px_rgba(99,102,241,0.15)]"
              >
                {!isHovered ? (
                  <>
                    <Icon className="h-6 w-6 text-[#6366f1]" />
                    <div>
                      <p className="text-sm font-semibold text-[#0f172a]">{ind.name}</p>
                      <p className="mt-0.5 text-[11px] text-[#94a3b8]">{ind.callsHandledToday.toLocaleString()} calls handled</p>
                    </div>
                  </>
                ) : (
                  <div className="flex h-full flex-col justify-center">
                    <p className="text-[10px] uppercase tracking-wide text-[#94a3b8]">Ella says</p>
                    <p className="mt-1 text-xs leading-5 text-[#475569]">&ldquo;{ind.greeting}&rdquo;</p>
                  </div>
                )}
              </motion.div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
