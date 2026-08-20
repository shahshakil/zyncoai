import Link from "next/link";

export const metadata = {
  // absolute — this title already contains "ZyncoAI"; the root layout's
  // "%s | ZyncoAI" template would otherwise repeat the brand.
  title: { absolute: "AI Transparency • ZyncoAI" },
  description:
    "What AI models ZyncoAI uses, how they make decisions, how to opt out, data retention, and how to make a complaint.",
  alternates: { canonical: "/ai-transparency" },
};

const Section = ({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) => (
  <section id={id} className="scroll-mt-24">
    <h2 className="text-xl font-extrabold tracking-tight text-[#0f172a]">{title}</h2>
    <div className="mt-3 space-y-3 text-sm leading-6 text-[#475569]">{children}</div>
  </section>
);

const Bullet = ({ children }: { children: React.ReactNode }) => (
  <li className="flex gap-3">
    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#6366f1] shadow-[0_0_8px_rgba(99,102,241,.10)]" />
    <span>{children}</span>
  </li>
);

export default function AiTransparencyPage() {
  const updated = "July 30, 2026";

  return (
    <main className="min-h-screen bg-[#f8fafc]">
      <div className="relative overflow-hidden border-b border-[#e2e8f0]">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-40 -top-40 h-[520px] w-[520px] rounded-full blur-3xl bg-[radial-gradient(circle_at_30%_30%,rgba(99,102,241,.10),transparent_60%)]" />
          <div className="absolute -right-44 -bottom-44 h-[560px] w-[560px] rounded-full blur-3xl bg-[radial-gradient(circle_at_70%_70%,rgba(6,182,212,.10),transparent_60%)]" />
        </div>

        <div className="relative mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-14 lg:py-16">
          <div className="flex flex-wrap items-center gap-3 text-xs text-[#94a3b8]">
            <span className="inline-flex items-center rounded-full border border-[#e2e8f0] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)] px-2.5 py-1">Legal</span>
            <span>•</span>
            <span>Last updated: {updated}</span>
          </div>

          <h1 className="mt-4 text-3xl font-black tracking-tight text-[#0f172a] sm:text-4xl">AI Transparency</h1>

          <p className="mt-3 max-w-3xl text-sm leading-6 text-[#475569]">
            ZyncoAI uses AI to answer calls and assist with appointment booking. This page explains which AI models
            we use, how they make decisions, how to opt out, and how to make a complaint — in line with the
            Automated Decision Making disclosure in our{" "}
            <Link href="/privacy#adm" className="text-indigo-300 underline">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>

      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-10 lg:py-12">
        <div className="grid gap-8 lg:grid-cols-12">
          <aside className="lg:col-span-4">
            <div className="sticky top-24 rounded-2xl border border-[#e2e8f0] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)] p-5">
              <div className="text-sm font-extrabold text-[#0f172a]">On this page</div>
              <nav className="mt-3 space-y-2 text-sm">
                {[
                  ["models", "AI models we use"],
                  ["decisions", "How AI makes decisions"],
                  ["opt-out", "How to opt out"],
                  ["retention", "Data retention"],
                  ["no-medical-advice", "No medical advice"],
                  ["staff-confirm", "Staff confirm every booking"],
                  ["complaints", "Complaints"],
                ].map(([id, label]) => (
                  <a key={id} href={`#${id}`} className="block rounded-lg px-2 py-1.5 text-[#475569] hover:bg-slate-100 hover:text-[#0f172a] transition">
                    {label}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          <section className="lg:col-span-8 space-y-10">
            <Section id="models" title="AI models we use">
              <ul className="mt-2 space-y-2">
                <Bullet><strong>OpenAI GPT-4o-mini</strong> — holds the conversation, understands what the caller is asking for, and decides which action to take (e.g. book, reschedule, transfer), for every industry except Restaurants.</Bullet>
                <Bullet><strong>OpenAI GPT-4o</strong> — the same role, for Restaurant callers specifically. Restaurant ordering conversations found gpt-4o-mini unreliable at correctly calling the menu/order-lookup tools, so that vertical runs the larger model.</Bullet>
                <Bullet><strong>Deepgram Nova-2</strong> — converts the caller&apos;s speech into text in real time.</Bullet>
                <Bullet><strong>Cartesia Sonic</strong> — converts Ella&apos;s responses back into speech.</Bullet>
              </ul>
            </Section>

            <Section id="decisions" title="How AI makes decisions">
              <p>
                Ella checks your clinic&apos;s real-time appointment availability and business hours before offering a
                time slot, and uses natural language understanding to work out what the caller wants (booking,
                rescheduling, cancelling, a question, or an emergency). No decision significantly affecting a
                caller&apos;s rights is made without human oversight — clinic staff review all bookings.
              </p>
            </Section>

            <Section id="opt-out" title="How to opt out">
              <p>
                Any caller can ask for a human receptionist instead of Ella at any point during a call, simply by
                saying <strong>&quot;transfer me to a person.&quot;</strong> Ella will hand the call to your clinic&apos;s
                configured transfer number.
              </p>
            </Section>

            <Section id="retention" title="Data retention">
              <ul className="mt-2 space-y-2">
                <Bullet>Call transcripts are retained for <strong>90 days</strong>.</Bullet>
                <Bullet>Call recordings (where enabled) are retained for <strong>90 days</strong>, then automatically deleted.</Bullet>
              </ul>
            </Section>

            <Section id="no-medical-advice" title="No medical advice">
              <p>
                Ella is an administrative booking assistant. She does not provide medical advice, diagnosis, or
                treatment. Always consult a qualified healthcare professional for medical concerns.
              </p>
            </Section>

            <Section id="staff-confirm" title="Staff confirm every booking">
              <p>
                Every appointment Ella books is visible to clinic staff in the dashboard and subject to their
                confirmation — Ella&apos;s booking is a proposal clinic staff can adjust or decline, not a final,
                unreviewable decision.
              </p>
            </Section>

            <Section id="complaints" title="Complaints">
              <p>
                Questions or complaints about how our AI handled a call can be sent to{" "}
                <a href="mailto:support@zyncoai.com" className="text-indigo-300 underline">support@zyncoai.com</a>.
              </p>
            </Section>
          </section>
        </div>
      </div>
    </main>
  );
}
