"use client";
import { motion } from "framer-motion";
import { Clock, CalendarCheck, Activity, PhoneForwarded, SlidersHorizontal, Plug } from "lucide-react";
import { useSpotlight } from "./useSpotlight";

const FEATURES = [
  { icon: Clock, color: "#4f46e5", title: "24/7 Availability", desc: "Never miss a call, day or night, weekends included." },
  { icon: CalendarCheck, color: "#06b6d4", title: "Instant Booking", desc: "Appointments go straight on the calendar — no back-and-forth, no hold music." },
  { icon: Activity, color: "#10b981", title: "Real-time Analytics", desc: "Every call, outcome, and trend live in your dashboard." },
  { icon: PhoneForwarded, color: "#f59e0b", title: "Human Handoff", desc: "Escalates to your team the moment a call needs a person." },
  { icon: SlidersHorizontal, color: "#4f46e5", title: "Tuned Per Vertical", desc: "Scripts and workflows built for how your industry actually books work." },
  { icon: Plug, color: "#06b6d4", title: "Works With Your Tools", desc: "Google and Microsoft Calendar sync built in, not bolted on." },
];

export function FeaturesSection() {
  const spotlight = useSpotlight(FEATURES.length);

  return (
    <section id="features" className="py-20">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold text-[#0f172a] sm:text-4xl">Built to actually run a front desk</h2>
      </div>

      <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((f, i) => {
          const isLit = spotlight === i;
          return (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.06 }}
              animate={{ y: isLit ? -4 : 0 }}
              className="group rounded-2xl border bg-white p-6 transition-[border-color,box-shadow] duration-500"
              style={{
                borderColor: isLit ? f.color : "#e2e8f0",
                boxShadow: isLit
                  ? `0 12px 30px ${f.color}26, 0 1px 3px rgba(0,0,0,0.08)`
                  : "0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)",
              }}
            >
              <div
                className="flex h-12 w-12 items-center justify-center rounded-xl transition-shadow"
                style={{ background: `${f.color}1a`, boxShadow: isLit ? `0 0 24px ${f.color}66` : "none" }}
              >
                <f.icon className="h-6 w-6" style={{ color: f.color }} />
              </div>
              <h3 className="mt-4 text-base font-semibold text-[#0f172a]">{f.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-[#475569]">{f.desc}</p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
