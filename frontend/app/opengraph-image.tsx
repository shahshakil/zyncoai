import { ImageResponse } from "next/og";

// Site-wide default OG/Twitter card, generated at request time — no
// og-image.png ever existed in public/ (verified), so every og:image
// reference across the site was pointing at a 404. This uses the same
// gradient already defined in app/icon.svg (real brand colors) rather
// than referencing a screenshot or logo file that doesn't exist. Runs on
// the default Node runtime (not edge) — nothing else in this self-hosted
// (pm2 + next start) app uses edge, no reason to introduce it here.
export const alt = "ZyncoAI — AI Receptionist for Australian Businesses";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          padding: "80px",
          background: "linear-gradient(135deg, #0f172a 0%, #1e1b3a 55%, #0f172a 100%)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background: "linear-gradient(135deg, #FF4F00 0%, #FF2D55 55%, #7C3AED 100%)",
            }}
          />
          <div style={{ fontSize: 40, fontWeight: 700, color: "#ffffff" }}>ZyncoAI</div>
        </div>
        <div style={{ marginTop: 48, fontSize: 60, fontWeight: 700, color: "#ffffff", lineHeight: 1.15, maxWidth: 900 }}>
          AI Receptionist for Australian Businesses
        </div>
        <div style={{ marginTop: 28, fontSize: 30, color: "#94a3b8", maxWidth: 850 }}>
          Answers every call 24/7. Books appointments automatically. From AUD $149/month.
        </div>
      </div>
    ),
    { ...size }
  );
}
