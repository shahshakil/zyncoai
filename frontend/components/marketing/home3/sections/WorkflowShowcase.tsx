"use client";

import { useEffect, useMemo, useState } from "react";

type Scene = {
  id: string;
  title: string;
  subtitle: string;
  outputs: string[];
};

const SCENES: Scene[] = [
  {
    id: "lead-routing",
    title: "Lead qualification + routing",
    subtitle: "Trigger → planner → scoring → CRM update → team notification",
    outputs: ["CRM updated", "Owner assigned", "Slack sent", "Audit written"],
  },
  {
    id: "meeting-reminder",
    title: "Meeting reminder + follow-up",
    subtitle: "Calendar reminder → email → app notification → reschedule logic",
    outputs: ["Reminder sent", "Calendar booked", "No-show risk reduced", "Log stored"],
  },
  {
    id: "support-triage",
    title: "Support triage + escalation",
    subtitle: "Inbound ticket → classify → draft reply → route to agent or AI flow",
    outputs: ["Priority tagged", "Draft created", "Escalated", "SLA clock started"],
  },
  {
    id: "approval-chain",
    title: "Approval workflow + secure action",
    subtitle: "Request → policy check → human approval → execution → evidence trail",
    outputs: ["Approved", "Action executed", "Secrets isolated", "Evidence exported"],
  },
];

