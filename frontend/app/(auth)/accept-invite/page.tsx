"use client";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/dashboard/ui/button";
import { Input, Label } from "@/components/dashboard/ui/input";
import { Mail, ShieldCheck } from "lucide-react";

const ROLE_LABEL: Record<string, string> = { OWNER: "Owner", ADMIN: "Admin", STAFF: "Staff", DOCTOR: "Doctor" };

interface InviteInfo {
  email: string;
  role: string;
  businessName: string;
}

function AcceptInviteForm() {
  const router = useRouter();
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
        const r = await fetch(`/api/business/staff/invitations/public/${token}`);
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
      const r = await fetch(`/api/business/staff/invitations/public/${token}/accept`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ token, password, name: name || undefined }),
      });
      const data = await r.json();
      if (!r.ok || !data.ok) {
        toast.error(data.error === "existing_account_wrong_password" ? "That email already has an account — enter its existing password" : "Could not accept invitation");
        setLoading(false);
        return;
      }
      toast.success("Welcome to ZyncoAI");
      router.push("/dashboard");
      router.refresh();
    } catch {
      toast.error("Something went wrong. Try again.");
      setLoading(false);
    }
  }

  if (invalid) {
    return (
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center">
        <h1 className="text-lg font-semibold text-white">Invitation not found</h1>
        <p className="mt-2 text-sm text-white/50">This invite link is invalid, already used, or has expired. Ask the business owner to send a new one.</p>
        <Link href="/login" className="mt-6 inline-block text-sm text-indigo-400 hover:text-indigo-300">Back to sign in</Link>
      </div>
    );
  }

  if (!invite) {
    return <div className="h-40 w-full max-w-sm animate-pulse rounded-2xl border border-white/10 bg-white/[0.03]" />;
  }

  return (
    <div className="w-full max-w-sm">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500">
          <ShieldCheck className="h-5 w-5 text-white" />
        </div>
        <h1 className="text-xl font-semibold text-white">Join {invite.businessName}</h1>
        <p className="mt-1 text-sm text-white/40">
          You&apos;ve been invited as <span className="text-white/70">{ROLE_LABEL[invite.role] || invite.role}</span>
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/60">
          <Mail className="h-4 w-4 text-white/30" />
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
    <div className="flex min-h-screen items-center justify-center bg-neutral-950 px-4">
      <Suspense fallback={<div className="h-40 w-full max-w-sm animate-pulse rounded-2xl border border-white/10 bg-white/[0.03]" />}>
        <AcceptInviteForm />
      </Suspense>
    </div>
  );
}
