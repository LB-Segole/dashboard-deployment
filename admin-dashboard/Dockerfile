# In your admin-dashboard/Dockerfile
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
# Copy only necessary files for build
COPY tsconfig.json ./
COPY tsconfig.node.json ./
COPY src/ ./src/
COPY public/ ./public/
RUN npm run build