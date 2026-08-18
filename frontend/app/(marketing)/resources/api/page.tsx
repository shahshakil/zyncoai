import type { Metadata } from "next";
import { ResourcePageShell, ResourceSection } from "@/components/marketing/receptionist/ResourcePageShell";

export const metadata: Metadata = {
  title: "API Reference | ZyncoAI",
  description: "Webhook events, HMAC signature verification, retry policy, and sample payloads for ZyncoAI.",
  alternates: { canonical: "/resources/api" },
};

// 2026-08-17 audit — every claim on this page checked against the real
// webhook pipeline (backend/src/webhooks/{dispatchBusinessWebhook,
// businessWebhookQueue,businessWebhookWorker}.ts), the real integrations
// catalog (backend/src/api/routes/business/integrations.ts +
// staffSync/scheduler.ts), and the real rate limiters
// (backend/src/api/middleware/rateLimiters.ts). Two real UI gaps found and
// closed in the same pass rather than walked back in the docs: the
// dashboard had no "rotate secret" button and no delivery-history view,
// even though both backend endpoints already existed and worked — both are
// now wired into Settings → Webhooks (components/dashboard/settings/
// WebhooksTab.tsx). Key order in the sample payloads below matches the
// real JSON.stringify() call in businessWebhookWorker.ts exactly, since
// that's the literal byte sequence the signature is computed over.
const BOOKING_CREATED = `{
  "event": "booking.created",
  "businessId": "clx0a1b2c3d4e5f6g7h8i9",
  "data": {
    "appointmentId": "clx1a2b3c4d5e6f7g8h9i0",
    "providerId": "clx9z8y7x6w5v4u3t2s1r0",
    "contactId": "clx5m6n7o8p9q0r1s2t3u4",
    "startAt": "2026-08-06T00:00:00.000Z",
    "endAt": "2026-08-06T00:30:00.000Z",
    "recordType": "consultation",
    "directionsUrl": "https://maps.google.com/?q=..."
  },
  "ts": "2026-08-04T00:00:00.000Z"
}`;

const BOOKING_COMPLETED = `{
  "event": "booking.completed",
  "businessId": "clx0a1b2c3d4e5f6g7h8i9",
  "data": { "appointmentId": "clx1a2b3c4d5e6f7g8h9i0" },
  "ts": "2026-08-04T00:00:00.000Z"
}`;

const BOOKING_CANCELLED = `{
  "event": "booking.cancelled",
  "businessId": "clx0a1b2c3d4e5f6g7h8i9",
  "data": { "appointmentId": "clx1a2b3c4d5e6f7g8h9i0" },
  "ts": "2026-08-04T00:00:00.000Z"
}`;

