"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export function FinalCtaSection() {
  const [email, setEmail] = useState("");
  const router = useRouter();

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    router.push(`/signup${email ? `?email=${encodeURIComponent(email)}` : ""}`);
  }

  return (
    <section className="relative mx-[calc(50%-50vw)] w-screen py-16">
      <div className="mx-auto max-w-[1100px] px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-[32px] bg-[image:linear-gradient(135deg,#4f46e5,#06b6d4)] px-6 py-16 text-center shadow-[0_20px_60px_rgba(79,70,229,0.3)] sm:px-12"
        >
          <div className="pointer-events-none absolute inset-0 opacity-40" style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.15) 1px, transparent 1px)", backgroundSize: "24px 24px" }} />

          <div className="relative">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">Start your 7-day free trial</h2>
            <p className="mt-3 text-white/85">Plans from AUD $299/month · AUD $499 one-time setup · no credit card required to start</p>

            <form onSubmit={onSubmit} className="mx-auto mt-8 flex max-w-md flex-col gap-2.5 sm:flex-row">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@business.com"
                className="w-full rounded-xl border border-white/20 bg-white/95 px-4 py-3 text-sm text-[#0f172a] placeholder:text-[#94a3b8] outline-none focus:ring-4 focus:ring-white/30"
              />
              <button
                type="submit"
                className="group inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl bg-[#0f172a] px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
              >
                Start Free Trial <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
