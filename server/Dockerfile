FROM node:18-alpine
WORKDIR /app
COPY package*.json ./

# First install ALL dependencies (including devDependencies)
RUN npm ci

# Then remove husky and other dev-only packages
RUN npm uninstall husky

# Now install only production dependencies cleanly
RUN npm ci --omit=dev

COPY . .
EXPOSE 3000
CMD ["node", "server.js"]