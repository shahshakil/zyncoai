// Shared by login/page.tsx, setup-mfa/page.tsx, and verify-mfa/page.tsx —
// all three are "just finished authenticating" landing points that need
// the identical next-destination logic (an explicit `next` param, else the
// dashboard if onboarding is done, else onboarding itself).
export async function redirectAfterAuth(router: { push: (href: string) => void; refresh: () => void }, next: string | null) {
  const statusRes = await fetch("/api/business/onboarding/business/status", { credentials: "include" });
  const status = await statusRes.json().catch(() => ({ hasBusiness: false }));

  if (next && next !== "/login" && next !== "/dashboard") {
    router.push(next);
  } else if (status.hasBusiness) {
    router.push("/dashboard");
  } else {
    router.push("/onboarding");
  }
  router.refresh();
}
