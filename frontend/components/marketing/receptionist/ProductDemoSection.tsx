"use client";
import { useCallback, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { LiveDashboardScene } from "./LiveDashboardScene";

export function ProductDemoSection() {
  const [ctaSettled, setCtaSettled] = useState(false);
  const handleFirstPassComplete = useCallback(() => setCtaSettled(true), []);

  return (
    <section className="py-20" id="dashboard-live-scene">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold text-[#0f172a] sm:text-4xl">See the dashboard in action</h2>
      </div>

      <LiveDashboardScene onFirstPassComplete={handleFirstPassComplete} />

      <div className="mt-8 text-center">
        <motion.div
          className="inline-block"
          initial={{ opacity: 1, scale: 1 }}
          animate={ctaSettled ? { scale: [1, 1.04, 1] } : {}}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 rounded-xl bg-[image:linear-gradient(135deg,#6366f1,#06b6d4)] px-6 py-3 text-sm font-semibold text-white hover:opacity-90"
          >
            Try it yourself — free for 7 days <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
