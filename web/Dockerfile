FROM node:18-alpine

WORKDIR /app

RUN apk add --no-cache python3 make g++ sqlite && \
    npm install -g pnpm

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm prisma generate

EXPOSE 3000

CMD ["pnpm", "dev"]
