import { PrismaClient } from '@prisma/client';
import { config } from '../config';

// Configure Prisma client with connection pool
const prismaConfig = {
  datasources: {
    db: {
      url: config.db.url,
    },
  },
  log: config.isDevelopment ? ['query', 'error', 'warn'] : ['error'],
  connectionLimit: config.db.poolSize,
};

// Create Prisma client instance
export const prisma = new PrismaClient(prismaConfig); 