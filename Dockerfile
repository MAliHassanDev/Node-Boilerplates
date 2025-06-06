ARG NODE_VERSION=22.14.0
# Base image with common deps
FROM node:${NODE_VERSION} AS base
WORKDIR /usr/app
COPY package*.json ./
RUN npm ci

# Development stage
FROM base AS dev
ENV NODE_ENV=development
COPY . .
CMD ["npm", "run", "start:dev"]


# Debug stage
FROM base AS debug
ENV NODE_ENV=development
COPY . .
CMD ["npm", "run", "start:debug"]

# Build stage
FROM base AS build
COPY . .
RUN npm run build

# Production stage
FROM node:${NODE_VERSION} AS prod
ENV NODE_ENV=production
WORKDIR /usr/app
COPY --from=build /usr/app/dist ./dist
COPY package*.json ./
RUN npm ci --omit=dev
CMD ["node", "dist/main"]