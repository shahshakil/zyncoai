import Link from "next/link";
import { INDUSTRIES, USE_CASES, COMPANY_SIZES } from "@/components/marketing/receptionist/data";

export default function MarketingMegaFooter() {
  return (
    <footer className="border-t border-white/10 bg-[#030712]">
      <div className="mx-auto max-w-[1440px] px-6 py-16 lg:px-8">
        <div className="grid gap-10 md:grid-cols-5">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#4f87f0] to-[#7c3aed] text-sm font-bold text-white">Z</span>
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
              <li><Link href="/docs" className="hover:text-[#f8fafc]">Help Centre</Link></li>
              <li><Link href="/docs" className="hover:text-[#f8fafc]">API Docs</Link></li>
              <li><Link href="/resources/status" className="hover:text-[#f8fafc]">System Status</Link></li>
              <li><Link href="/privacy" className="hover:text-[#f8fafc]">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-[#f8fafc]">Terms</Link></li>
            </ul>
          </div>

          <div>
            <div className="text-sm font-semibold text-[#f8fafc]">Company</div>
            <ul className="mt-4 space-y-3 text-sm text-[#94a3b8]">
              <li><Link href="/about" className="hover:text-[#f8fafc]">About</Link></li>
              <li><Link href="/about" className="hover:text-[#f8fafc]">Careers</Link></li>
              <li><Link href="/contact" className="hover:text-[#f8fafc]">Contact</Link></li>
              <li><a href="mailto:support@zyncoai.com" className="hover:text-[#f8fafc]">support@zyncoai.com</a></li>
              <li className="text-[#94a3b8]">Newcastle, Australia</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-sm text-[#94a3b8] md:flex-row md:items-center md:justify-between">
          <div>© 2026 ZyncoAI Pty Ltd. ABN available on request.</div>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-[#f8fafc]">Privacy</Link>
            <Link href="/terms" className="hover:text-[#f8fafc]">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
