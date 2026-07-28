"use client";

import { motion } from "framer-motion";

export default function EnterpriseSecurityStrip() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-3xl">
          <div className="text-xs uppercase tracking-[0.28em] text-zinc-500">
            Enterprise security
          </div>
          <h2 className="mt-3 text-4xl font-semibold tracking-tight text-zinc-950 md:text-5xl">
            Governance, control, and secure execution.
          </h2>
          <p className="mt-4 text-lg leading-8 text-zinc-600">
            ZyncoAI is not only a workflow builder. It needs to look and behave like an
            enterprise orchestration plane with visibility, identity checks, auditability,
            tenancy, and deployment safety.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[34px] border border-zinc-200 bg-[#faf8ff] p-8 shadow-[0_30px_90px_rgba(76,29,149,0.07)]">
            <div className="text-sm font-semibold text-zinc-900">Zero-trust flow</div>

            <div className="mt-8 flex items-center justify-between gap-4">
              <div className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-100 text-2xl">
                  💻
                </div>
                <div className="mt-3 text-sm text-zinc-600">Any request</div>
              </div>

              <motion.div
                className="h-[2px] flex-1 bg-gradient-to-r from-red-400 via-zinc-300 to-emerald-400"
                initial={{ scaleX: 0.2, opacity: 0.4 }}
                animate={{ scaleX: 1, opacity: 1 }}
                transition={{ duration: 1.4, repeat: Infinity, repeatType: "reverse" }}
                style={{ transformOrigin: "left center" }}
              />

              <div className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-100 text-2xl">
                  🔐
                </div>
                <div className="mt-3 text-sm text-zinc-600">Verify identity + context</div>
              </div>

              <motion.div
                className="h-[2px] flex-1 bg-gradient-to-r from-emerald-400 via-sky-400 to-violet-500"
                initial={{ scaleX: 0.2, opacity: 0.4 }}
                animate={{ scaleX: 1, opacity: 1 }}
                transition={{ duration: 1.4, repeat: Infinity, repeatType: "reverse", delay: 0.35 }}
                style={{ transformOrigin: "left center" }}
              />

              <div className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-100 text-2xl">
                  🛡️
                </div>
                <div className="mt-3 text-sm text-zinc-600">Allow controlled access</div>
              </div>
            </div>

            <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
              {["Devices", "Networks", "Data", "Workloads"].map((item) => (
                <div
                  key={item}
                  className="rounded-[22px] border border-violet-200 bg-white px-4 py-5 text-center text-sm font-medium text-zinc-700"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[34px] border border-zinc-200 bg-[#0a0a12] p-6 shadow-[0_30px_120px_rgba(17,24,39,0.18)]">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs uppercase tracking-[0.28em] text-zinc-500">
                  Multi-tenant topology
                </div>
                <div className="mt-2 text-2xl font-semibold text-white">
                  Cluster-aware orchestration layer
                </div>
              </div>
              <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300">
                Tenant-safe
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-[0.95fr_1.05fr]">
              <div className="space-y-3">
                {["Tenant-X", "Tenant-Y", "Tenant-Z", "Tenant-NEW"].map((item, i) => (
                  <motion.div
                    key={item}
                    className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4 text-sm text-zinc-200"
                    initial={{ opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                  >
                    <div className="flex items-center justify-between">
                      <span>{item}</span>
                      <span className="rounded-full bg-violet-500/20 px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-violet-200">
                        joined
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="space-y-3">
                {["Node pool A", "Node pool B", "Node pool C", "Node pool D"].map((item, i) => (
                  <motion.div
                    key={item}
                    className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4 text-sm text-zinc-200"
                    initial={{ opacity: 0, x: 16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <div className="flex items-center justify-between">
                      <span>{item}</span>
                      <span className="text-zinc-400">VM • Network • LB</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="mt-6 grid gap-3 md:grid-cols-3">
              {[
                "RBAC + org permissions",
                "SSO / SCIM readiness",
                "Audit export + policy traces",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm text-zinc-200"
                >
                  ✓ {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
