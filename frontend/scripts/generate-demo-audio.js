// Generates the homepage's 4-step Charlotte demo conversation clips using
// the exact ElevenLabs voice ID the production voice pipeline defaults to
// (backend/src/voice/vapi/vapiConfig.ts's ELEVENLABS_VOICE_ID) — this is
// the same voice callers actually hear, not a generic stand-in. Run
// manually (`node scripts/generate-demo-audio.js`) — not part of `next build`.
const fs = require("fs");
const path = require("path");

const VOICE_ID = process.env.ELEVENLABS_VOICE_ID || "XB0fDUnXU5powFXDhCwa";
const API_KEY = process.env.ELEVENLABS_API_KEY;
const OUT_DIR = path.join(__dirname, "..", "public", "audio");

const CLIPS = [
  { file: "charlotte-greeting.mp3", text: "Good morning! Thanks for calling Sydney Medical Centre, this is Charlotte speaking — how can I help you today?" },
  { file: "charlotte-availability.mp3", text: "Of course! The doctor has Thursday at 10am or Friday at 2pm available. Which works better for you?" },
  { file: "charlotte-confirm.mp3", text: "Perfect! Can I get your name and a good contact number to confirm the booking?" },
  { file: "charlotte-booked.mp3", text: "Lovely — you are all booked in for Thursday at 10am. I will send a confirmation to your email shortly. Is there anything else I can help you with?" },
];

async function generateClip(clip) {
  const resp = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
    method: "POST",
    headers: { "xi-api-key": API_KEY, "content-type": "application/json", accept: "audio/mpeg" },
    body: JSON.stringify({
      text: clip.text,
      model_id: "eleven_turbo_v2_5",
      voice_settings: { stability: 0.35, similarity_boost: 0.75, style: 0.4 },
    }),
  });

  if (!resp.ok) {
    throw new Error(`ElevenLabs request failed for ${clip.file}: ${resp.status} ${await resp.text()}`);
  }

  const buf = Buffer.from(await resp.arrayBuffer());
  const outPath = path.join(OUT_DIR, clip.file);
  fs.writeFileSync(outPath, buf);
  console.log(`Wrote ${buf.length} bytes to ${outPath}`);
}

async function main() {
  if (!API_KEY) {
    console.error("ELEVENLABS_API_KEY not set — cannot generate demo audio.");
    process.exit(1);
  }
  fs.mkdirSync(OUT_DIR, { recursive: true });
  for (const clip of CLIPS) {
    await generateClip(clip);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
