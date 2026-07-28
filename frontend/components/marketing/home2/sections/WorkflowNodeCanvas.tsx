"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

type NodeItem = {
  id: string;
  title: string;
  sub?: string;
  x: number;
  y: number;
  w: number;
  h: number;
  kind: "trigger" | "agent" | "tool" | "decision" | "output";
  accent?: string;
};

const nodes: NodeItem[] = [
  {
    id: "start",
    title: "Lead arrives",
    sub: "Webhook / Form / API",
    x: 28,
    y: 210,
    w: 150,
    h: 72,
    kind: "trigger",
    accent: "from-emerald-400 to-green-500",
  },
  {
    id: "detect",
    title: "Intent classifier",
    sub: "priority + category",
    x: 228,
    y: 198,
    w: 180,
    h: 86,
    kind: "agent",
    accent: "from-fuchsia-500 to-pink-500",
  },
  {
    id: "plan",
    title: "AI Planner",
    sub: "tools + next actions",
    x: 468,
    y: 188,
    w: 186,
    h: 92,
    kind: "agent",
    accent: "from-violet-500 to-indigo-500",
  },
  {
    id: "crm",
    title: "CRM enrich",
    sub: "HubSpot / Salesforce",
    x: 740,
    y: 112,
    w: 178,
    h: 78,
    kind: "tool",
    accent: "from-sky-500 to-cyan-500",
  },
  {
    id: "slack",
    title: "Slack notify",
    sub: "owner + summary",
    x: 740,
    y: 228,
    w: 168,
    h: 78,
    kind: "tool",
    accent: "from-indigo-500 to-blue-500",
  },
  {
    id: "calendar",
    title: "Book meeting",
    sub: "Calendar hold",
    x: 740,
    y: 344,
    w: 168,
    h: 78,
    kind: "tool",
    accent: "from-orange-500 to-amber-500",
  },
  {
    id: "decision",
    title: "High intent?",
    sub: "confidence threshold",
    x: 970,
    y: 190,
    w: 170,
    h: 86,
    kind: "decision",
    accent: "from-emerald-500 to-lime-500",
  },
  {
    id: "exec",
    title: "Execution summary",
    sub: "audit trail + outcome",
    x: 1195,
    y: 182,
    w: 220,
    h: 102,
    kind: "output",
    accent: "from-violet-500 to-fuchsia-500",
  },
];

function nodeCenterX(n: NodeItem) {
  return n.x + n.w / 2;
}

function nodeCenterY(n: NodeItem) {
  return n.y + n.h / 2;
}

