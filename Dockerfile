##### DEPENDENCIES
ARG PLATFORM=linux/amd64
FROM --platform=${PLATFORM} node:20-alpine AS deps
WORKDIR /app

COPY package.json package-lock.json ./

RUN \
    if [ -f package-lock.json ]; then npm ci; \
    else echo "Lockfile not found." && exit 1; \
    fi

##### BUILDER

FROM --platform=${PLATFORM} node:20-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npx prisma generate
RUN npx prisma db push

ENV NEXT_TELEMETRY_DISABLED=1

RUN \
    if [ -f package-lock.json ]; then SKIP_ENV_VALIDATION=1 npm run build --verbose; \
    else echo "Lockfile not found." && exit 1; \
    fi

##### RUNNER

FROM --platform=${PLATFORM} gcr.io/distroless/nodejs20-debian12 AS runner

WORKDIR /app

COPY --from=builder /app/next.config.ts ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

ENV NEXT_TELEMETRY_DISABLED=1
ENV UV_THREADPOOL_SIZE=14

EXPOSE 3000
ENV PORT=3000

CMD ["server.js"]