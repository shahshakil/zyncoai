"use client";

import { motion } from "framer-motion";

export default function EnterpriseTopology() {
  return (
    <section className="bg-[#070710] py-24 text-white">

      <div className="mx-auto max-w-7xl px-6">

        <div className="max-w-3xl">
          <div className="text-xs uppercase tracking-[0.3em] text-zinc-500">
            enterprise platform
          </div>

          <h2 className="mt-3 text-4xl font-semibold md:text-5xl">
            Built for enterprise scale, security, and control.
          </h2>

          <p className="mt-4 text-lg text-zinc-400">
            Deploy automation across teams, systems, and environments
            with enterprise-grade governance.
          </p>
        </div>

        <div className="mt-16 rounded-[36px] border border-white/10 bg-[#0c0c14] p-10">

          <div className="grid grid-cols-3 gap-10 text-center">

            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 4 }}
              className="rounded-2xl border border-white/10 bg-[#09090f] p-6"
            >
              Identity
            </motion.div>

            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 4, delay: 0.2 }}
              className="rounded-2xl border border-white/10 bg-[#09090f] p-6"
            >
              Workflow Engine
            </motion.div>

            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 4, delay: 0.4 }}
              className="rounded-2xl border border-white/10 bg-[#09090f] p-6"
            >
              Connectors
            </motion.div>

          </div>

        </div>

      </div>

    </section>
  );
}
