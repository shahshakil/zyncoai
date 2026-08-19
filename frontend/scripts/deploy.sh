#!/usr/bin/env bash
# Zero-downtime frontend deploy.
#
# 2026-08-19 — replaces the previous `rm -rf .next && npm run build && pm2
# restart` sequence, which deleted the directory the live `next start`
# process was actively reading from for the entire build duration. Real
# visitor-facing 500s during that window were confirmed in nginx access
# logs (MODULE_NOT_FOUND on lazily-`require()`d route files that had just
# been deleted out from under the running process).
#
# This instead builds into an isolated directory (NEXT_BUILD_DIR, see
# next.config.mjs) that the live process never touches, then swaps it into
# place with two plain `mv` (rename) calls — a rename on the same
# filesystem is a single atomic directory-entry update, not a copy, so the
# live .next is either the old build or the new build at every instant,
# never neither. `pm2 restart` immediately after picks up the new build.
set -euo pipefail
cd "$(dirname "$0")/.."

STAGING_DIR=".next-staging"
PREVIOUS_DIR=".next-previous"

echo "[deploy] typecheck..."
npx tsc --noEmit

echo "[deploy] fabrication check..."
node scripts/marketing-fabrication-check.mjs

echo "[deploy] cleaning up any leftover staging dir from a prior failed run..."
rm -rf "$STAGING_DIR"

# Next auto-appends "<distDir>/types/**/*.ts" to tsconfig.json's `include`
# on every build, but never removes a PREVIOUS distDir's entry. Building
# into a new staging dir while the live .next still exists (deliberately,
# so it keeps serving) left both ".next/types/**/*.ts" (stale, old build)
# and ".next-staging/types/**/*.ts" (fresh) in `include` at once —
# confirmed live to break Next's own page-export type validation with a
# false "not a valid Page export field" error on an unrelated, unchanged
# file. Strip any stale `.next*/types/**/*.ts` entries before each build;
# Next re-adds the one correct entry for the current distDir every time.
echo "[deploy] resetting stale .next*/types/**/*.ts entries in tsconfig.json..."
node -e '
const fs = require("fs");
const path = "tsconfig.json";
const cfg = JSON.parse(fs.readFileSync(path, "utf8"));
cfg.include = cfg.include.filter((p) => !/^\.next.*\/types\/\*\*\/\*\.ts$/.test(p));
fs.writeFileSync(path, JSON.stringify(cfg, null, 2) + "\n");
'

echo "[deploy] building into $STAGING_DIR (live .next untouched)..."
NEXT_BUILD_DIR="$STAGING_DIR" npm run build

if [ ! -d "$STAGING_DIR" ]; then
  echo "[deploy] FAILED: build did not produce $STAGING_DIR" >&2
  exit 1
fi

echo "[deploy] build + smoke test passed. Swapping in..."
rm -rf "$PREVIOUS_DIR"
if [ -d .next ]; then
  mv .next "$PREVIOUS_DIR"
fi
mv "$STAGING_DIR" .next

echo "[deploy] restarting pm2 process..."
pm2 restart frontend

echo "[deploy] verifying no orphan process on port 3000..."
sleep 3
TRACKED_PID=$(cat /root/.pm2/pids/frontend-57.pid)
PORT_PID=$(ss -ltnp | grep ":3000 " | grep -oP 'pid=\K[0-9]+' || true)
echo "  pm2-tracked pid: $TRACKED_PID"
echo "  port 3000 pid:   $PORT_PID"
if [ -z "$PORT_PID" ]; then
  echo "[deploy] WARNING: nothing is listening on port 3000 yet — check pm2 logs." >&2
fi

echo "[deploy] done. Previous build kept at $PREVIOUS_DIR for rollback (removed on next deploy)."