function SceneTabs({
  active,
  onChange,
}: {
  active: number;
  onChange: (index: number) => void;
}) {
  return (
    <div className="flex flex-wrap gap-3">
      {SCENES.map((scene, i) => (
        <button
          key={scene.id}
          onClick={() => onChange(i)}
          className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
            active === i
              ? "bg-zinc-950 text-white shadow-lg"
              : "border border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-50"
          }`}
        >
          {scene.title}
        </button>
      ))}
    </div>
  );
}

function WorkflowCard({
  title,
  desc,
  step,
  active,
}: {
  title: string;
  desc: string;
  step: string;
  active: boolean;
}) {
  return (
    <div
      className={`rounded-[24px] border p-5 transition-all duration-500 ${
        active
          ? "border-violet-200 bg-white shadow-[0_18px_50px_rgba(108,71,255,0.12)]"
          : "border-zinc-200 bg-[#fbfaf8]"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-lg font-bold text-zinc-950">{title}</div>
          <div className="mt-2 text-sm leading-6 text-zinc-600">{desc}</div>
        </div>
        <div className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-semibold text-zinc-500">
          {step}
        </div>
      </div>
    </div>
  );
}

function DarkCanvas({ sceneIndex }: { sceneIndex: number }) {
  const scene = SCENES[sceneIndex];
  const positions = useMemo(
    () => [
      [
        { left: "13%", top: "18%" },
        { left: "38%", top: "36%" },
        { left: "60%", top: "52%" },
        { left: "81%", top: "26%" },
      ],
      [
        { left: "12%", top: "20%" },
        { left: "39%", top: "42%" },
        { left: "58%", top: "24%" },
        { left: "82%", top: "58%" },
      ],
      [
        { left: "14%", top: "16%" },
        { left: "38%", top: "33%" },
        { left: "62%", top: "28%" },
        { left: "82%", top: "55%" },
      ],
      [
        { left: "14%", top: "19%" },
        { left: "39%", top: "41%" },
        { left: "61%", top: "60%" },
        { left: "81%", top: "28%" },
      ],
    ],
    []
  );

  const [point, setPoint] = useState(0);

  useEffect(() => {
    setPoint(0);
    const timer = setInterval(() => {
      setPoint((p) => (p + 1) % positions[sceneIndex].length);
    }, 900);
    return () => clearInterval(timer);
  }, [positions, sceneIndex]);

  const activePoint = positions[sceneIndex][point];

  return (
    <div className="rounded-[34px] border border-zinc-200 bg-[#fcfbff] p-4 shadow-[0_30px_90px_rgba(0,0,0,0.06)] md:p-5">
      <div className="rounded-[28px] bg-[#0b0b14] p-5 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]">
        <div className="mb-4 flex items-center justify-between text-sm font-semibold text-white/80">
          <span>Run preview</span>
          <span className="inline-flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,1)]" />
            Active
          </span>
        </div>

        <div className="relative h-[420px] overflow-hidden rounded-[24px] border border-white/10 bg-[radial-gradient(circle_at_center,rgba(96,50,220,0.18),rgba(10,10,16,1)_76%)]">
          <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:22px_22px] opacity-25" />

          <div className="absolute left-[8%] top-[12%] rounded-2xl border border-white/12 bg-white/8 px-4 py-3 text-sm font-semibold text-white">
            Trigger
          </div>

          <div className="absolute left-[34%] top-[32%] rounded-2xl border border-white/12 bg-white/8 px-4 py-3 text-sm font-semibold text-white">
            AI Agent
          </div>

          <div className="absolute left-[58%] top-[48%] rounded-2xl border border-white/12 bg-white/8 px-4 py-3 text-sm font-semibold text-white">
            Output
          </div>

          <div className="absolute right-[6%] top-[18%] rounded-2xl border border-white/12 bg-white/8 px-4 py-3 text-sm font-semibold text-white">
            Tool A
          </div>

          <div className="absolute right-[6%] top-[42%] rounded-2xl border border-white/12 bg-white/8 px-4 py-3 text-sm font-semibold text-white">
            Tool B
          </div>

          <div className="absolute right-[6%] top-[66%] rounded-2xl border border-white/12 bg-white/8 px-4 py-3 text-sm font-semibold text-white">
            Tool C
          </div>

          <svg className="absolute inset-0 h-full w-full">
            <line x1="120" y1="80" x2="300" y2="170" stroke="#b37cff" strokeWidth="3" strokeLinecap="round" />
            <line x1="350" y1="190" x2="490" y2="100" stroke="#c084fc" strokeWidth="3" strokeLinecap="round" />
            <line x1="350" y1="190" x2="490" y2="205" stroke="#8b5cf6" strokeWidth="3" strokeLinecap="round" />
            <line x1="350" y1="190" x2="490" y2="315" stroke="#db8cff" strokeWidth="3" strokeLinecap="round" />
            <line x1="355" y1="205" x2="420" y2="280" stroke="#a78bfa" strokeWidth="3" strokeLinecap="round" />
          </svg>

          <div
            className="absolute h-3 w-3 rounded-full bg-fuchsia-300 shadow-[0_0_18px_rgba(244,114,182,1)] transition-all duration-700"
            style={activePoint}
          />

          <div className="absolute bottom-4 left-4 right-4 grid gap-3 md:grid-cols-2">
            {scene.outputs.map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-sm text-white/80"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function WorkflowShowcase() {
  const [activeScene, setActiveScene] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveScene((v) => (v + 1) % SCENES.length);
    }, 5200);
    return () => clearInterval(timer);
  }, []);

  const scene = SCENES[activeScene];

  const leftSteps = [
    {
      title: "Trigger",
      desc: sceneIndexText(activeScene, 0),
      step: "Step 1",
    },
    {
      title: "AI Planner",
      desc: sceneIndexText(activeScene, 1),
      step: "Step 2",
    },
    {
      title: "Execution",
      desc: sceneIndexText(activeScene, 2),
      step: "Step 3",
    },
    {
      title: "Output",
      desc: sceneIndexText(activeScene, 3),
      step: "Step 4",
    },
  ];

  return (
    <section id="workflow-showcase" className="py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-10 max-w-3xl">
          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
            WORKFLOW ANIMATION
          </div>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-zinc-950 md:text-5xl">
            Real workflow stories. Bigger product energy.
          </h2>
          <p className="mt-4 text-base leading-7 text-zinc-600 md:text-lg">
            Your homepage should not look like one small demo card. It should feel like a living automation system
            with multiple workflow stories, outputs, approvals, notifications, and orchestration depth.
          </p>
        </div>

        <SceneTabs active={activeScene} onChange={setActiveScene} />

        <div className="mt-8 grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <div className="rounded-[28px] border border-zinc-200 bg-white p-6 shadow-[0_20px_60px_rgba(0,0,0,0.05)]">
              <div className="text-sm font-semibold uppercase tracking-[0.12em] text-zinc-500">
                {scene.title}
              </div>
              <p className="mt-3 text-lg leading-8 text-zinc-700">{scene.subtitle}</p>

              <div className="mt-7 space-y-4">
                {leftSteps.map((item, i) => (
                  <WorkflowCard
                    key={item.step}
                    title={item.title}
                    desc={item.desc}
                    step={item.step}
                    active={true}
                  />
                ))}
              </div>
            </div>
          </div>

          <DarkCanvas sceneIndex={activeScene} />
        </div>
      </div>
    </section>
  );
}

function sceneIndexText(sceneIndex: number, stepIndex: number) {
  const map: Record<number, string[]> = {
    0: [
      "Webhook, lead form, or inbound event enters the system.",
      "Planner selects scoring, routing, owner logic, and notification targets.",
      "Actions run against CRM, internal rules, and team communication tools.",
      "Lead is assigned, tracked, logged, and pushed to the right team.",
    ],
    1: [
      "Reminder event fires from schedule or calendar-driven workflow.",
      "Planner decides channel priority, follow-up path, and reschedule logic.",
      "Email, app notification, and reminder logic run with retries.",
      "Meeting outcome is delivered, tracked, and written back to the timeline.",
    ],
    2: [
      "Support request enters via email, form, or platform inbox.",
      "Planner classifies intent, severity, and likely route.",
      "Drafts, escalations, tags, and queue actions run safely.",
      "Ticket moves with better SLA handling and cleaner audit history.",
    ],
    3: [
      "Approval request starts from workflow, policy event, or operator action.",
      "Planner checks policy, approver path, and secure execution requirements.",
      "Approval gate, secret-scoped actions, and evidence capture execute.",
      "Approved action completes with traceability and exportable proof.",
    ],
  };

  return map[sceneIndex][stepIndex];
}
