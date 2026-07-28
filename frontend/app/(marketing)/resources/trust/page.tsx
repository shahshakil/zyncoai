import type { Metadata } from "next";
import { ResourcePageShell, ResourceSection } from "@/components/marketing/receptionist/ResourcePageShell";

export const metadata: Metadata = {
  title: "Trust & Security | ZyncoAI",
  description: "How ZyncoAI protects patient data — encryption, access controls, data residency, and compliance posture.",
};

export default function TrustPage() {
  return (
    <ResourcePageShell eyebrow="Resources" title="Trust & Security" description="An honest look at how we protect the data you trust us with.">
      <ResourceSection title="How we protect patient data">
        <p>
          Sensitive fields — Medicare numbers, private health details, DVA numbers — are encrypted at rest with AES-256-GCM before they&apos;re ever written to
          the database, and decrypted only for the specific role that&apos;s authorised to see them. Financial data (billing, payer information) is stripped
          from every API response for staff and doctor accounts that shouldn&apos;t see it — this is enforced server-side, not just hidden in the interface.
        </p>
      </ResourceSection>

      <ResourceSection title="Australian Privacy Act 1988">
        <p>
          ZyncoAI is designed around the Australian Privacy Principles: we collect only what&apos;s needed to run your front desk, we don&apos;t sell or share
          patient data with third parties, and every sensitive-record view, download, or send is written to an audit log your practice can review.
          Compliance with the Privacy Act for how <em>your</em> practice uses ZyncoAI is a shared responsibility — we recommend your practice&apos;s compliance
          officer reviews your own configuration.
        </p>
      </ResourceSection>

      <ResourceSection title="Data residency">
        <p>
          Production data is currently hosted in Singapore (AWS ap-southeast-1). We&apos;re aware some Australian healthcare customers prefer in-country
          (Sydney, ap-southeast-2) hosting, and that migration is on our roadmap — contact us if this is a hard requirement for your practice today.
        </p>
      </ResourceSection>

      <ResourceSection title="Encryption standards">
        <ul className="list-disc space-y-1 pl-5">
          <li>AES-256-GCM for sensitive fields at rest (Medicare/DVA/private health numbers, OAuth tokens).</li>
          <li>TLS in transit for every connection to the dashboard, API, and voice platform.</li>
          <li>Separate encryption keys for different data classes, so rotating one never affects another.</li>
        </ul>
      </ResourceSection>

      <ResourceSection title="My Health Records Act 2012 & AHPRA">
        <ul className="list-disc space-y-1 pl-5">
          <li>ZyncoAI doesn&apos;t store clinical data — no diagnoses, results, or My Health Record content. Scan and pathology entries track metadata only (type, date, ordering doctor, status); uploaded reports are opaque files, never parsed into structured data.</li>
          <li>No AHPRA practitioner registration numbers are captured or stored anywhere in the platform.</li>
        </ul>
      </ResourceSection>

      <ResourceSection title="Access controls">
        <p>
          Role-based access (Owner / Admin / Staff / Doctor) is enforced on every API route, not just hidden in the UI. Doctors only ever see their own
          patients and schedule; Staff never see financial or payer data; only Owner/Admin can manage integrations, billing, and staff.
        </p>
      </ResourceSection>

      <ResourceSection title="Incident response">
        <p>
          If we identify a security issue affecting your data, we notify affected practices directly and provide a clear timeline and remediation. We
          don&apos;t currently publish a public bug-bounty program, but we take reports seriously — email <a href="mailto:security@zyncoai.com" className="text-[#8ab4ff] hover:underline">security@zyncoai.com</a> if you find something.
        </p>
      </ResourceSection>

      <ResourceSection title="SOC 2 & GDPR">
        <p>
          ZyncoAI is not yet SOC 2 certified — formal certification is on our roadmap as we scale. Our data-handling practices are built around GDPR
          principles (data minimisation, purpose limitation, encryption), but we don&apos;t claim formal GDPR certification today. We&apos;ll update this page as
          our compliance posture matures.
        </p>
      </ResourceSection>
    </ResourcePageShell>
  );
}
