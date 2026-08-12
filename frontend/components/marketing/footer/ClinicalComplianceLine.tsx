"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

// The only pathname-dependent piece of the footer's compliance list — kept
// as its own tiny client component so the rest of MarketingMegaFooter can
// stay a server component (needed to fetch the real legal-entity/ABN data
// server-side, see lib/legalEntity.ts). State health-privacy legislation
// only applies to, and is only claimed on, the two clinical solution pages.
const CLINICAL_VERTICAL_SLUGS = ["healthcare", "dental"];

export function ClinicalComplianceLine() {
  const pathname = usePathname();
  const isClinicalVerticalPage = CLINICAL_VERTICAL_SLUGS.some((slug) => pathname === `/solutions/${slug}`);
  if (!isClinicalVerticalPage) return null;

  return (
    <li>
      ✅{" "}
      <Link href="/privacy#health-records" className="underline hover:text-[#f8fafc]">
        NSW HRIP Act 2002 &amp; Vic Health Records Act 2001
      </Link>
    </li>
  );
}
