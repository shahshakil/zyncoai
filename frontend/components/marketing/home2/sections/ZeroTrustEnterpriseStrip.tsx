"use client";

import { motion } from "framer-motion";

export default function ZeroTrustEnterpriseStrip() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-14 lg:grid-cols-[0.82fr_1.18fr]">
          <div>
            <div className="text-xs uppercase tracking-[0.28em] text-zinc-500">
              Enterprise security
            </div>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight text-zinc-950 md:text-5xl">
              Security must look structured, not decorative.
            </h2>
            <p className="mt-5 text-lg leading-8 text-zinc-600">
              ZyncoAI should show buyers that requests do not move directly into action.
              They move through identity, policy, runtime control, permissions, and evidence.
            </p>

            <div className="mt-8 grid gap-3">
              {[
                "Verify before execution",
                "Control access around systems and workloads",
                "Show auditable paths around actions",
                "Make enterprise buyers feel safe",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-zinc-200 bg-[#fbfbfd] px-4 py-3 text-sm text-zinc-700"
                >
                  ✓ {item}
                </div>
              ))}
            </div>
          </div>

          <motion.div
            className="rounded-[36px] border border-zinc-200 bg-[#fbfbfd] p-6 shadow-[0_18px_70px_rgba(15,23,42,0.05)]"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="rounded-[28px] border border-zinc-200 bg-white p-6">
              <div className="text-center text-3xl font-semibold tracking-tight text-zinc-950">
                Zero-trust enterprise flow
              </div>

              <div className="mt-10 grid items-center gap-8 md:grid-cols-[0.28fr_0.26fr_0.46fr]">
                <div className="text-center">
                  <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-[24px] bg-indigo-50 text-3xl">
                    🖥️
                  </div>
                  <div className="mt-4 text-sm font-medium text-zinc-700">
                    Any request to your network
                  </div>
                </div>

                <div className="text-center">
                  <motion.div
                    className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border-4 border-violet-200 bg-violet-50 text-3xl"
                    animate={{ scale: [1, 1.04, 1] }}
                    transition={{ duration: 2.4, repeat: Infinity }}
                  >
                    🔐
                  </motion.div>
                  <div className="mt-4 text-sm font-medium text-zinc-700">
                    Authenticate based on identity and context
                  </div>
                </div>

                <div className="relative mx-auto h-[280px] w-[280px] rounded-full border-[26px] border-violet-100">
                  <div className="absolute inset-[32px] rounded-full border border-zinc-200 bg-white" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-sm uppercase tracking-[0.22em] text-zinc-500">
                        Access
                      </div>
                      <div className="mt-2 text-3xl font-semibold text-zinc-950">Control</div>
                    </div>
                  </div>

                  {[
                    ["Devices", "18%", "24%"],
                    ["Networks", "72%", "24%"],
                    ["Workloads", "72%", "72%"],
                    ["People", "24%", "72%"],
                    ["Data", "22%", "46%"],
                  ].map(([label, left, top]) => (
                    <div
                      key={label}
                      className="absolute -translate-x-1/2 -translate-y-1/2 text-center"
                      style={{ left, top }}
                    >
                      <div className="mx-auto mb-2 h-10 w-10 rounded-xl bg-violet-50" />
                      <div className="text-xs text-zinc-600">{label}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-10 grid gap-3 sm:grid-cols-3">
                {[
                  "Protection",
                  "Visibility",
                  "Control",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-zinc-200 bg-[#fbfbfd] px-4 py-3 text-center text-sm font-medium text-zinc-700"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
