# Etapa 1: Build
FROM node:20-alpine AS builder

# Define diretório de trabalho
WORKDIR /app

# Copia apenas os arquivos essenciais para instalação
COPY package.json pnpm-lock.yaml ./
COPY tsconfig.json ./
COPY prisma ./prisma
COPY src ./src

# Instala pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Instala todas as dependências (incluindo devDependencies para ter o Prisma CLI)
RUN pnpm install --frozen-lockfile

# Gera Prisma Client
RUN pnpm prisma generate

# Compila com tsup
RUN pnpm build

# Etapa 2: Produção
FROM node:20-alpine

WORKDIR /app

# Copia arquivos necessários da etapa anterior
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/prisma ./prisma

# Instala pnpm na imagem final
RUN corepack enable && corepack prepare pnpm@latest --activate

# Redefine novamente se Prisma Client usa diretório default
ENV NODE_ENV=production
ENV PORT=3333

# Expõe a porta da aplicação
EXPOSE 3333

# Executa as migrações do Prisma e depois inicia a aplicação
CMD ["sh", "-c", "pnpm install && pnpm migrate:deploy && node dist/server.js"]