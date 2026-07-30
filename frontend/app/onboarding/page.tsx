"use client";
import { Suspense, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Check, MapPin } from "lucide-react";
import { Button } from "@/components/dashboard/ui/button";
import { Input, Label, Select } from "@/components/dashboard/ui/input";
import { StaffSyncPanel } from "@/components/dashboard/StaffSyncPanel";
import { apiPost } from "@/lib/useApi";

const VERTICALS = [
  { value: "MEDICAL", label: "Medical Clinic" },
  { value: "DENTAL", label: "Dental Practice" },
  { value: "LAW", label: "Law Firm" },
  { value: "UNIVERSITY", label: "University / Education" },
  { value: "RESTAURANT", label: "Restaurant" },
  { value: "MECHANIC", label: "Auto Repair Shop" },
  { value: "RETAIL", label: "Retail Store" },
  { value: "SALON", label: "Salon / Spa" },
  { value: "REAL_ESTATE", label: "Real Estate" },
  { value: "BANK", label: "Bank / Financial" },
  { value: "OTHER", label: "Other" },
];

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const STEPS = ["Business", "Staff", "Review & Activate"];

type Prediction = { placeId: string; description: string };
type Hours = Record<string, { closed: boolean; open: string; close: string }>;

function defaultHours(): Hours {
  const h: Hours = {};
  for (const d of DAYS) h[d] = { closed: d === "Sunday", open: "09:00", close: "17:00" };
  return h;
}

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);

  // Step 1
  const [name, setName] = useState("");
  const [vertical, setVertical] = useState("MEDICAL");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [ownerMobile, setOwnerMobile] = useState("");
  const [timezone, setTimezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC");
  const [address, setAddress] = useState("");
  const [placeId, setPlaceId] = useState<string | null>(null);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [hours, setHours] = useState<Hours>(defaultHours());
  const [mapsConfigured, setMapsConfigured] = useState(true);

  // Step 2
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [createdStaff, setCreatedStaff] = useState<{ id: string; name: string }[]>([]);

  // Australian Privacy Act 1988 / My Health Records Act 2012 consent
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [dpaAccepted, setDpaAccepted] = useState(false);
  const [staffImportConsent, setStaffImportConsent] = useState(false);

  useEffect(() => {
    if (address.trim().length < 3 || placeId) {
      setPredictions([]);
      return;
    }
    const t = setTimeout(async () => {
      try {
        const r = await fetch(`/api/business/maps/autocomplete?input=${encodeURIComponent(address)}`, { credentials: "include" });
        const data = await r.json();
        setMapsConfigured(data.configured !== false);
        setPredictions(data.predictions || []);
      } catch {
        // ignore — address remains free-text if Maps lookup fails
      }
    }, 350);
    return () => clearTimeout(t);
  }, [address, placeId]);

  async function selectPrediction(p: Prediction) {
    setAddress(p.description);
    setPlaceId(p.placeId);
    setPredictions([]);
  }

  async function submitBusiness() {
    if (!name.trim() || !phoneNumber.trim()) {
      toast.error("Business name and phone number are required");
      return;
    }
    if (!privacyAccepted || !dpaAccepted) {
      toast.error("You must accept the Privacy Policy and Data Processing Agreement to continue");
      return;
    }
    setSaving(true);
    try {
      const res = await apiPost<{ business: { id: string } }>("/api/business/onboarding/business", {
        name,
        vertical,
        phoneNumber,
        timezone,
        address: address || undefined,
        placeId: placeId || undefined,
        hours,
        ownerMobile: ownerMobile || undefined,
        privacyPolicyAccepted: true,
      });
      setBusinessId(res.business.id);
      setStep(1);
    } catch (err: any) {
      toast.error(err.message === "invalid_input" ? "Check the form for errors" : "Could not save business details");
    } finally {
      setSaving(false);
    }
  }

  async function activate() {
    if (!businessId) return;
    setSaving(true);
    try {
      await apiPost("/api/business/onboarding/activate", { businessId });
      toast.success("Your ZyncoAI voice line is live!");
      router.push("/dashboard");
    } catch {
      toast.error("Could not activate — try again");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-neutral-950 px-4 py-10">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 flex items-center justify-center gap-2">
          {STEPS.map((label, i) => (
            <div key={label} className="flex items-center gap-2">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${
                  i < step ? "bg-indigo-500 text-white" : i === step ? "border-2 border-indigo-400 text-indigo-300" : "border border-white/15 text-white/30"
                }`}
              >
                {i < step ? <Check className="h-4 w-4" /> : i + 1}
              </div>
              {i < STEPS.length - 1 && <div className={`h-px w-10 ${i < step ? "bg-indigo-500" : "bg-white/10"}`} />}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div key="step0" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <h1 className="mb-1 text-lg font-semibold text-white">Tell us about your business</h1>
              <p className="mb-6 text-sm text-white/40">This powers how your AI receptionist answers calls.</p>

              <div className="space-y-4">
                <div>
                  <Label>Business name</Label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Bright Smile Dental" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Industry</Label>
                    <Select value={vertical} onChange={(e) => setVertical(e.target.value)}>
                      {VERTICALS.map((v) => (
                        <option key={v.value} value={v.value}>
                          {v.label}
                        </option>
                      ))}
                    </Select>
                  </div>
                  <div>
                    <Label>Business phone</Label>
                    <Input value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="+1 555 123 4567" />
                  </div>
                </div>
                <div>
                  <Label>Owner mobile number</Label>
                  <Input value={ownerMobile} onChange={(e) => setOwnerMobile(e.target.value)} placeholder="+61 4XX XXX XXX (for important notifications)" />
                </div>
                <div className="relative">
                  <Label>Address</Label>
                  <div className="relative">
                    <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                    <Input
                      className="pl-9"
                      value={address}
                      onChange={(e) => {
                        setAddress(e.target.value);
                        setPlaceId(null);
                      }}
                      placeholder={mapsConfigured ? "Start typing your address…" : "123 Main St, City, State"}
                    />
                  </div>
                  {predictions.length > 0 && (
                    <div className="absolute z-10 mt-1 w-full overflow-hidden rounded-lg border border-white/10 bg-neutral-900 shadow-xl">
                      {predictions.map((p) => (
                        <button
                          key={p.placeId}
                          type="button"
                          onClick={() => selectPrediction(p)}
                          className="block w-full px-3 py-2 text-left text-sm text-white/70 hover:bg-white/5 hover:text-white"
                        >
                          {p.description}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div>
                  <Label>Timezone</Label>
                  <Input value={timezone} onChange={(e) => setTimezone(e.target.value)} />
                </div>

                <div>
                  <Label>Hours</Label>
                  <div className="space-y-1.5 rounded-lg border border-white/10 p-3">
                    {DAYS.map((day) => (
                      <div key={day} className="flex items-center gap-3 text-sm">
                        <span className="w-24 text-white/60">{day}</span>
                        <label className="flex items-center gap-1.5 text-xs text-white/40">
                          <input
                            type="checkbox"
                            checked={!hours[day].closed}
                            onChange={(e) => setHours((h) => ({ ...h, [day]: { ...h[day], closed: !e.target.checked } }))}
                          />
                          Open
                        </label>
                        {!hours[day].closed && (
                          <>
                            <input
                              type="time"
                              value={hours[day].open}
                              onChange={(e) => setHours((h) => ({ ...h, [day]: { ...h[day], open: e.target.value } }))}
                              className="rounded border border-white/10 bg-white/5 px-2 py-1 text-xs text-white"
                            />
                            <span className="text-white/30">to</span>
                            <input
                              type="time"
                              value={hours[day].close}
                              onChange={(e) => setHours((h) => ({ ...h, [day]: { ...h[day], close: e.target.value } }))}
                              className="rounded border border-white/10 bg-white/5 px-2 py-1 text-xs text-white"
                            />
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {(vertical === "MEDICAL" || vertical === "DENTAL") && (
                <div className="mt-6 rounded-lg border border-amber-400/20 bg-amber-400/[0.03] p-3">
                  <p className="text-xs text-amber-200/80">
                    ZyncoAI is an administrative tool only. It does not provide medical advice, diagnosis, or
                    treatment. Always consult a qualified healthcare professional for medical concerns.
                  </p>
                </div>
              )}

              <div className="mt-6 space-y-2 rounded-lg border border-white/10 bg-white/[0.02] p-3">
                <p className="text-xs text-white/40">
                  ZyncoAI stores scheduling data only — no clinical records are stored or accessible.
                </p>
                <label className="flex items-start gap-2 text-xs text-white/60">
                  <input type="checkbox" className="mt-0.5" checked={privacyAccepted} onChange={(e) => setPrivacyAccepted(e.target.checked)} />
                  <span>
                    By connecting your account you agree to our{" "}
                    <a href="/privacy" target="_blank" rel="noreferrer" className="text-indigo-300 underline">Privacy Policy</a> and consent to
                    importing staff data.
                  </span>
                </label>
                <label className="flex items-start gap-2 text-xs text-white/60">
                  <input type="checkbox" className="mt-0.5" checked={dpaAccepted} onChange={(e) => setDpaAccepted(e.target.checked)} />
                  <span>
                    I accept the{" "}
                    <a href="/legal/dpa" target="_blank" rel="noreferrer" className="text-indigo-300 underline">Data Processing Agreement</a> on
                    behalf of this business.
                  </span>
                </label>
              </div>

              <Button className="mt-4 w-full" onClick={submitBusiness} disabled={saving || !privacyAccepted || !dpaAccepted}>
                {saving ? "Saving…" : "Continue"}
              </Button>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <h1 className="mb-1 text-lg font-semibold text-white">Add your staff</h1>
              <p className="mb-6 text-sm text-white/40">Connect your practice software to import staff automatically, or add them by hand.</p>

              {!staffImportConsent ? (
                <>
                  <div className="rounded-lg border border-white/10 bg-white/[0.02] p-3 text-xs text-white/60">
                    <p className="mb-2 font-medium text-white/80">Before we import this data:</p>
                    <p><span className="text-emerald-400">We will import:</span> staff names, titles, email addresses.</p>
                    <p className="mt-1"><span className="text-rose-400">We will NOT import:</span> patient records, clinical data, Medicare numbers, health identifiers.</p>
                    <label className="mt-2 flex items-start gap-2">
                      <input type="checkbox" className="mt-0.5" onChange={(e) => setStaffImportConsent(e.target.checked)} />
                      <span>I understand and consent to importing this staff data.</span>
                    </label>
                  </div>
                  <div className="mt-4 flex gap-3">
                    <Button variant="outline" onClick={() => setStep(0)}>Back</Button>
                  </div>
                </>
              ) : (
                <>
                  <Suspense fallback={null}>
                    <StaffSyncPanel
                      onConfirmed={(created) => {
                        setCreatedStaff(created);
                        setStep(2);
                      }}
                    />
                  </Suspense>
                  <div className="mt-4">
                    <Button variant="outline" onClick={() => setStep(0)}>Back</Button>
                  </div>
                </>
              )}
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <h1 className="mb-1 text-lg font-semibold text-white">Review & activate</h1>
              <p className="mb-6 text-sm text-white/40">Everything looks good? Activate your line to start taking calls.</p>

              <div className="space-y-4 text-sm">
                <div className="rounded-lg border border-white/10 p-4">
                  <p className="font-medium text-white">{name}</p>
                  <p className="text-white/40">{VERTICALS.find((v) => v.value === vertical)?.label}</p>
                  {address && (
                    <p className="mt-1 flex items-center gap-1 text-white/50">
                      <MapPin className="h-3.5 w-3.5" /> {address}
                    </p>
                  )}
                  <p className="mt-1 text-white/50">{phoneNumber}</p>
                </div>
                <div className="rounded-lg border border-white/10 p-4">
                  <p className="mb-2 font-medium text-white">Staff ({createdStaff.length})</p>
                  <ul className="space-y-1 text-white/50">
                    {createdStaff.map((s) => (
                      <li key={s.id}>{s.name}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <Button variant="outline" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button className="flex-1" onClick={activate} disabled={saving}>
                  {saving ? "Activating…" : "Activate my voice line"}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
