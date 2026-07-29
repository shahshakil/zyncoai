"use client";
// Public QR/link self check-in — unauthenticated, the token is the
// credential (same trust model as /accept-invite). Deliberately outside
// the (auth) route group's shared layout since this needs no header/footer
// chrome, just a single focused card, matching accept-invite's visual
// language (dark, centered card) rather than the light dashboard theme.
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { CheckCircle2, MapPin, Clock, XCircle } from "lucide-react";
import { Button } from "@/components/dashboard/ui/button";

interface CheckInInfo {
  businessName: string;
  contactName: string | null;
  providerName: string;
  dateLabel: string;
  timeLabel: string;
  status: string;
}

export default function CheckInPage() {
  const params = useParams<{ token: string }>();
  const token = params.token;

  const [info, setInfo] = useState<CheckInInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [checkedIn, setCheckedIn] = useState(false);

  useEffect(() => {
    if (!token) return;
    (async () => {
      try {
        const r = await fetch(`/api/business/checkin/public/${token}`);
        const data = await r.json();
        if (!r.ok || !data.ok) {
          setError(data.error === "link_expired" ? "This check-in link has expired." : "We couldn't find this appointment.");
          return;
        }
        setInfo(data);
        if (data.status === "ARRIVED") setCheckedIn(true);
      } catch {
        setError("Something went wrong loading your appointment.");
      }
    })();
  }, [token]);

  async function checkIn() {
    setSubmitting(true);
    try {
      const r = await fetch(`/api/business/checkin/public/${token}`, { method: "POST" });
      const data = await r.json();
      if (!r.ok || !data.ok) {
        setError("Could not check you in — please let the front desk know you've arrived.");
        return;
      }
      setCheckedIn(true);
    } catch {
      setError("Could not check you in — please let the front desk know you've arrived.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-950 px-4">
      <div className="w-full max-w-sm">
        {error ? (
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center">
            <XCircle className="mx-auto mb-3 h-8 w-8 text-rose-400" />
            <h1 className="text-lg font-semibold text-white">Can&apos;t check in</h1>
            <p className="mt-2 text-sm text-white/50">{error}</p>
          </div>
        ) : !info ? (
          <div className="h-56 w-full animate-pulse rounded-2xl border border-white/10 bg-white/[0.03]" />
        ) : checkedIn ? (
          <div className="rounded-2xl border border-emerald-500/20 bg-white/[0.03] p-8 text-center">
            <CheckCircle2 className="mx-auto mb-3 h-10 w-10 text-emerald-400" />
            <h1 className="text-lg font-semibold text-white">You&apos;re checked in!</h1>
            <p className="mt-2 text-sm text-white/50">{info.providerName} at {info.businessName} will be with you shortly.</p>
          </div>
        ) : (
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center">
            <h1 className="text-lg font-semibold text-white">{info.businessName}</h1>
            <p className="mt-1 text-sm text-white/40">Hi {info.contactName || "there"}, welcome</p>
            <div className="mt-5 space-y-2 rounded-xl border border-white/10 bg-white/5 p-4 text-left text-sm text-white/70">
              <p className="flex items-center gap-2"><Clock className="h-4 w-4 text-white/30" /> {info.dateLabel} · {info.timeLabel}</p>
              <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-white/30" /> {info.providerName}</p>
            </div>
            <Button className="mt-6 w-full" disabled={submitting} onClick={checkIn}>
              {submitting ? "Checking in…" : "I Am Here"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
