// One-off generator for the homepage's real Charlotte voice sample.
// Uses the same ElevenLabs voice ID the production voice pipeline defaults
// to (backend/src/voice/vapi/vapiConfig.ts's ELEVENLABS_VOICE_ID) so the
// marketing site's demo audio is the same voice callers actually hear, not
// a generic stand-in. Run manually — this is not part of `next build`.
import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const VOICE_ID = process.env.ELEVENLABS_VOICE_ID || "XB0fDUnXU5powFXDhCwa";
const API_KEY = process.env.ELEVENLABS_API_KEY;
const OUT_PATH = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "public", "audio", "charlotte-demo.mp3");

const TEXT = "Good morning, thanks for calling Sydney Medical Centre! This is Charlotte speaking — how can I help you today?";

async function main() {
  if (!API_KEY) {
    console.error("ELEVENLABS_API_KEY not set — skipping audio generation. The homepage falls back to the Web Speech API / call-now button.");
    process.exit(1);
  }

  const resp = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
    method: "POST",
    headers: { "xi-api-key": API_KEY, "content-type": "application/json", accept: "audio/mpeg" },
    body: JSON.stringify({
      text: TEXT,
      model_id: "eleven_turbo_v2_5",
      voice_settings: { stability: 0.35, similarity_boost: 0.75 },
    }),
  });

  if (!resp.ok) {
    console.error(`ElevenLabs request failed: ${resp.status} ${await resp.text()}`);
    process.exit(1);
  }

  const buf = Buffer.from(await resp.arrayBuffer());
  await writeFile(OUT_PATH, buf);
  console.log(`Wrote ${buf.length} bytes to ${OUT_PATH}`);
}

main();
