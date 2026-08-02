"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/dashboard/ui/button";
import { Input, Label } from "@/components/dashboard/ui/input";
import { Mail, ShieldCheck } from "lucide-react";
import { redirectAfterAuth } from "@/lib/postAuthRedirect";

const ROLE_LABEL: Record<string, string> = { OWNER: "Owner", ADMIN: "Admin", STAFF: "Staff", DOCTOR: "Doctor" };

interface InviteInfo {
  email: string;
  role: string;
  businessName: string;
}

function AcceptInviteForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [invite, setInvite] = useState<InviteInfo | null>(null);
  const [invalid, setInvalid] = useState(false);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      setInvalid(true);
      return;
    }
    (async () => {
      try {
        const r = await fetch(`/api/auth/accept-invite?token=${encodeURIComponent(token)}`);
        const data = await r.json();
        if (!r.ok || !data.ok) {
          setInvalid(true);
          return;
        }
        setInvite({ email: data.email, role: data.role, businessName: data.businessName });
      } catch {
        setInvalid(true);
      }
    })();
  }, [token]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const r = await fetch("/api/auth/accept-invite", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ token, password, name: name || undefined }),
      });
      const data = await r.json();
      if (!r.ok || !data.ok) {
        toast.error(data.error === "existing_account_wrong_password" ? "That email already has an account — enter its existing password" : "Could not accept invitation");
        setLoading(false);
        return;
      }
      toast.success("Welcome to ZyncoAI");
      // Hard navigation (window.location.href inside redirectAfterAuth), not
      // router.push — same reasoning as the login page fix: avoids the
      // client router cache serving a stale pre-auth response for /dashboard.
      await redirectAfterAuth(null);
    } catch {
      toast.error("Something went wrong. Try again.");
      setLoading(false);
    }
  }

  if (invalid) {
    return (
      <div className="w-full max-w-sm rounded-2xl border border-[#e2e8f0] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)] p-8 text-center">
        <h1 className="text-lg font-semibold text-[#0f172a]">Invitation not found</h1>
        <p className="mt-2 text-sm text-[#475569]">This invite link is invalid, already used, or has expired. Ask the business owner to send a new one.</p>
        <Link href="/login" className="mt-6 inline-block text-sm text-[#6366f1] hover:text-[#4f46e5]">Back to sign in</Link>
      </div>
    );
  }

  if (!invite) {
    return <div className="h-40 w-full max-w-sm animate-pulse rounded-2xl border border-[#e2e8f0] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)]" />;
  }

  return (
    <div className="w-full max-w-sm">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[image:linear-gradient(135deg,#6366f1,#06b6d4)]">
          <ShieldCheck className="h-5 w-5 text-white" />
        </div>
        <h1 className="text-xl font-semibold text-[#0f172a]">Join {invite.businessName}</h1>
        <p className="mt-1 text-sm text-[#94a3b8]">
          You&apos;ve been invited as <span className="text-[#0f172a]">{ROLE_LABEL[invite.role] || invite.role}</span>
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border border-[#e2e8f0] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)] p-6">
        <div className="flex items-center gap-2 rounded-lg border border-[#e2e8f0] bg-slate-50 px-3 py-2 text-sm text-[#475569]">
          <Mail className="h-4 w-4 text-[#94a3b8]" />
          {invite.email}
        </div>
        <div>
          <Label htmlFor="name">Full name</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Doe" />
        </div>
        <div>
          <Label htmlFor="password">Set a password</Label>
          <Input id="password" type="password" required minLength={8} autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 8 characters" />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Setting up your account…" : "Accept invitation"}
        </Button>
      </form>
    </div>
  );
}

export default function AcceptInvitePage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-[#f8fafc] px-4">
      <Suspense fallback={<div className="h-40 w-full max-w-sm animate-pulse rounded-2xl border border-[#e2e8f0] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)]" />}>
        <AcceptInviteForm />
      </Suspense>
    </div>
  );
}
