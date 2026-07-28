"use client";

export type PasswordStrength = "weak" | "moderate" | "strong";

export function scorePassword(pw: string): PasswordStrength {
  if (pw.length < 8) return "weak";
  const hasUpper = /[A-Z]/.test(pw);
  const hasNumber = /[0-9]/.test(pw);
  const hasSymbol = /[^A-Za-z0-9]/.test(pw);
  if (pw.length >= 12 && hasUpper && hasNumber && hasSymbol) return "strong";
  return "moderate";
}

const STRENGTH_CONFIG: Record<PasswordStrength, { label: string; bar: string; text: string; width: string }> = {
  weak: { label: "Too weak", bar: "bg-red-500", text: "text-red-400", width: "w-1/3" },
  moderate: { label: "Moderate", bar: "bg-yellow-500", text: "text-yellow-400", width: "w-2/3" },
  strong: { label: "Strong", bar: "bg-emerald-500", text: "text-emerald-400", width: "w-full" },
};

export function PasswordStrengthMeter({ password }: { password: string }) {
  if (!password) return null;
  const strength = scorePassword(password);
  const cfg = STRENGTH_CONFIG[strength];

  return (
    <div className="mt-1.5">
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
        <div className={`h-full rounded-full transition-all duration-200 ${cfg.bar} ${cfg.width}`} />
      </div>
      <p className={`mt-1 text-xs ${cfg.text}`}>
        {cfg.label}
        {strength !== "strong" && (
          <span className="text-white/30"> — use 12+ characters with uppercase, a number, and a symbol</span>
        )}
      </p>
    </div>
  );
}
