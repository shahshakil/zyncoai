"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { INDUSTRIES, USE_CASES, COMPANY_SIZES } from "@/components/marketing/receptionist/data";

// 2026-08-10 — vertical-aware compliance additions, each added only after
// checking the actual product backs it, not just the marketing claim (see
// the per-line comments below). One item that was proposed — a blanket "Do
// Not Call Register Act + ACMA Telemarketing Standard" line — did NOT ship:
// the waitlist-backfill outbound dialer genuinely enforces consent, quiet
// hours, and opt-out (src/lib/waitlist/), but the separate patient-recall/
// ghost-call rescue dialer (src/jobs/autoRescueSweep.ts) does not — no
// consent record, no hard quiet-hours clamp, and Contact.waitlistOptOut is
// never checked there. A claim covering "outbound calling" generally would
// be overbroad until that second dialer has the same guardrails.
const CLINICAL_VERTICAL_SLUGS = ["healthcare", "dental"];

export default function MarketingMegaFooter() {
  const pathname = usePathname();
  const isClinicalVerticalPage = CLINICAL_VERTICAL_SLUGS.some((slug) => pathname === `/solutions/${slug}`);

  return (
    <footer className="border-t border-white/10 bg-[#0f172a]">
      <div className="mx-auto max-w-[1440px] px-6 py-16 lg:px-8">
        <div className="grid gap-10 md:grid-cols-5">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[image:linear-gradient(135deg,#6366f1,#06b6d4)] text-sm font-bold text-white">Z</span>
              <span className="text-lg font-bold text-[#f8fafc]">ZyncoAI</span>
            </div>
            <p className="mt-3 text-sm leading-6 text-[#94a3b8]">Australia&apos;s AI receptionist — answers every call, books every appointment, 24/7.</p>
          </div>

          <div>
            <div className="text-sm font-semibold text-[#f8fafc]">Product</div>
            <ul className="mt-4 space-y-3 text-sm text-[#94a3b8]">
              <li><Link href="/#features" className="hover:text-[#f8fafc]">Features</Link></li>
              <li><Link href="/pricing" className="hover:text-[#f8fafc]">Pricing</Link></li>
              <li><Link href="/addons" className="hover:text-[#f8fafc]">Add-ons</Link></li>
              <li><Link href="/demo" className="hover:text-[#f8fafc]">Demo</Link></li>
              <li><Link href="/faq" className="hover:text-[#f8fafc]">FAQ</Link></li>
              <li><Link href="/whats-new/agents" className="hover:text-[#f8fafc]">Changelog</Link></li>
            </ul>
          </div>

          <div>
            <div className="text-sm font-semibold text-[#f8fafc]">Solutions</div>
            <ul className="mt-4 space-y-3 text-sm text-[#94a3b8]">
              {INDUSTRIES.slice(0, 4).map((i) => (
                <li key={i.slug}><Link href={`/solutions/${i.slug}`} className="hover:text-[#f8fafc]">{i.name}</Link></li>
              ))}
              <li><Link href={`/solutions/use-case/${USE_CASES[0].slug}`} className="hover:text-[#f8fafc]">{USE_CASES[0].name}</Link></li>
              <li><Link href={`/solutions/size/${COMPANY_SIZES[0].slug}`} className="hover:text-[#f8fafc]">{COMPANY_SIZES[0].name}</Link></li>
            </ul>
          </div>

          <div>
            <div className="text-sm font-semibold text-[#f8fafc]">Resources</div>
            <ul className="mt-4 space-y-3 text-sm text-[#94a3b8]">
              <li><Link href="/resources" className="hover:text-[#f8fafc]">Blog</Link></li>
              <li><Link href="/resources/help" className="hover:text-[#f8fafc]">Help Centre</Link></li>
              <li><Link href="/resources/api" className="hover:text-[#f8fafc]">API Docs</Link></li>
              <li><Link href="/resources/status" className="hover:text-[#f8fafc]">System Status</Link></li>
              <li><Link href="/privacy" className="hover:text-[#f8fafc]">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-[#f8fafc]">Terms</Link></li>
            </ul>
          </div>

          <div>
            <div className="text-sm font-semibold text-[#f8fafc]">Company</div>
            <ul className="mt-4 space-y-3 text-sm text-[#94a3b8]">
              <li><Link href="/about" className="hover:text-[#f8fafc]">About</Link></li>
              <li><Link href="/contact" className="hover:text-[#f8fafc]">Contact</Link></li>
              <li><a href="mailto:support@zyncoai.com" className="hover:text-[#f8fafc]">support@zyncoai.com</a></li>
              <li className="text-[#94a3b8]">Newcastle, Australia</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-6">
          <p className="text-xs leading-5 text-[#64748b]">
            ZyncoAI is an AI-powered phone answering service. It does not replace licensed medical professionals.
            ZyncoAI uses AI-assisted decision making — see our{" "}
            <Link href="/privacy#adm" className="underline hover:text-[#94a3b8]">
              Privacy Policy
            </Link>{" "}
            for details.
          </p>

          <div className="mt-5">
            <div className="text-xs font-semibold uppercase tracking-wide text-[#64748b]">Built for Australian compliance</div>
            <ul className="mt-2 flex flex-wrap gap-x-5 gap-y-2 text-xs text-[#94a3b8]">
              <li>
                ✅ <Link href="/privacy" className="underline hover:text-[#f8fafc]">Privacy Act 1988</Link>
              </li>
              <li>
                ✅ <Link href="/privacy#marketing" className="underline hover:text-[#f8fafc]">Spam Act 2003</Link>
              </li>
              <li>✅ Australian Consumer Law (Competition and Consumer Act 2010)</li>
              <li>
                ✅ <Link href="/privacy#health-records" className="underline hover:text-[#f8fafc]">My Health Records Act 2012</Link>
              </li>
              {/* Vertical-aware — state health-privacy legislation only applies to,
                  and is only claimed on, the two clinical solution pages. */}
              {isClinicalVerticalPage && (
                <li>
                  ✅{" "}
                  <Link href="/privacy#health-records" className="underline hover:text-[#f8fafc]">
                    NSW HRIP Act 2002 &amp; Vic Health Records Act 2001
                  </Link>
                </li>
              )}
              <li>
                ✅ AI Transparency (
                <Link href="/ai-transparency" className="underline hover:text-[#f8fafc]">
                  ADM disclosed
                </Link>
                )
              </li>
              <li>
                ✅ <Link href="/privacy#cyber-security" className="underline hover:text-[#f8fafc]">Cyber Security Act 2024 aligned</Link>
              </li>
              <li>
                ✅ <Link href="/privacy#tga" className="underline hover:text-[#f8fafc]">TGA administrative tool disclaimer</Link>
              </li>
              {/* Verified in the live greeting logic (server.py) — every
                  fresh-answer call speaks a recording disclosure alongside
                  the AI-identity line, and audio is only ever captured when
                  that disclosure was actually given this call. */}
              <li>
                ✅ <Link href="/privacy#calls" className="underline hover:text-[#f8fafc]">Call recording disclosed to callers</Link>
              </li>
              {/* Verified real: DataBreachReport model + admin case workflow
                  + OAIC notification template, not just a policy statement. */}
              <li>
                ✅ <Link href="/privacy#breach" className="underline hover:text-[#f8fafc]">Notifiable Data Breaches scheme</Link>
              </li>
              {/* Verified: saveCard() only ever stores a Square-tokenized
                  sourceId/cardId/last4 — no raw card number touches our
                  servers or database at any point. */}
              <li>✅ Card payments processed by Square, a PCI DSS compliant processor</li>
            </ul>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 border-t border-white/10 pt-6 text-sm text-[#94a3b8] md:flex-row md:items-center md:justify-between">
          <div>© 2026 ZyncoAI Pty Ltd. ABN available on request.</div>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-[#f8fafc]">Privacy</Link>
            <Link href="/terms" className="hover:text-[#f8fafc]">Terms</Link>
            <Link href="/ai-transparency" className="hover:text-[#f8fafc]">AI Transparency</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
