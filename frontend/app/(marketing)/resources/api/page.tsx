import type { Metadata } from "next";
import { ResourcePageShell, ResourceSection } from "@/components/marketing/receptionist/ResourcePageShell";

export const metadata: Metadata = {
  title: "API Reference | ZyncoAI",
  description: "Webhook events, HMAC signature verification, retry policy, and sample payloads for ZyncoAI.",
};

const BOOKING_CREATED = `{
  "event": "booking.created",
  "businessId": "clx0a1b2c3d4e5f6g7h8i9",
  "ts": "2026-08-04T00:00:00.000Z",
  "data": {
    "appointmentId": "clx1a2b3c4d5e6f7g8h9i0",
    "providerId": "clx9z8y7x6w5v4u3t2s1r0",
    "contactId": "clx5m6n7o8p9q0r1s2t3u4",
    "startAt": "2026-08-06T00:00:00.000Z",
    "endAt": "2026-08-06T00:30:00.000Z",
    "recordType": "consultation"
  }
}`;

const BOOKING_CANCELLED = `{
  "event": "booking.cancelled",
  "businessId": "clx0a1b2c3d4e5f6g7h8i9",
  "ts": "2026-08-04T00:00:00.000Z",
  "data": { "appointmentId": "clx1a2b3c4d5e6f7g8h9i0" }
}`;

export default function ApiPage() {
  return (
    <ResourcePageShell eyebrow="Resources" title="API Reference" description="Public-facing integration docs — webhooks for connecting your own systems to ZyncoAI.">
      <ResourceSection title="Overview">
        <p>
          ZyncoAI sends a webhook event to your endpoint whenever something happens on a call or booking — configure your URL under Dashboard → Settings
          → Webhooks and choose which events you want delivered.
        </p>
      </ResourceSection>

      <ResourceSection title="Events">
        <ul className="list-disc space-y-1 pl-5">
          <li><code className="text-[#8ab4ff]">booking.created</code> — a new appointment was booked, by Charlotte or a staff member.</li>
          <li><code className="text-[#8ab4ff]">booking.completed</code> — an appointment was marked complete.</li>
          <li><code className="text-[#8ab4ff]">booking.cancelled</code> — an appointment was cancelled.</li>
        </ul>
      </ResourceSection>

      <ResourceSection title="Sample payloads">
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          <pre className="overflow-x-auto rounded-xl border border-white/10 bg-[#030712] p-4 text-xs text-[#e2e8f0]">{BOOKING_CREATED}</pre>
          <pre className="overflow-x-auto rounded-xl border border-white/10 bg-[#030712] p-4 text-xs text-[#e2e8f0]">{BOOKING_CANCELLED}</pre>
        </div>
      </ResourceSection>

      <ResourceSection title="Getting your webhook secret">
        <p>
          Create a webhook under Dashboard → Settings → Webhooks. Your signing secret is generated automatically and shown once at creation time — copy it
          immediately, as it&apos;s never displayed again (only a last-4-character preview is kept visible). If you lose it, rotate to a new secret from the
          same screen.
        </p>
      </ResourceSection>

      <ResourceSection title="Authentication — HMAC-SHA256 signature verification">
        <p>Every delivery includes two headers so you can verify it genuinely came from ZyncoAI:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li><code className="text-[#8ab4ff]">x-zynco-event</code> — the event name.</li>
          <li><code className="text-[#8ab4ff]">x-zynco-signature</code> — an HMAC-SHA256 hex digest of the raw request body, signed with your webhook secret.</li>
        </ul>
        <p>To verify: compute <code className="text-[#8ab4ff]">HMAC-SHA256(secret, rawBody)</code> yourself and compare it to the header value using a constant-time comparison before trusting the payload.</p>
      </ResourceSection>

      <ResourceSection title="Retry policy">
        <p>If your endpoint doesn&apos;t return a successful response, ZyncoAI retries delivery up to 3 times with exponential backoff. Every attempt — success or failure — is logged and visible in your dashboard&apos;s webhook delivery history.</p>
      </ResourceSection>

      <ResourceSection title="Integration endpoints">
        <p>
          For connecting your own practice-management software directly (rather than a generic webhook), ZyncoAI has first-party integrations for
          Cliniko, Best Practice, Medical Director, Nookal, Zanda/Power Diary, Mindbody, Jane App, Core Plus, and generic FHIR — configured under Settings
          → Integrations, no code required.
        </p>
      </ResourceSection>

      <ResourceSection title="Rate limits">
        <p>Webhook deliveries and integration syncs are rate-limited per business to keep the platform fast and fair for everyone. If you&apos;re hitting limits, contact support — most limits can be raised for legitimate high-volume use.</p>
      </ResourceSection>
    </ResourcePageShell>
  );
}
