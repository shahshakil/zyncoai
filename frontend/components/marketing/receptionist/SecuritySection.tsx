"use client";
import { motion } from "framer-motion";
import {
  KeyRound,
  Lock,
  Users,
  ScrollText,
  ShieldCheck,
  ShieldAlert,
  Gauge,
  LogIn,
  Globe,
  Radar,
  Building2,
  Database,
  Smartphone,
  TimerOff,
  MailWarning,
  UserX,
  KeySquare,
} from "lucide-react";

// Every tile here has been checked against the actual running code, not
// copied from a template. Two things were deliberately left out after that
// check:
//  - "Real-time fraud detection" -> what's actually live is call-velocity
//    abuse monitoring (auto-suspends a business past a call-rate threshold),
//    not broad fraud detection, so the tile below is worded to match that.
//  - "Multi-tenant data isolation" -> the tenant-scoping guard only covers
//    the newer business/* API routes, not the voice pipeline yet (that's a
//    known, explicit follow-up in the code, not finished), so this is
//    worded as "tenant-scoped" rather than claiming blanket isolation.
//  - "Australian data residency" was proposed for this list and removed:
//    the database is currently hosted in Singapore (ap-southeast-1), not
//    Sydney. Do not add this claim back until that's actually true.
//
// Four more added after the "top-tier security" pass: session timeout
// (components/dashboard/SessionTimeoutGuard.tsx), new-login email alerts
// (lib/security/loginNotify.ts), account lockout (already existed, tightened
// to 5 attempts + an email on lockout), and password confirmation on
// high-risk actions (lib/middleware/auth/requireReauth.ts) -- worded
// generically because today it only actually gates two real actions
// (removing a staff member, bulk patient data export), not every action a
// "sensitive action confirmation" feature could theoretically cover. Delete
// account and change email don't exist as features yet, so nothing was
// added to gate there.
const MEASURES = [
  { icon: KeyRound, color: "#4f46e5", label: "Password breach detection" },
  { icon: Lock, color: "#06b6d4", label: "Strong password enforcement" },
  { icon: Users, color: "#10b981", label: "Role-based staff access" },
  { icon: ScrollText, color: "#f59e0b", label: "Full audit trail" },
  { icon: ShieldCheck, color: "#4f46e5", label: "AES-256 field encryption" },
  { icon: ShieldAlert, color: "#06b6d4", label: "Brute-force & lockout protection" },
  { icon: Gauge, color: "#10b981", label: "Rate limiting" },
  { icon: LogIn, color: "#f59e0b", label: "Google OAuth login" },
  { icon: Globe, color: "#4f46e5", label: "HTTPS everywhere" },
  { icon: Radar, color: "#06b6d4", label: "Automated usage & abuse monitoring" },
  { icon: Building2, color: "#10b981", label: "Tenant-scoped data access" },
  { icon: Database, color: "#f59e0b", label: "SQL injection protection" },
  { icon: Smartphone, color: "#4f46e5", label: "Mandatory 2FA for new accounts" },
  { icon: TimerOff, color: "#06b6d4", label: "Automatic session timeout" },
  { icon: MailWarning, color: "#10b981", label: "New-login email alerts" },
  { icon: UserX, color: "#f59e0b", label: "Account lockout after failed attempts" },
  { icon: KeySquare, color: "#4f46e5", label: "Password confirmation on high-risk actions" },
];

export function SecuritySection() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#94a3b8]">Security</p>
        <h2 className="mt-2 text-3xl font-bold text-[#0f172a] sm:text-4xl">What&apos;s actually built, not what sounds good</h2>
        <p className="mt-3 text-sm text-[#475569]">No badges we haven&apos;t earned — this list only grows as new measures genuinely ship.</p>
      </div>

      <div className="mx-auto mt-12 grid max-w-4xl grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {MEASURES.map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ delay: i * 0.04 }}
            className="flex items-center gap-2.5 rounded-xl border border-[#e2e8f0] bg-white px-3.5 py-3 shadow-[0_1px_3px_rgba(0,0,0,0.06)]"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg" style={{ background: `${m.color}1a` }}>
              <m.icon className="h-4 w-4" style={{ color: m.color }} />
            </div>
            <span className="text-[13px] font-medium leading-tight text-[#1e293b]">{m.label}</span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
