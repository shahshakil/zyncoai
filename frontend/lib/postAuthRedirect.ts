// Shared by login/page.tsx, setup-mfa/page.tsx, and verify-mfa/page.tsx —
// all three are "just finished authenticating" landing points that need
// the identical next-destination logic (an explicit `next` param, else the
// dashboard if onboarding is done, else onboarding itself).
//
// Deliberately a hard navigation (window.location.href), not router.push.
// The login page prefetches /dashboard on hover/focus for perceived speed —
// but that prefetch fires while the user is still unauthenticated, so it
// goes through middleware.ts unauthenticated and gets cached by Next's
// client router as a redirect-to-/login response. router.push() to the same
// href can then reuse that cached redirect instead of issuing a fresh
// request, bouncing a just-logged-in user straight back to /login (this is
// exactly the "first login always fails, second works" symptom — the second
// attempt succeeds once the cache entry has expired or a hard reload
// cleared it). A full page load bypasses the client router cache entirely,
// so this request always goes out fresh with the just-set session cookie.
export async function redirectAfterAuth(next: string | null) {
  const statusRes = await fetch("/api/business/onboarding/business/status", { credentials: "include" });
  const status = await statusRes.json().catch(() => ({ hasBusiness: false }));

  const dest = next && next !== "/login" && next !== "/dashboard" ? next : status.hasBusiness ? "/dashboard" : "/onboarding";
  window.location.href = dest;
}
