"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const ACTIVITY_KEY = "zyn_last_activity";
const WARNING_AFTER_MS = 29 * 60 * 1000; // show warning at 29 minutes idle
const LOGOUT_AFTER_MS = 30 * 60 * 1000; // hard logout at 30 minutes idle
const CHECK_INTERVAL_MS = 60 * 1000; // check once a minute, per spec
const COUNTDOWN_SECONDS = 60;
const THROTTLE_MS = 5000; // don't hammer localStorage on every mousemove

function now() {
  return Date.now();
}

function readLastActivity(): number {
  const raw = typeof window !== "undefined" ? window.localStorage.getItem(ACTIVITY_KEY) : null;
  return raw ? Number(raw) || now() : now();
}

function writeLastActivity(ts: number) {
  try {
    window.localStorage.setItem(ACTIVITY_KEY, String(ts));
  } catch {
    // localStorage unavailable (private mode etc) — session timeout simply
    // won't persist across tabs/reloads, not worth failing the page over.
  }
}

export function SessionTimeoutGuard() {
  const router = useRouter();
  const [warning, setWarning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(COUNTDOWN_SECONDS);
  const lastThrottledWrite = useRef(0);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const doLogout = useCallback(async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // still redirect even if the network call fails — cookies get cleared
      // client-side by the login page's own auth check regardless.
    }
    window.localStorage.removeItem(ACTIVITY_KEY);
    router.replace("/login?reason=inactivity");
  }, [router]);

  const stayLoggedIn = useCallback(() => {
    if (countdownRef.current) clearInterval(countdownRef.current);
    writeLastActivity(now());
    setWarning(false);
    setSecondsLeft(COUNTDOWN_SECONDS);
  }, []);

  // Track activity — throttled writes so mousemove doesn't hit localStorage
  // on every pixel.
  useEffect(() => {
    function onActivity() {
      if (warning) return; // once the warning is up, only "Stay logged in" should reset it
      const t = now();
      if (t - lastThrottledWrite.current < THROTTLE_MS) return;
      lastThrottledWrite.current = t;
      writeLastActivity(t);
    }
    const events: Array<keyof WindowEventMap> = ["mousemove", "mousedown", "click", "keypress", "scroll", "touchstart"];
    events.forEach((e) => window.addEventListener(e, onActivity, { passive: true }));
    return () => events.forEach((e) => window.removeEventListener(e, onActivity));
  }, [warning]);

  // Cross-tab sync: another tab's activity (or its own logout) should reset
  // this tab's clock too.
  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key === ACTIVITY_KEY && e.newValue === null) {
        // another tab logged out
        router.replace("/login?reason=inactivity");
      }
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [router]);

  // The actual once-a-minute inactivity check.
  useEffect(() => {
    if (!window.localStorage.getItem(ACTIVITY_KEY)) writeLastActivity(now());

    const id = setInterval(() => {
      const idleMs = now() - readLastActivity();
      if (idleMs >= LOGOUT_AFTER_MS) {
        doLogout();
      } else if (idleMs >= WARNING_AFTER_MS && !warning) {
        setWarning(true);
        setSecondsLeft(COUNTDOWN_SECONDS);
      }
    }, CHECK_INTERVAL_MS);

    return () => clearInterval(id);
  }, [warning, doLogout]);

  // 1-second countdown once the warning modal is showing.
  useEffect(() => {
    if (!warning) return;
    countdownRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          doLogout();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, [warning, doLogout]);

  if (!warning) return null;

  return (
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center bg-[#0f172a]/50 px-4 backdrop-blur-sm"
      role="alertdialog"
      aria-modal="true"
      aria-label="Session timeout warning"
    >
      <div className="w-full max-w-sm rounded-2xl border border-[#e2e8f0] bg-white p-6 text-center shadow-[0_24px_60px_rgba(15,23,42,0.25)]">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-50">
          <span className="text-2xl font-bold text-amber-600">{secondsLeft}</span>
        </div>
        <h2 className="mt-4 text-lg font-semibold text-[#0f172a]">You have been inactive for 30 minutes.</h2>
        <p className="mt-2 text-sm text-[#475569]">You will be logged out in {secondsLeft} second{secondsLeft === 1 ? "" : "s"}.</p>
        <button
          onClick={stayLoggedIn}
          className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-[image:linear-gradient(135deg,#4f46e5,#06b6d4)] px-6 py-3 text-sm font-semibold text-white hover:opacity-90"
        >
          Stay logged in
        </button>
      </div>
    </div>
  );
}
