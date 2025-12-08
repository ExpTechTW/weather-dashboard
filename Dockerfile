FROM oven/bun:1.3.4 AS builder

WORKDIR /app

COPY package*.json ./

RUN bun i

COPY . .

RUN bun run build

FROM oven/bun:1.3.4 AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

CMD ["bun", "server.js"]