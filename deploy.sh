#!/usr/bin/env bash
set -euo pipefail

### ====== CONFIG ======
REGISTRY="registry.digitalocean.com/my-ai-saas-registry"

BACKEND_IMAGE="$REGISTRY/my-ai-saas:latest"
FRONTEND_IMAGE="$REGISTRY/my-ai-frontend:latest"

BACKEND_NAME="zyn-backend"
FRONTEND_NAME="zyn-frontend"

# Ports on the host
BACKEND_ACTIVE_PORT=5000     # live port served by Nginx /api
BACKEND_CANARY_PORT=8080     # canary port for zero-downtime
FRONTEND_PORT=3000           # live port served by Nginx /

# Healthcheck URLs
BACKEND_HC_ACTIVE="http://127.0.0.1:${BACKEND_ACTIVE_PORT}/healthz"
BACKEND_HC_CANARY="http://127.0.0.1:${BACKEND_CANARY_PORT}/healthz"
FRONTEND_HC="http://127.0.0.1:${FRONTEND_PORT}/"

log(){ printf "\n\033[1;36m[%s]\033[0m %s\n" "$(date +%H:%M:%S)" "$*"; }

wait_hc(){
  local url="$1"
  local tries=60
  while ! curl -fsS "$url" >/dev/null 2>&1; do
    tries=$((tries-1)) || true
    if [ "$tries" -le 0 ]; then
      echo "Health check FAILED: $url"
      exit 1
    fi
    sleep 1
  done
}

### ====== PULL LATEST IMAGES ======
log "Pulling latest images from DOCR..."
docker pull "$BACKEND_IMAGE"
docker pull "$FRONTEND_IMAGE"

### ====== BACKEND BLUE/GREEN ======
log "Starting BACKEND canary on :${BACKEND_CANARY_PORT}..."
docker rm -f "${BACKEND_NAME}-canary" >/dev/null 2>&1 || true
docker run -d --restart always --name "${BACKEND_NAME}-canary" \
  -p ${BACKEND_CANARY_PORT}:5000 \
  "$BACKEND_IMAGE"

log "Waiting for BACKEND canary healthcheck..."
wait_hc "$BACKEND_HC_CANARY"

log "Canary healthy. Switching live BACKEND..."
docker rm -f "${BACKEND_NAME}" >/dev/null 2>&1 || true
docker run -d --restart always --name "${BACKEND_NAME}" \
  -p ${BACKEND_ACTIVE_PORT}:5000 \
  "$BACKEND_IMAGE"

log "Waiting for BACKEND live healthcheck..."
wait_hc "$BACKEND_HC_ACTIVE"

log "Removing BACKEND canary..."
docker rm -f "${BACKEND_NAME}-canary" >/dev/null 2>&1 || true

### ====== FRONTEND QUICK RESTART ======
log "Restarting FRONTEND on :${FRONTEND_PORT}..."
docker rm -f "${FRONTEND_NAME}" >/dev/null 2>&1 || true
docker run -d --restart always --name "${FRONTEND_NAME}" \
  -p ${FRONTEND_PORT}:3000 \
  "$FRONTEND_IMAGE"

log "Waiting for FRONTEND healthcheck..."
wait_hc "$FRONTEND_HC"

### ====== SUMMARY ======
log "✅ Deploy complete."
log "Frontend:  https://zyncoai.com/"
log "Backend:   https://zyncoai.com/api"
