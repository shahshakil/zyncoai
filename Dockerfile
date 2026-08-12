# ============================
#  STAGE 1 — Builder
# ============================
FROM node:20-alpine AS builder

# Install build tools
RUN apk add --no-cache bash git python3 build-base libc6-compat

WORKDIR /app

# Copy only package files first (better caching)
COPY package*.json ./

# Install full dependencies
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Build TypeScript → dist/
RUN npm run build

# Cleanup dev deps
RUN npm prune --omit=dev


# ============================
#  STAGE 2 — Final Runtime
# ============================
FROM node:20-alpine

RUN apk add --no-cache bash curl libc6-compat

WORKDIR /app

# Copy built JS and node_modules from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json .

# Expose API port
EXPOSE 5000

# ============================
#  RUN THE REAL API GATEWAY
# ============================
CMD ["node", "dist/api/server.js"]
