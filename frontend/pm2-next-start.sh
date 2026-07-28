#!/usr/bin/env bash
set -e
cd /opt/my-ai-saas/frontend
exec /opt/my-ai-saas/node_modules/next/dist/bin/next start -p 3000
