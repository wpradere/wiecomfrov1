# ─────────────────────────────────────────────────────────────
# Stage 1 – Install dependencies
# ─────────────────────────────────────────────────────────────
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# ─────────────────────────────────────────────────────────────
# Stage 2 – Build
# Pass NEXT_PUBLIC_API_URL as a build argument so it gets
# embedded in the client bundle (NEXT_PUBLIC_* are build-time).
# Example:
#   docker build --build-arg NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api/v1 .
# ─────────────────────────────────────────────────────────────
FROM node:22-alpine AS builder
WORKDIR /app

ARG NEXT_PUBLIC_API_URL=/api/v1
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

# Internal Docker hostname used by Next.js rewrites — never reaches the browser
ARG INTERNAL_API_URL=http://api:8080
ENV INTERNAL_API_URL=$INTERNAL_API_URL

ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# ─────────────────────────────────────────────────────────────
# Stage 3 – Production runner (minimal image)
# ─────────────────────────────────────────────────────────────
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

RUN addgroup --system --gid 1001 nodejs \
 && adduser  --system --uid 1001 nextjs

# Standalone server entry point
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
# Static assets (JS bundles, CSS)
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
# Public folder (favicon, logos — NOT uploaded images, those go to the volume)
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# sharp is a native module — reinstall here so it picks up
# the correct Alpine (musl) binaries instead of the build-stage ones.
COPY --from=builder /app/package.json        ./package.json
COPY --from=builder /app/package-lock.json   ./package-lock.json
RUN npm install sharp --omit=dev --ignore-scripts=false \
 && chown -R nextjs:nodejs /app/node_modules/sharp

USER nextjs
EXPOSE 3000

CMD ["node", "server.js"]
