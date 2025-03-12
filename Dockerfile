ARG NODE_VERSION=22.14.0

FROM node:${NODE_VERSION}-alpine

ENV PNPM_HOME="/pnpm"

ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable

WORKDIR /usr/app

COPY package*.json ./

COPY pnpm-lock.yaml ./

RUN pnpm install

COPY . .

EXPOSE 3000

CMD [ "pnpm", "run", "start:dev" ]
