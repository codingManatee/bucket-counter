FROM node:18-alpine

WORKDIR /app

RUN apk add --no-cache python3 make g++ sqlite && \
    npm install -g pnpm

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

RUN npx prisma generate
RUN pnpm build

EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy && pnpm start"]
