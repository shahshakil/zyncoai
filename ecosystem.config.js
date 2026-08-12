module.exports = {
  apps: [
    // ─────────────────────────────────────────────
    // Backend API (Express)
    // ─────────────────────────────────────────────
    {
      name: "my-ai-saas-api",
      cwd: "/opt/my-ai-saas/backend",
      script: "server.js",
      // Use cluster for resilience and scale. Adjust to your CPU cores.
      exec_mode: "cluster",
      instances: 2,
      watch: false,
      autorestart: true,
      max_restarts: 20,
      listen_timeout: 10000,
      kill_timeout: 5000,
      merge_logs: true,
      time: true,
      env: {
        NODE_ENV: "production",
        HOST: "127.0.0.1",   // your server must honor this; if not, Nginx still hides the port
        PORT: "6000",
        // If your DB/worker need the CA here as well, you can set it:
        NODE_EXTRA_CA_CERTS: "/opt/my-ai-saas/backend/config/prod-ca-2021.crt"
      }
    },

    // ─────────────────────────────────────────────
    // Worker (queues / jobs)
    // ─────────────────────────────────────────────
    {
      name: "my-ai-saas-worker",
      cwd: "/opt/my-ai-saas/backend",
      script: "worker.js",
      exec_mode: "cluster",
      instances: 2,
      watch: false,
      autorestart: true,
      max_restarts: 20,
      merge_logs: true,
      time: true,
      env: {
        NODE_ENV: "production",
        // 🔐 Fix “self-signed certificate in certificate chain”
        NODE_EXTRA_CA_CERTS: "/opt/my-ai-saas/backend/config/prod-ca-2021.crt"
        // If you temporarily need to bypass SSL (NOT recommended):
        // NODE_TLS_REJECT_UNAUTHORIZED: "0"
      }
    },

    // ─────────────────────────────────────────────
    // Frontend (Next.js or CRA)
    // ─────────────────────────────────────────────
    // We launch via bash so npm is resolved properly on Ubuntu.
    // We bind Next to 127.0.0.1 so it’s not exposed publicly.
    {
      name: "my-ai-saas-frontend",
      cwd: "/opt/my-ai-saas/frontend",
      script: "bash",
      // If your frontend is Next.js (logs showed "next start"):
      args: "-c 'npm run start -- --port 3000 --hostname 127.0.0.1'",
      // If your frontend is CRA/dev server instead, use:
      // args: "-c 'npm run start'",
      exec_mode: "fork",
      instances: 1,
      watch: false,
      autorestart: true,
      max_restarts: 20,
      merge_logs: true,
      time: true,
      env: {
        NODE_ENV: "production",
        // Your frontend will call the API through Nginx on your public domain:
        NEXT_PUBLIC_API_URL: "https://zyncoai.com/api"
      }
    }
  ]
}
