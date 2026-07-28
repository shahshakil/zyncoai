"use client";

import { motion } from "framer-motion";

const plans = [
  {
    name: "Starter",
    price: "$29",
    subtitle: "For solo builders and early automation use",
    features: [
      "Core workflow builder",
      "Starter templates",
      "Basic run history",
      "App connections",
    ],
    featured: false,
  },
  {
    name: "Professional",
    price: "$99",
    subtitle: "For teams shipping serious automations",
    features: [
      "AgentOps orchestration",
      "WorkflowOps controls",
      "Run monitoring",
      "Approvals and notifications",
      "Production workflow deployment",
    ],
    featured: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    subtitle: "For larger teams with governance and security requirements",
    features: [
      "SSO / SCIM readiness",
      "Advanced org controls",
      "Audit and evidence exports",
      "Policy and tenancy patterns",
      "Priority support and enablement",
    ],
    featured: false,
  },
];

export default function PricingPreview() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-3xl">
          <div className="text-xs uppercase tracking-[0.28em] text-zinc-500">
            Pricing preview
          </div>
          <h2 className="mt-3 text-4xl font-semibold tracking-tight text-zinc-950 md:text-5xl">
            Clear packaging for how teams buy software.
          </h2>
          <p className="mt-4 text-lg leading-8 text-zinc-600">
            Pricing should not feel like an afterthought. It helps users decide quickly,
            and it helps investors see that the product can convert across segments.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              className={[
                "rounded-[34px] border p-6 shadow-[0_18px_70px_rgba(15,23,42,0.05)]",
                plan.featured
                  ? "border-violet-300 bg-[linear-gradient(180deg,#ffffff,#faf5ff)]"
                  : "border-zinc-200 bg-white",
              ].join(" ")}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-xl font-semibold text-zinc-950">{plan.name}</div>
                  <div className="mt-2 text-sm leading-7 text-zinc-600">{plan.subtitle}</div>
                </div>
                {plan.featured ? (
                  <div className="rounded-full bg-violet-600 px-3 py-1 text-xs font-medium text-white">
                    Popular
                  </div>
                ) : null}
              </div>

              <div className="mt-8 text-5xl font-semibold tracking-tight text-zinc-950">
                {plan.price}
                {plan.price !== "Custom" ? (
                  <span className="text-lg font-medium text-zinc-500">/mo</span>
                ) : null}
              </div>

              <div className="mt-8 space-y-3">
                {plan.features.map((feature) => (
                  <div
                    key={feature}
                    className="rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-700"
                  >
                    ✓ {feature}
                  </div>
                ))}
              </div>

              <a
                href="/app"
                className={[
                  "mt-8 inline-flex h-12 w-full items-center justify-center rounded-full text-sm font-semibold transition",
                  plan.featured
                    ? "bg-gradient-to-r from-violet-600 via-fuchsia-500 to-blue-500 text-white shadow-[0_0_40px_rgba(139,92,246,0.28)]"
                    : "border border-zinc-200 bg-white text-zinc-900 hover:bg-zinc-50",
                ].join(" ")}
              >
                {plan.name === "Enterprise" ? "Talk to sales" : "Start free"}
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