function edgePath(a: NodeItem, b: NodeItem) {
  const x1 = a.x + a.w;
  const y1 = nodeCenterY(a);
  const x2 = b.x;
  const y2 = nodeCenterY(b);
  const dx = Math.max(80, (x2 - x1) * 0.5);

  return `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;
}

function Dot({ delay = 0 }: { delay?: number }) {
  return (
    <motion.div
      className="absolute h-2.5 w-2.5 rounded-full bg-white shadow-[0_0_18px_rgba(255,255,255,0.9)]"
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 1, 1, 0] }}
      transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", delay }}
    />
  );
}

export default function WorkflowNodeCanvas() {
  const edges = useMemo(
    () => [
      ["start", "detect"],
      ["detect", "plan"],
      ["plan", "crm"],
      ["plan", "slack"],
      ["plan", "calendar"],
      ["crm", "decision"],
      ["slack", "decision"],
      ["calendar", "decision"],
      ["decision", "exec"],
    ],
    []
  );

  const edgeItems = edges.map(([aId, bId]) => {
    const a = nodes.find((n) => n.id === aId)!;
    const b = nodes.find((n) => n.id === bId)!;
    return { key: `${aId}-${bId}`, a, b, path: edgePath(a, b) };
  });

  return (
    <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[#09090f] shadow-[0_30px_120px_rgba(17,24,39,0.45)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(139,92,246,0.18),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(59,130,246,0.12),transparent_26%),radial-gradient(circle_at_55%_60%,rgba(236,72,153,0.08),transparent_24%)]" />
      <div className="absolute inset-0 opacity-[0.16] [background-image:radial-gradient(#ffffff_1px,transparent_1px)] [background-size:18px_18px]" />

      <div className="relative z-10 border-b border-white/10 px-5 py-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-[11px] uppercase tracking-[0.28em] text-zinc-400">
              Live workflow canvas
            </div>
            <h3 className="mt-1 text-lg font-semibold text-white">
              Agent-driven orchestration map
            </h3>
          </div>

          <div className="flex items-center gap-2 text-xs text-zinc-300">
            <span className="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_14px_rgba(74,222,128,0.8)]" />
            Active run
          </div>
        </div>
      </div>

      <div className="relative z-10 overflow-x-auto">
        <div className="relative h-[560px] min-w-[1460px]">
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1460 560" fill="none">
            {edgeItems.map((edge, index) => (
              <g key={edge.key}>
                <path
                  d={edge.path}
                  stroke="rgba(255,255,255,0.16)"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
                <motion.path
                  d={edge.path}
                  stroke="url(#edgeGradient)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  initial={{ pathLength: 0.15, pathOffset: 1 }}
                  animate={{ pathLength: 0.22, pathOffset: [1, 0] }}
                  transition={{
                    duration: 3.4,
                    repeat: Infinity,
                    ease: "linear",
                    delay: index * 0.18,
                  }}
                />
              </g>
            ))}

            <defs>
              <linearGradient id="edgeGradient" x1="0" y1="0" x2="1460" y2="0">
                <stop offset="0%" stopColor="#60a5fa" />
                <stop offset="50%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#ec4899" />
              </linearGradient>
            </defs>
          </svg>

          {nodes.map((node, idx) => {
            const isOutput = node.kind === "output";
            const isAgent = node.kind === "agent";

            return (
              <motion.div
                key={node.id}
                className={[
                  "absolute rounded-[24px] border",
                  isOutput
                    ? "border-fuchsia-400/30 bg-white/6 shadow-[0_0_60px_rgba(168,85,247,0.18)]"
                    : "border-white/12 bg-white/[0.04]",
                ].join(" ")}
                style={{
                  left: node.x,
                  top: node.y,
                  width: node.w,
                  height: node.h,
                }}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: idx * 0.08 }}
              >
                <div className="relative h-full overflow-hidden rounded-[24px] px-4 py-3">
                  <div
                    className={`absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r ${node.accent}`}
                  />
                  <div className="flex h-full flex-col justify-between">
                    <div>
                      <div className="text-[13px] font-semibold text-white">{node.title}</div>
                      <div className="mt-1 text-[11px] text-zinc-400">{node.sub}</div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="inline-flex rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-zinc-400">
                        {node.kind}
                      </div>

                      {isAgent ? (
                        <motion.div
                          className="h-2.5 w-2.5 rounded-full bg-violet-400 shadow-[0_0_16px_rgba(167,139,250,0.9)]"
                          animate={{ scale: [1, 1.35, 1], opacity: [0.6, 1, 0.6] }}
                          transition={{ duration: 1.8, repeat: Infinity }}
                        />
                      ) : (
                        <motion.div
                          className="h-2.5 w-2.5 rounded-full bg-cyan-300 shadow-[0_0_14px_rgba(103,232,249,0.8)]"
                          animate={{ scale: [1, 1.25, 1], opacity: [0.55, 1, 0.55] }}
                          transition={{ duration: 2.1, repeat: Infinity }}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}

          <motion.div
            className="absolute right-8 top-20 w-[260px] rounded-[28px] border border-white/10 bg-zinc-950/80 p-4 shadow-[0_0_80px_rgba(139,92,246,0.12)] backdrop-blur-xl"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
          >
            <div className="text-[11px] uppercase tracking-[0.25em] text-zinc-500">Agent trace</div>
            <div className="mt-3 space-y-3">
              {[
                "Classified as enterprise lead",
                "Pulled CRM history + owner mapping",
                "Created Slack summary",
                "Placed meeting hold",
                "Wrote audit event to log store",
              ].map((item, i) => (
                <motion.div
                  key={item}
                  className="rounded-2xl border border-white/8 bg-white/[0.03] px-3 py-2 text-sm text-zinc-200"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.65 + i * 0.12 }}
                >
                  <span className="mr-2 text-emerald-400">✓</span>
                  {item}
                </motion.div>
              ))}
            </div>
          </motion.div>

          <div className="absolute left-[380px] top-[145px]">
            <Dot delay={0.2} />
          </div>
          <div className="absolute left-[655px] top-[190px]">
            <Dot delay={0.9} />
          </div>
          <div className="absolute left-[930px] top-[227px]">
            <Dot delay={1.4} />
          </div>
          <div className="absolute left-[1115px] top-[230px]">
            <Dot delay={1.9} />
          </div>
        </div>
      </div>
    </div>
  );
}
