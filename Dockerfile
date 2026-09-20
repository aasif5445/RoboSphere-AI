# Multi-stage Dockerfile for RoboSphere AI (IEEE RAS RAG Assistant)

# Stage 1: Build Frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Production Server
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

COPY package*.json ./
RUN npm install --omit=dev

COPY --from=frontend-builder /app/dist ./dist
COPY --from=frontend-builder /app/server.ts ./

# Expose default port
EXPOSE 3000

CMD ["node", "dist/server.cjs"]
