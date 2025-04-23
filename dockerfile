# Etapa 1: Build
FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm

RUN pnpm install --frozen-lockfile --ignore-scripts

COPY . .

RUN pnpm build

# Etapa 2: Produção
FROM node:22-alpine AS production

WORKDIR /app

# Copia somente o necessário do builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml ./
COPY --from=builder /app/prisma ./prisma

RUN npm install -g pnpm
RUN npm install -g cross-env

RUN pnpm install --prod

EXPOSE 3333

CMD ["sh", "-c", "pnpm migrate:deploy && pnpm start:prod"]
