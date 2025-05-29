FROM node:18-alpine as base
WORKDIR /app
COPY package*.json ./

# Development target
FROM base as development
RUN npm install
COPY . .
EXPOSE 4000
CMD ["npm", "run", "dev"]

# Production target
FROM base as production
RUN npm ci
RUN npm uninstall husky
RUN npm ci --omit=dev
COPY . .
EXPOSE 4000
CMD ["npm", "start"]