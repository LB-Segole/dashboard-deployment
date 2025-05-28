FROM node:18-alpine

# Add non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

# Install development dependencies
COPY package*.json ./
RUN npm install

# Switch to non-root user
USER appuser

# Copy source files
COPY --chown=appuser:appgroup . .

# Development port
EXPOSE 3001

# Health check for development
HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3001/health || exit 1

# Use nodemon for development
CMD ["npm", "run", "dev"]