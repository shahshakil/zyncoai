#!/bin/bash
echo "======================================"
echo "🔍 ZYNCOAI BACKEND FULL DIAGNOSTIC"
echo "======================================"

echo ""
echo "== 1️⃣ CHECK .env PORT =="
grep -n "PORT" /opt/my-ai-saas/.env || echo "❌ PORT NOT SET"

echo ""
echo "== 2️⃣ CHECK docker-compose backend port mapping =="
grep -n "backend" -n /opt/my-ai-saas/docker-compose.yml
grep -n "ports" /opt/my-ai-saas/docker-compose.yml
grep -n "5000" /opt/my-ai-saas/docker-compose.yml
grep -n "5060" /opt/my-ai-saas/docker-compose.yml

echo ""
echo "== 3️⃣ CHECK Dockerfile EXPOSE port =="
grep -n "EXPOSE" /opt/my-ai-saas/backend/Dockerfile || echo "❌ NO EXPOSE FOUND"

echo ""
echo "== 4️⃣ CHECK Dockerfile CMD ENTRYPOINT =="
grep -n "CMD" /opt/my-ai-saas/backend/Dockerfile

echo ""
echo "== 5️⃣ CHECK DIST SERVER FILES EXIST =="
ls -l /opt/my-ai-saas/backend/dist | grep server
find /opt/my-ai-saas/backend/dist -maxdepth 4 -name "server.js"

echo ""
echo "== 6️⃣ CHECK WHICH PORT BACKEND ACTUALLY LISTENS ON =="
docker logs zyn-backend 2>/dev/null | grep "listening" || echo "❌ backend not running"

echo ""
echo "== 7️⃣ CHECK ENV VAR INSIDE BACKEND CONTAINER =="
docker exec zyn-backend printenv | grep PORT || echo "❌ BACKEND HAS NO PORT VAR"

echo ""
echo "== 8️⃣ CHECK GITHUB ENV VARS INSIDE CONTAINER =="
docker exec zyn-backend printenv | grep GITHUB || echo "❌ NO GITHUB TOKEN INSIDE CONTAINER"

echo ""
echo "== 9️⃣ CHECK IF API route exists inside built JS =="
grep -R "createIssue" /opt/my-ai-saas/backend/dist/api || echo "❌ API route NOT FOUND"

echo ""
echo "== 🔟 TEST CURL TO BACKEND DIRECTLY =="
curl -s -o /dev/null -w "%{http_code}" http://localhost:5000/api/ping && echo "  <= 5000" 
curl -s -o /dev/null -w "%{http_code}" http://localhost:5060/api/ping && echo "  <= 5060"

echo ""
echo "== 1️⃣1️⃣ TEST INTERNAL CURL (IN CONTAINER) =="
docker exec zyn-backend sh -c "curl -s -o /dev/null -w '%{http_code}' http://localhost:5000/api/ping" && echo " inside 5000"
docker exec zyn-backend sh -c "curl -s -o /dev/null -w '%{http_code}' http://localhost:5060/api/ping" && echo " inside 5060"

echo ""
echo "======================================"
echo "📌 DIAGNOSTIC COMPLETE"
echo "======================================"
