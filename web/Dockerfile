FROM node:18-alpine

WORKDIR /app
RUN apk add --no-cache python3 make g++ sqlite \
    && npm install -g pnpm
COPY package.json pnpm-lock.yaml ./
ARG INSTALL_DEPS=true
RUN if [ "$INSTALL_DEPS" = "true" ]; then pnpm install --frozen-lockfile; fi
COPY . .
RUN npx prisma generate
ARG BUILD_APP=true
RUN if [ "$BUILD_APP" = "true" ]; then pnpm build; fi
EXPOSE 3000 5555
ARG NODE_ENV=development
ENV NODE_ENV=$NODE_ENV
CMD [ "sh", "-c", "if [ \"$NODE_ENV\" = \"production\" ]; then npx prisma migrate deploy && pnpm start; else pnpm dev; fi" ]