const VERIFY_SIGNATURE_NODE = `const crypto = require("crypto");
const express = require("express");
const app = express();

// Verify against the RAW request body bytes, not JSON.stringify(req.body)
// after Express has parsed it — key order or whitespace can differ from
// what ZyncoAI actually signed, which breaks verification even for a
// genuine delivery. Use express.raw() on this route, before any JSON
// body-parser touches it.
app.post(
  "/webhooks/zynco",
  express.raw({ type: "application/json" }),
  (req, res) => {
    const signatureHeader = req.header("x-zynco-signature");
    const rawBody = req.body; // Buffer, thanks to express.raw()

    if (!verifySignature(process.env.ZYNCO_WEBHOOK_SECRET, rawBody, signatureHeader)) {
      return res.status(401).send("invalid signature");
    }

    const event = JSON.parse(rawBody.toString("utf8"));
    console.log("Verified event:", req.header("x-zynco-event"), event);
    res.status(200).send("ok");
  }
);

function verifySignature(secret, rawBody, signatureHeader) {
  if (!signatureHeader) return false;
  const expected = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
  const a = Buffer.from(signatureHeader, "hex");
  const b = Buffer.from(expected, "hex");
  // Guard the length check before timingSafeEqual — it throws on mismatched
  // buffer lengths, and signatureHeader is attacker-controlled input.
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
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
          <li><code className="text-[#6366f1]">booking.created</code> — a new appointment was booked, by Ella or a staff member.</li>
          <li><code className="text-[#6366f1]">booking.completed</code> — an appointment was marked complete.</li>
          <li><code className="text-[#6366f1]">booking.cancelled</code> — an appointment was cancelled.</li>
        </ul>
      </ResourceSection>

      <ResourceSection title="Sample payloads">
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          <pre className="overflow-x-auto rounded-xl border border-[#e2e8f0] bg-slate-50 p-4 text-xs text-[#0f172a]">{BOOKING_CREATED}</pre>
          <pre className="overflow-x-auto rounded-xl border border-[#e2e8f0] bg-slate-50 p-4 text-xs text-[#0f172a]">{BOOKING_COMPLETED}</pre>
          <pre className="overflow-x-auto rounded-xl border border-[#e2e8f0] bg-slate-50 p-4 text-xs text-[#0f172a]">{BOOKING_CANCELLED}</pre>
        </div>
      </ResourceSection>

      <ResourceSection title="Getting your webhook secret">
        <p>
          Create a webhook under Dashboard → Settings → Webhooks. Your signing secret is generated automatically and shown once at creation time — copy it
          immediately, as it&apos;s never displayed again (only a last-4-character preview is kept visible). If you lose it, rotate to a new secret from the
          same screen — the old secret stops working the moment you do.
        </p>
      </ResourceSection>

      <ResourceSection title="Authentication — HMAC-SHA256 signature verification">
        <p>Every delivery includes two headers so you can verify it genuinely came from ZyncoAI:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li><code className="text-[#6366f1]">x-zynco-event</code> — the event name.</li>
          <li><code className="text-[#6366f1]">x-zynco-signature</code> — an HMAC-SHA256 hex digest of the raw request body, signed with your webhook secret.</li>
        </ul>
        <p>To verify: compute <code className="text-[#6366f1]">HMAC-SHA256(secret, rawBody)</code> yourself and compare it to the header value using a constant-time comparison before trusting the payload.</p>
        <pre className="overflow-x-auto rounded-xl border border-[#e2e8f0] bg-slate-50 p-4 text-xs text-[#0f172a]">{VERIFY_SIGNATURE_NODE}</pre>
      </ResourceSection>

      <ResourceSection title="Retry policy">
        <p>If your endpoint doesn&apos;t return a successful response, ZyncoAI retries delivery up to 3 times with exponential backoff. Every attempt — success or failure — is logged and visible in your dashboard&apos;s webhook delivery history.</p>
      </ResourceSection>

      <ResourceSection title="Integration endpoints">
        <p>
          For connecting your own practice-management software directly (rather than a generic webhook), here&apos;s exactly what each system does today —
          not a rounded-up summary:
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <strong>Live staff/practitioner sync, configured under Settings → Integrations, no code required</strong> — Cliniko, Nookal, Halaxy, Zanda,
            Power Diary, Jane App, and Core Plus. Connect once and your roster stays in sync automatically (a nightly sweep, plus a manual &quot;Sync
            now&quot;).
          </li>
          <li>
            <strong>Live staff/practitioner sync, API only for now</strong> — Mindbody and generic FHIR. The sync adapter is real and runs the same
            nightly/manual sync as the list above, but there&apos;s no dashboard card for either yet — connect them with a direct{" "}
            <code className="text-[#6366f1]">PUT /api/business/integrations/&#123;provider&#125;</code> call.
          </li>
          <li>
            <strong>Credentials storable, live sync not active yet</strong> — Pabau. Its API is confirmed and self-service, but the exact staff-list
            endpoint hasn&apos;t been confirmed against a live account — credentials save now, and sync activates once that&apos;s verified.
          </li>
          <li>
            <strong>No public API — CSV import</strong> — Best Practice and Medical Director. Export a staff CSV from your software and upload it under
            Settings → Integrations; there&apos;s no live sync for either because neither publishes a public staff-list API.
          </li>
        </ul>
        <p>
          One honest limit that applies across every system above: what syncs today is your staff/practitioner roster, so availability stays accurate
          without manual re-entry — full appointment/booking sync isn&apos;t available yet for any of them.
        </p>
      </ResourceSection>

      <ResourceSection title="Rate limits">
        <p>
          There&apos;s no dedicated rate limit specific to webhooks or integration syncs — every authenticated request to ZyncoAI&apos;s business API,
          including creating a webhook or triggering a sync, shares the same general limits: 100 requests/minute per user, and 1,000 requests/hour per IP
          address. Webhook delivery itself (the outbound POST to your endpoint) runs through a shared worker pool with a platform-wide concurrency of 10
          in-flight deliveries at a time — that&apos;s not a per-business quota, just how many the whole platform processes at once. If either limit is a
          real constraint for your integration, contact support.
        </p>
      </ResourceSection>
    </ResourcePageShell>
  );
}
