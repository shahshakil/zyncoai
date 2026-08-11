"use client";
import Link from "next/link";
import posthog from "posthog-js";
import { ArrowRight } from "lucide-react";
import { CallEllaButton } from "./CallEllaButton";
import { DemoPlayer, type DemoTranscript } from "./DemoPlayer";
import demoCall from "./demoCallTranscript.json";

// 2026-08-11 — this file and CallEllaButton.tsx each carried a different
// number with a comment claiming the OTHER one was fake. Re-verified
// directly against the DB rather than trusting either stale comment: BOTH
// numbers are real, live, ACTIVE Business.phoneNumber records with genuine
// completed call history (+61 2 5747 4612 = Bright Smile Dental, +61 2 5747
// 4792 = shahs clinic). Standardized on 4792 — shahs clinic is the
// deliberately-designated internal test/demo business (see BusinessAddOn /
// paid-plan-invariant notes elsewhere in this codebase) and has the more
// recently verified live completed call. Exported so other components
// (e.g. FaqSection's closing CTA) reuse this exact literal instead of
// duplicating it, so there's only ever one number to keep correct.
export const DEMO_NUMBER = "+61 2 5747 4792";

// The old "Play" button here drove a hand-typed CONVERSATION array through
// a setTimeout-per-line animation — it never played real audio and wasn't
// wired to anything that could break, but it also wasn't real. Replaced
// 2026-08-11 with a genuine audio recording: every line below was
// synthesized through Cartesia using the EXACT production voice/model/
// settings (backend/src/voice/pipecat/server.py's send_busy_and_close —
// model_id "sonic-3.5", the real CARTESIA_VOICE_ID, speed 0.92, emotion
// "calm") — not a soundalike. Regenerate via
// backend/scripts/generate-demo-audio.mjs if the script text ever changes.
// The conversation itself follows the real production greeting pattern
// (server.py's build_dynamic_new_caller_greeting / AI IDENTITY rule): AI
// disclosure, recording disclosure, and an email confirmation — not SMS,
// which is currently blocked account-wide (lib/sms.ts) and would have
// reintroduced the exact overclaim already fixed elsewhere on this site.
//
// 2026-08-11 (later same day) — player internals (waveform/transcript/
// incoming-call/booking-card) extracted to DemoPlayer.tsx so the new
// personalized /demo generator ("hear Ella answer YOUR business") reuses
// the identical player instead of a redrawn lookalike. This file now only
// owns the fixed demo's content + the section chrome around the player.
const TRANSCRIPT = demoCall as DemoTranscript;

export function LiveDemoSection({ voiceHealthy = false }: { voiceHealthy?: boolean }) {
  return (
    <section className="py-20" id="live-demo-audio">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-3xl font-bold text-[#0f172a] sm:text-4xl">See how Ella handles a real call</h2>
        <p className="mt-3 text-[#475569]">
          {voiceHealthy ? "This is the actual conversation pattern from Ella's production booking flow." : "Our live demo line is temporarily offline — this recording is not a mockup."}
        </p>
      </div>

      <div className="mx-auto mt-6 flex max-w-3xl justify-center">
        <CallEllaButton healthy={voiceHealthy} />
      </div>
      {voiceHealthy && <p className="mt-3 text-center text-xs text-[#475569]">This is a real AI — she will answer instantly.</p>}

      <div className="mt-10">
        <DemoPlayer
          audioSrc="/audio/demo/ella-demo-call.mp3"
          transcript={TRANSCRIPT}
          idleTeaseText={`${Math.round(TRANSCRIPT.totalDuration)} seconds. Hear your next receptionist.`}
          bookingLineMatch={(text) => text.startsWith("Great, you're booked in")}
          onFirstPlay={() => posthog.capture("demo_played", {})}
        />

        <div className="mt-6 flex justify-center">
          <Link href="/demo" className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#4f46e5] hover:text-[#4338ca]">
            Try with your own clinic <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
