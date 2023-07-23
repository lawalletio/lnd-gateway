FROM --platform=$TARGETPLATFORM  node:18-alpine AS base
RUN npm i -g pnpm
RUN apk add --no-cache libc6-compat

FROM base AS dependencies
WORKDIR /app
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install

FROM base AS build
WORKDIR /app
COPY . .
COPY --from=dependencies /app/node_modules ./node_modules
RUN pnpm build

FROM base AS runner
WORKDIR /app
# ENV NODE_ENV production
# ENV PORT 3000
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs
COPY --from=build --chown=nodejs:nodejs /app/build/src ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json
USER nodejs

CMD ["node", "server.js"]