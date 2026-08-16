#!/usr/bin/env node
// 2026-08-15 — grep-based safety net for the new richer /solutions/[slug]
// content blocks (SolutionTemplate.tsx + the new PainPointsSection/
// RoleUseCasesSection/InteractiveRoiCalculator/OnboardingRoadmapSection/
// VerticalIntegrationsSection/CaseStudiesSection components, plus data.ts).
// Not a substitute for a human read — a grep can't verify a claim is TRUE,
// only that a banned SHAPE of claim doesn't appear. Exits non-zero on any
// hit so it can be wired into CI later if wanted.
//
// 2026-08-16 — widened from components/marketing/receptionist/ only (32
// files, the /solutions/[slug] rebuild's own tree) to every marketing-facing
// directory in the app, per a full-site fabrication sweep. Also added
// patterns for invented customer/business counts, "trusted by" claims, star
// ratings/review counts, and outcome percentages beyond just "save X%"
// (increase/boost/reduce/cut/grow), since those are exactly the shapes a
// zero-real-customer product must never show. Deliberately still excludes
// app/dashboard (client app, audited separately against real per-business
// data, not marketing copy) and app/(auth)/(app)/api/platform-admin (not
// marketing surfaces at all).
import { readFileSync, readdirSync, statSync } from "fs";
import { join, extname } from "path";

const APP_ROOT = join(import.meta.dirname, "..", "app");
const COMPONENTS_ROOT = join(import.meta.dirname, "..", "components");

const ROOTS = [
  join(COMPONENTS_ROOT, "marketing"),
  join(COMPONENTS_ROOT, "home"),
  join(COMPONENTS_ROOT, "seo"),
  join(APP_ROOT, "(marketing)"),
  join(APP_ROOT, "solutions"),
  join(APP_ROOT, "capabilities"),
  join(APP_ROOT, "products"),
  join(APP_ROOT, "whats-new"),
  join(APP_ROOT, "integrations"),
  join(APP_ROOT, "security"),
  join(APP_ROOT, "enterprise"),
  join(APP_ROOT, "product"),
  join(APP_ROOT, "ai"),
  join(APP_ROOT, "ai-transparency"),
  join(APP_ROOT, "brain"),
  join(APP_ROOT, "governance"),
  join(APP_ROOT, "observability"),
  join(APP_ROOT, "templates"),
  join(APP_ROOT, "contact"),
  join(APP_ROOT, "docs"),
  join(APP_ROOT, "legal"),
  join(APP_ROOT, "privacy"),
  join(APP_ROOT, "terms"),
].filter((r) => {
  try {
    return statSync(r).isDirectory();
  } catch {
    return false;
  }
});

const BANNED_PATTERNS = [
  { name: "GDPR claim", re: /\bGDPR\b(?!\s*principles)/i }, // "built around GDPR principles" (trust page) explicitly allowed elsewhere; this tree shouldn't mention it at all
  { name: "HIPAA claim", re: /\bHIPAA\b/i },
  { name: "SOC 2 / SOC2 claim", re: /\bSOC\s?-?2\b/i },
  { name: "ISO cert claim", re: /\bISO\s?\d{4,5}\b/i },
  { name: "SLA / uptime guarantee", re: /\b(SLA|service level agreement|uptime guarantee|99\.\d%|guaranteed uptime)\b/i },
  { name: "Invented savings/outcome percentage", re: /(save[s]?|increase[sd]?|boost[s|ed]?|reduce[sd]?|cut[s]?|grow[s]?|improve[sd]?)\s+(up to\s+)?\d{1,3}%/i },
  { name: "Testimonial-shaped attribution (invented quote pattern)", re: /—\s*(Dr\.|Mr\.|Mrs\.|Ms\.)\s*[A-Z][a-z]+\s+[A-Z][a-z]+,/ },
  { name: "Invented customer/business count", re: /\b(trusted by|used by|loved by|joined by)\s+[\d,]+|\b[\d,]+\+?\s*(businesses|customers|companies|teams|clients)\s+(trust|use|rely on|switched)/i },
  { name: "Star rating / review count", re: /\b\d(\.\d)?\s*(\/\s*5|out of 5|stars?)\b|\b\d{2,}\+?\s*reviews\b/i },
  { name: "Invented call/usage volume stat", re: /\b[\d,]{4,}\+?\s*(calls|minutes|bookings|appointments)\s+(handled|answered|booked|processed)/i },
];

// Allowlist: exact file + pattern-name pairs already reviewed as false
// positives, so a legitimate mention doesn't need the whole check disabled.
const ALLOWLIST = new Set([
  // Real, exact, computed annual-billing discount (priceAnnualMonthly =
  // Math.floor(priceMonthly * 0.8) in data.ts's buildIndustryPlans) — a
  // true claim about our own pricing structure, not an invented
  // ROI/savings-vs-competitor stat, which is what this pattern targets.
  "components/marketing/receptionist/PricingSection.tsx::Invented savings/outcome percentage",
  // 2026-08-16 full-site sweep — manually verified as honest disclaimers,
  // not overclaims: both explicitly say we do NOT currently hold the
  // credential/SLA rather than implying we do.
  "app/(marketing)/resources/trust/page.tsx::GDPR claim",
  "app/(marketing)/resources/trust/page.tsx::SOC 2 / SOC2 claim",
  "app/terms/page.tsx::SLA / uptime guarantee",
  // "SLA" here means the workflow-automation product's ability to monitor
  // a CUSTOMER's own SLA (e.g. ticket-response deadlines, KYC approval
  // turnaround) as an example pipeline step — not a claim that ZyncoAI
  // itself guarantees an uptime SLA. Different meaning of the term than
  // the pattern is meant to catch.
  "app/solutions/fintech/page.tsx::SLA / uptime guarantee",
  "app/solutions/support/page.tsx::SLA / uptime guarantee",
]);

function walk(dir, files = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) walk(full, files);
    else if ([".ts", ".tsx"].includes(extname(entry))) files.push(full);
  }
  return files;
}

// Comments never render to a visitor — this codebase's own audit-trail
// convention (see the many "2026-0X-XX — removed a fabricated X" comments
// throughout ./data.ts) means past fabrication removals get DOCUMENTED in
// comments, which would otherwise make this checker flag its own safety
// history. Strip // line comments and /* */ block comments before
// matching, so this only checks what actually ships. Line numbers below
// are still computed against the ORIGINAL file so they stay accurate.
function stripComments(source) {
  return source.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, " ")).replace(/\/\/.*$/gm, (m) => " ".repeat(m.length));
}

let violations = 0;
const seen = new Set();
const allFiles = ROOTS.flatMap((r) => walk(r)).filter((f) => (seen.has(f) ? false : (seen.add(f), true)));
for (const file of allFiles) {
  const original = readFileSync(file, "utf8");
  const content = stripComments(original);
  const rel = file.replace(process.cwd() + "/", "");
  for (const { name, re } of BANNED_PATTERNS) {
    const key = `${rel}::${name}`;
    if (ALLOWLIST.has(key)) continue;
    const match = content.match(re);
    if (match) {
      violations++;
      const line = content.slice(0, match.index).split("\n").length;
      console.error(`FAIL  ${rel}:${line}  [${name}]  "${match[0]}"`);
    }
  }
}

if (violations === 0) {
  console.log(`PASS — 0 banned patterns found across ${allFiles.length} files across ${ROOTS.length} marketing directories (comments excluded — rendered content only)`);
  process.exit(0);
} else {
  console.error(`\n${violations} potential fabrication/compliance-overclaim pattern(s) found — review before shipping.`);
  process.exit(1);
}
