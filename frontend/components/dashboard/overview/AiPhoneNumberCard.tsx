"use client";
import { useState } from "react";
import { Copy, Check, Phone } from "lucide-react";
import { Card } from "@/components/dashboard/ui/card";

function formatAuPhone(raw: string): string {
  const digits = raw.replace(/[^\d]/g, "");
  const withoutCountry = digits.startsWith("61") ? digits.slice(2) : digits.startsWith("0") ? digits.slice(1) : digits;
  if (withoutCountry.length === 9) {
    return `+61 ${withoutCountry[0]} ${withoutCountry.slice(1, 5)} ${withoutCountry.slice(5)}`;
  }
  return raw;
}

export function AiPhoneNumberCard({ phoneNumber }: { phoneNumber: string }) {
  const [copied, setCopied] = useState(false);
  const isPending = phoneNumber.startsWith("pending-");

  async function copy() {
    await navigator.clipboard.writeText(phoneNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (isPending) {
    return (
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-600">
            <Phone className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Your AI phone number</p>
            <p className="text-sm text-slate-700">Setting up — we&apos;ll email you as soon as it&apos;s ready.</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[image:var(--gradient,linear-gradient(135deg,#6366f1,#06b6d4))] text-white">
            <Phone className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Your AI phone number</p>
            <p className="text-xl font-bold text-slate-900">{formatAuPhone(phoneNumber)}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <p className="text-xs text-slate-400">Forward your existing number to this</p>
          <button
            onClick={copy}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      </div>
    </Card>
  );
}
