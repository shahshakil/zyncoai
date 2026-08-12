#!/bin/bash
echo "======================================"
echo "🔍 ZYNCOAI MASTER PREFLIGHT CHECK"
echo "======================================"

ROOT="/opt/my-ai-saas"
BACKEND="$ROOT/backend"

echo "== 1️⃣ CHECK REQUIRED PACKAGES =="
REQUIRED=("node-cron" "express" "axios" "ioredis" "pg" "crypto"
"jsonwebtoken" "bullmq" "openai")

for pkg in "${REQUIRED[@]}"; do
  if ! grep -q "\"$pkg\"" "$BACKEND/package.json"; then
    echo "❌ MISSING $pkg"
  else
    echo "✔ $pkg OK"
  fi
done

echo ""
echo "== 2️⃣ CHECK PORT CONFLICTS =="
lsof -i :5000
lsof -i :5060
lsof -i :6379
lsof -i :5432
echo "✔ Port scan complete"

echo ""
echo "== 3️⃣ CHECK API_PORT in .env =="
grep -n "API_PORT" $ROOT/.env

echo ""
echo "== 4️⃣ CHECK DOCKER COMPOSE PORT MAPPING =="
grep -n "5000" $ROOT/docker-compose.yml | sed 's/^/  /'

echo ""
echo "== 5️⃣ CHECK Dockerfile EXPOSE =="
grep -R "EXPOSE" -n $BACKEND/Dockerfile

echo ""
echo "== 6️⃣ CHECK Backend Listening Port (inside container) =="
docker exec zyn-backend printenv | grep PORT

echo ""
echo "== 7️⃣ CHECK GITHUB SETTINGS =="
docker exec zyn-backend printenv | grep GITHUB

echo ""
echo "== 8️⃣ CHECK DIST ROUTES EXIST =="
ls -l $BACKEND/dist/api/routes

echo ""
echo "== 9️⃣ SEARCH FOR CONNECTOR ROUTE =="
grep -R "connectorsRouter" -n $BACKEND/dist

echo ""
echo "== 🔟 LOOK FOR CRASHING ERRORS IN LOGS =="
docker logs --tail=50 zyn-backend | sed 's/^/  /'

echo ""
echo "== 1️⃣1️⃣ VERIFY ROUTES REGISTERED =="
docker exec -it zyn-backend sh -c '
node - << "EOF"
import app from "./dist/api/server.js";

const list = [];
app._router.stack.forEach(layer => {
  if (layer.route) {
    list.push(layer.route.path + " " + Object.keys(layer.route.methods));
  } else if (layer.name === "router") {
    layer.handle.stack.forEach(r => {
      if (r.route) {
        list.push(r.route.path + " " + Object.keys(r.route.methods));
      }
    });
  }
});
console.log(list.join("\n"));
EOF
'

echo ""
echo "======================================"
echo "📌 PREFLIGHT CHECK COMPLETE"
echo "======================================"
