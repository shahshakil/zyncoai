"use client";
import { useEffect, useRef, useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { checkPwned } from "@/lib/hibp";

export const PASSWORD_RULES = [
  { key: "len", label: "At least 12 characters", test: (v: string) => v.length >= 12 },
  { key: "upper", label: "One uppercase letter (A–Z)", test: (v: string) => /[A-Z]/.test(v) },
  { key: "lower", label: "One lowercase letter (a–z)", test: (v: string) => /[a-z]/.test(v) },
  { key: "special", label: "One special character (!@#$%...)", test: (v: string) => /[^A-Za-z0-9]/.test(v) },
] as const;

export function allPasswordRulesPass(password: string): boolean {
  return PASSWORD_RULES.every((r) => r.test(password));
}

type BreachStatus = "idle" | "checking" | "clear" | "pwned" | "error";

function HintDot({ state }: { state: "pass" | "fail" | "checking" }) {
  if (state === "checking") {
    return (
      <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-[#c7d2fe] bg-[#eef2ff]">
        <Loader2 className="h-2.5 w-2.5 animate-spin text-[#4f46e5]" />
      </span>
    );
  }
  return (
    <span
      className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
        state === "pass" ? "border-emerald-500 bg-emerald-500" : "border-slate-300"
      }`}
    >
      {state === "pass" && <Check className="h-2.5 w-2.5 text-white" />}
    </span>
  );
}

export function PasswordHints({ password }: { password: string }) {
  const [breach, setBreach] = useState<BreachStatus>("idle");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (!password) {
      setBreach("idle");
      return;
    }
    setBreach("checking");
    timerRef.current = setTimeout(async () => {
      try {
        const { pwned } = await checkPwned(password);
        setBreach(pwned ? "pwned" : "clear");
      } catch {
        // Fail open — a third-party API outage must never block signup.
        setBreach("error");
      }
    }, 600);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [password]);

  const allPass = password.length > 0 && allPasswordRulesPass(password);

  return (
    <div className="mt-3">
      <ul className="space-y-1.5">
        {PASSWORD_RULES.map((r) => {
          const pass = r.test(password);
          return (
            <li key={r.key} className={`flex items-center gap-2 text-xs ${pass ? "font-medium text-[#0f172a]" : "text-[#94a3b8]"}`}>
              <HintDot state={pass ? "pass" : "fail"} />
              {r.label}
            </li>
          );
        })}
        <li
          className={`flex items-center gap-2 text-xs ${
            breach === "pwned" ? "font-medium text-red-600" : breach === "clear" ? "font-medium text-[#0f172a]" : "text-[#94a3b8]"
          }`}
        >
          <HintDot state={breach === "checking" ? "checking" : breach === "clear" ? "pass" : "fail"} />
          {breach === "checking" && "Checking against known breaches…"}
          {breach === "clear" && "Not found in known breaches"}
          {breach === "pwned" && "Found in a known data breach — choose a different password"}
          {breach === "error" && "Couldn't check breach status right now"}
          {breach === "idle" && "Checks against known breaches as you type"}
        </li>
      </ul>

      {allPass && (
        <p className="mt-2 text-xs font-semibold text-emerald-600">All requirements met</p>
      )}
    </div>
  );
}
