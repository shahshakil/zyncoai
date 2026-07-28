"use client";

import { motion } from "framer-motion";

type ConnectorItem = {
  name: string;
  short: string;
  x: string;
  y: string;
  delay: number;
  size?: "sm" | "md" | "lg";
};

const connectors: ConnectorItem[] = [
  { name: "Slack", short: "S", x: "8%", y: "18%", delay: 0.1, size: "md" },
  { name: "Gmail", short: "G", x: "23%", y: "72%", delay: 0.2, size: "sm" },
  { name: "Salesforce", short: "SF", x: "22%", y: "28%", delay: 0.3, size: "md" },
  { name: "HubSpot", short: "H", x: "37%", y: "16%", delay: 0.4, size: "sm" },
  { name: "Stripe", short: "ST", x: "68%", y: "15%", delay: 0.5, size: "md" },
  { name: "Notion", short: "N", x: "82%", y: "26%", delay: 0.6, size: "sm" },
  { name: "Calendar", short: "C", x: "78%", y: "68%", delay: 0.7, size: "md" },
  { name: "Jira", short: "J", x: "64%", y: "78%", delay: 0.8, size: "sm" },
  { name: "Sheets", short: "GS", x: "42%", y: "80%", delay: 0.9, size: "sm" },
  { name: "Zendesk", short: "Z", x: "11%", y: "52%", delay: 1.0, size: "sm" },
  { name: "Drive", short: "D", x: "56%", y: "26%", delay: 1.1, size: "sm" },
  { name: "Webhooks", short: "W", x: "89%", y: "50%", delay: 1.2, size: "md" },
];

function sizeClass(size: ConnectorItem["size"]) {
  if (size === "lg") return "h-20 w-20 text-lg";
  if (size === "sm") return "h-12 w-12 text-[11px]";
  return "h-16 w-16 text-sm";
}

export default function ConnectorsCloud() {
  return (
    <section className="relative overflow-hidden bg-[#070710] py-24 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(99,102,241,0.18),transparent_22%),radial-gradient(circle_at_80%_20%,rgba(168,85,247,0.18),transparent_22%),radial-gradient(circle_at_50%_70%,rgba(56,189,248,0.10),transparent_24%)]" />
      <div className="absolute inset-0 opacity-[0.12] [background-image:radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]" />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-12 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <div className="text-xs uppercase tracking-[0.28em] text-zinc-500">
              Connectors cloud
            </div>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
              One orchestration layer for your apps, tools, and data.
            </h2>
            <p className="mt-5 text-lg leading-8 text-zinc-300">
              ZyncoAI should not feel like a disconnected automation toy. It should look like
              a command layer across your business systems — where agents, workflows, approvals,
              and data move through one controlled fabric.
            </p>

            <div className="mt-8 grid gap-3">
              {[
                "Public apps + internal tools + custom APIs",
                "Retries, rate limits, auth isolation, and audit logging",
                "Agents can choose tools while WorkflowOps keeps execution safe",
                "Built to feel bigger than a simple integration gallery",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-zinc-200"
                >
                  ✓ {item}
                </div>
              ))}
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[36px] border border-white/10 bg-[#09090f] p-6 shadow-[0_40px_140px_rgba(76,29,149,0.28)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(124,58,237,0.24),transparent_26%),radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.12),transparent_40%)]" />

            <div className="relative h-[620px] overflow-hidden rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(11,11,18,0.98),rgba(7,7,16,0.98))]">
              <svg className="absolute inset-0 h-full w-full" viewBox="0 0 900 620" fill="none">
                {connectors.map((item, i) => {
                  const x = parseFloat(item.x) / 100;
                  const y = parseFloat(item.y) / 100;
                  const cx = 450;
                  const cy = 310;
                  const px = 900 * x;
                  const py = 620 * y;
                  const mx = (px + cx) / 2;

                  return (
                    <g key={item.name}>
                      <path
                        d={`M ${px} ${py} C ${mx} ${py}, ${mx} ${cy}, ${cx} ${cy}`}
                        stroke="rgba(255,255,255,0.12)"
                        strokeWidth="2"
                      />
                      <motion.path
                        d={`M ${px} ${py} C ${mx} ${py}, ${mx} ${cy}, ${cx} ${cy}`}
                        stroke="url(#connectorFlow)"
                        strokeWidth="3"
                        strokeLinecap="round"
                        initial={{ pathLength: 0.12, pathOffset: 1 }}
                        animate={{ pathLength: 0.18, pathOffset: [1, 0] }}
                        transition={{
                          duration: 3.4,
                          repeat: Infinity,
                          ease: "linear",
                          delay: i * 0.12,
                        }}
                      />
                    </g>
                  );
                })}

                <defs>
                  <linearGradient id="connectorFlow" x1="0" y1="0" x2="900" y2="0">
                    <stop offset="0%" stopColor="#60a5fa" />
                    <stop offset="45%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </linearGradient>
                </defs>
              </svg>

              {connectors.map((item) => (
                <motion.div
                  key={item.name}
                  className="absolute"
                  style={{ left: item.x, top: item.y, transform: "translate(-50%, -50%)" }}
                  initial={{ opacity: 0, scale: 0.8, y: 10 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.55, delay: item.delay }}
                  animate={{ y: [0, -6, 0] }}
                >
                  <div
                    className={[
                      "flex items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] font-semibold text-white shadow-[0_0_30px_rgba(124,58,237,0.16)] backdrop-blur-xl",
                      sizeClass(item.size),
                    ].join(" ")}
                    title={item.name}
                  >
                    {item.short}
                  </div>
                </motion.div>
              ))}

              <motion.div
                className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full border border-violet-300/20 bg-[radial-gradient(circle_at_50%_50%,rgba(168,85,247,0.55),rgba(91,33,182,0.38),rgba(7,7,16,0.15))] shadow-[0_0_100px_rgba(124,58,237,0.45)]"
                animate={{ scale: [1, 1.04, 1], rotate: [0, 6, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="flex h-full w-full items-center justify-center rounded-full text-2xl font-semibold tracking-tight text-white">
                  ZyncoAI
                </div>
              </motion.div>

              <div className="absolute bottom-5 left-5 right-5 grid gap-3 md:grid-cols-2">
                {[
                  "Connector calls brokered safely",
                  "Execution logs attached to every run",
                  "Agent-chosen tools still policy checked",
                  "One cloud, many systems, one result",
                ].map((item, i) => (
                  <motion.div
                    key={item}
                    className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-zinc-200"
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.8 + i * 0.07 }}
                  >
                    ✓ {item}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
