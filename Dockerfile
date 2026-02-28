# Stage 1: Build the Vite frontend
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Production
FROM node:20-alpine AS production
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY src/ ./src/
# Copy Vite build output into public/ so Express static serving works unchanged
COPY --from=builder /app/dist ./public/
EXPOSE 3000
CMD ["node", "src/Server.js"]
