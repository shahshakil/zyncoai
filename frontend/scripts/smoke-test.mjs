#!/usr/bin/env node
// 2026-08-16 — production incident: zyncoai.com showed a blank
// "Application error" page for some visitors. Root cause turned out to be
// a stale-client-after-redeploy Server Action ID mismatch (deploy-timing,
// not fixable by any pre-deploy check), but the same class of symptom —
// the whole page going blank — is exactly what happens if a component
// throws during server-side render (e.g. a bad data.ts entry, a dangling
// reference to a removed vendor). This smoke test catches THAT case:
// starts the just-built app for real, fetches the homepage + a couple of
// /solutions pages, and fails the build if any of them 500 or render
// without their expected real content. It cannot catch a purely
// client-side-only crash (nothing to fetch differs between "just built"
// and "stale client after a later redeploy") — pair with app/error.tsx +
// app/global-error.tsx (added same day) for that class instead.
import { spawn, execSync } from "child_process";
import { setTimeout as sleep } from "timers/promises";

const PORT = 4173;
const BASE = `http://127.0.0.1:${PORT}`;
const READY_TIMEOUT_MS = 30_000;

const PAGES = [
  { path: "/", mustInclude: "Never miss another call" },
  { path: "/solutions/healthcare", mustInclude: "Healthcare" },
  { path: "/solutions/restaurant", mustInclude: "Restaurant" },
  { path: "/features", mustInclude: "What Ella actually does" },
  { path: "/resources/blog", mustInclude: "The ZyncoAI Blog" },
  { path: "/faq", mustInclude: "Frequently asked questions" },
];

// HTTP-poll for readiness rather than matching stdout text — Next's exact
// "ready"/"started" wording isn't stable across versions/output modes, and
// a missed match hangs forever with no failure signal. A plain fetch loop
// only cares whether the server actually answers, which is what matters.
function waitForReady(proc) {
  return new Promise((resolve, reject) => {
    let settled = false;
    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      reject(new Error(`server didn't start within ${READY_TIMEOUT_MS}ms`));
    }, READY_TIMEOUT_MS);

    proc.on("exit", (code) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      reject(new Error(`server process exited early with code ${code}`));
    });

    (async () => {
      while (!settled) {
        try {
          await fetch(BASE, { signal: AbortSignal.timeout(2000) });
          if (settled) return;
          settled = true;
          clearTimeout(timer);
          resolve();
          return;
        } catch {
          await sleep(500);
        }
      }
    })();
  });
}

// Idempotency guard: a previous run that got killed uncleanly (e.g. the
// harness itself timing out) can leave a orphaned `next start` still bound
// to PORT, which then makes THIS run either EADDRINUSE or — worse —
// silently pass by answering requests against stale build output while the
// real new server fails to bind. Always clear the port first.
function killWhoeverHasThePort() {
  try {
    const pids = execSync(`lsof -ti:${PORT}`, { encoding: "utf8" }).trim();
    if (pids) {
      console.log(`[smoke-test] port ${PORT} already in use by pid(s) ${pids.split("\n").join(",")} — killing`);
      execSync(`kill -9 ${pids.split("\n").join(" ")}`);
    }
  } catch {
    // lsof exits non-zero when nothing matches — the common case, not an error.
  }
}

async function main() {
  killWhoeverHasThePort();
  console.log(`[smoke-test] starting production server on port ${PORT}...`);
  // `next` isn't always at frontend/node_modules/.bin (hoisted to the
  // workspace root in this repo) — go through npx to resolve it correctly
  // either way. npx spawns next as its own child, which is exactly why
  // `detached: true` + killing the whole process GROUP (negative PID,
  // below) matters: killing only the npx wrapper left an orphaned `next
  // start` still bound to PORT on a prior run.
  const proc = spawn("npx", ["--no-install", "next", "start", "-p", String(PORT)], {
    cwd: process.cwd(),
    env: { ...process.env, NODE_ENV: "production" },
    detached: true,
  });
  proc.stderr.pipe(process.stderr);

  let failures = [];
  try {
    await waitForReady(proc);
    // A few hundred ms grace period past the "ready" log line before the
    // very first request — avoids a flaky false failure on a slow box.
    await sleep(500);

    for (const { path, mustInclude } of PAGES) {
      const url = `${BASE}${path}`;
      try {
        const res = await fetch(url);
        const body = await res.text();
        if (res.status >= 500) {
          failures.push(`${path} -> HTTP ${res.status}`);
          continue;
        }
        if (/Application error/i.test(body)) {
          failures.push(`${path} -> rendered "Application error" in the response body`);
          continue;
        }
        if (!body.includes(mustInclude)) {
          failures.push(`${path} -> missing expected content ("${mustInclude}") — page likely rendered blank/broken`);
          continue;
        }
        console.log(`[smoke-test] OK   ${path}`);
      } catch (err) {
        failures.push(`${path} -> request failed: ${err.message}`);
      }
    }
  } finally {
    // Negative PID = kill the whole detached process group, not just the
    // immediate child — see the detached:true comment above for why.
    try {
      process.kill(-proc.pid, "SIGKILL");
    } catch {
      // already exited
    }
  }

  if (failures.length) {
    console.error("\n[smoke-test] FAILED:");
    for (const f of failures) console.error(`  - ${f}`);
    console.error(`\n${failures.length} page(s) failed to render — blocking this build.`);
    process.exit(1);
  }

  console.log(`\n[smoke-test] PASS — ${PAGES.length} page(s) rendered real content, no server errors.`);
}

main().catch((err) => {
  console.error("[smoke-test] fatal:", err);
  process.exit(1);
});
