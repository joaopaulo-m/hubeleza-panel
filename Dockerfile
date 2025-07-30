# Base leve
FROM node:22-alpine AS base
WORKDIR /app
ENV NODE_ENV=production

# Instalar Corepack e habilitar pnpm (em base, serve para etapas que herdarem)
RUN corepack enable && corepack prepare pnpm@latest --activate

# Instalação de dependências
FROM base AS deps
COPY package*.json pnpm-lock.yaml ./
RUN corepack enable && corepack prepare pnpm@latest --activate
RUN pnpm install --frozen-lockfile

# Build da aplicação
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Copia configs importantes para Tailwind/Shadcn
COPY next.config.ts postcss.config.mjs ./
RUN corepack enable && corepack prepare pnpm@latest --activate
RUN pnpm run build

# Imagem final mínima
FROM base AS runner
WORKDIR /app
RUN addgroup -S nodejs && adduser -S nextjs -G nodejs
COPY --chown=nextjs:nodejs --from=builder /app/.next/standalone ./
COPY --chown=nextjs:nodejs --from=builder /app/public ./public
# Se usar /app/.next/static
COPY --chown=nextjs:nodejs --from=builder /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
# Base leve
FROM node:22-alpine AS base
WORKDIR /app
ENV NODE_ENV=production

# Instalação de dependências
FROM base AS deps
COPY package*.json pnpm-lock.yaml ./
RUN corepack enable && corepack prepare pnpm@latest --activate
RUN pnpm install --frozen-lockfile

# Build da aplicação
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Copia configs importantes para Tailwind/Shadcn
COPY next.config.ts postcss.config.mjs ./
RUN corepack enable && corepack prepare pnpm@latest --activate
RUN pnpm run build

# Imagem final mínima
FROM base AS runner
WORKDIR /app
RUN addgroup -S nodejs && adduser -S nextjs -G nodejs
COPY --chown=nextjs:nodejs --from=builder /app/.next/standalone ./
COPY --chown=nextjs:nodejs --from=builder /app/public ./public
# Se usar /app/.next/static
COPY --chown=nextjs:nodejs --from=builder /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
CMD ["node", "server.js", "-H", "0.0.0.0", "-p", "3000"]

