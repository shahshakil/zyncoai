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
        <h2 className="text-3xl font-bold text-[#f8fafc] sm:text-4xl">Built for every Australian business</h2>
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
                className="relative flex h-40 flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-[#0b0f19] p-4 transition-shadow hover:border-[#4f87f0]/40 hover:shadow-[0_0_30px_rgba(79,135,240,0.2)]"
              >
                {!isHovered ? (
                  <>
                    <Icon className="h-6 w-6 text-[#8ab4ff]" />
                    <div>
                      <p className="text-sm font-semibold text-[#f8fafc]">{ind.name}</p>
                      <p className="mt-0.5 text-[11px] text-[#94a3b8]">{ind.callsHandledToday.toLocaleString()} calls handled</p>
                    </div>
                  </>
                ) : (
                  <div className="flex h-full flex-col justify-center">
                    <p className="text-[10px] uppercase tracking-wide text-[#94a3b8]">Charlotte says</p>
                    <p className="mt-1 text-xs leading-5 text-[#cbd5e1]">&ldquo;{ind.greeting}&rdquo;</p>
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
