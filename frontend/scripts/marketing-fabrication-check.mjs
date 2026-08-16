#!/usr/bin/env node
// 2026-08-15 — grep-based safety net for the new richer /solutions/[slug]
// content blocks (SolutionTemplate.tsx + the new PainPointsSection/
// RoleUseCasesSection/InteractiveRoiCalculator/OnboardingRoadmapSection/
// VerticalIntegrationsSection/CaseStudiesSection components, plus data.ts).
// Scans ONLY the marketing receptionist component tree for content patterns
// this rebuild's hard rules explicitly ban: unearned compliance badges,
// SLA/uptime-guarantee language, and invented-savings-percentage phrasing.
// Not a substitute for a human read — a grep can't verify a claim is TRUE,
// only that a banned SHAPE of claim doesn't appear. Exits non-zero on any
// hit so it can be wired into CI later if wanted.
import { readFileSync, readdirSync, statSync } from "fs";
import { join, extname } from "path";

const ROOT = join(import.meta.dirname, "..", "components", "marketing", "receptionist");

const BANNED_PATTERNS = [
  { name: "GDPR claim", re: /\bGDPR\b(?!\s*principles)/i }, // "built around GDPR principles" (trust page) explicitly allowed elsewhere; this tree shouldn't mention it at all
  { name: "HIPAA claim", re: /\bHIPAA\b/i },
  { name: "SOC 2 / SOC2 claim", re: /\bSOC\s?-?2\b/i },
  { name: "ISO cert claim", re: /\bISO\s?\d{4,5}\b/i },
  { name: "SLA / uptime guarantee", re: /\b(SLA|service level agreement|uptime guarantee|99\.\d%|guaranteed uptime)\b/i },
  { name: "Invented savings percentage", re: /save[s]?\s+(up to\s+)?\d{1,3}%/i },
  { name: "Testimonial-shaped attribution (invented quote pattern)", re: /—\s*(Dr\.|Mr\.|Mrs\.|Ms\.)\s*[A-Z][a-z]+\s+[A-Z][a-z]+,/ },
];

// Allowlist: exact file + pattern-name pairs already reviewed as false
// positives, so a legitimate mention doesn't need the whole check disabled.
const ALLOWLIST = new Set([
  // Real, exact, computed annual-billing discount (priceAnnualMonthly =
  // Math.floor(priceMonthly * 0.8) in data.ts's buildIndustryPlans) — a
  // true claim about our own pricing structure, not an invented
  // ROI/savings-vs-competitor stat, which is what this pattern targets.
  "components/marketing/receptionist/PricingSection.tsx::Invented savings percentage",
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
const allFiles = walk(ROOT);
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
  console.log(`PASS — 0 banned patterns found across ${allFiles.length} files in components/marketing/receptionist/ (comments excluded — rendered content only)`);
  process.exit(0);
} else {
  console.error(`\n${violations} potential fabrication/compliance-overclaim pattern(s) found — review before shipping.`);
  process.exit(1);
}
