import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/Logger';

// Setup Prisma with logging in development
const prismaLoggingOptions = process.env.NODE_ENV === 'development'
  ? {
      log: [
        { emit: 'event', level: 'query' },
        { emit: 'event', level: 'error' },
        { emit: 'event', level: 'info' },
        { emit: 'event', level: 'warn' },
      ],
    }
  : {};

export const prisma = new PrismaClient(prismaLoggingOptions);

// Log Prisma queries in development
if (process.env.NODE_ENV === 'development') {
  prisma.$on('query', (e: any) => {
    logger.debug('Prisma Query:', e);
  });

  prisma.$on('error', (e: any) => {
    logger.error('Prisma Error:', e);
  });

  prisma.$on('info', (e: any) => {
    logger.info('Prisma Info:', e);
  });

  prisma.$on('warn', (e: any) => {
    logger.warn('Prisma Warning:', e);
  });
} 