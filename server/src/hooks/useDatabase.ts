import { PrismaClient, Prisma } from '@prisma/client';
import { config } from '../config';

let prismaClient: PrismaClient | null = null;

export function useDatabase() {
  const getClient = (): PrismaClient => {
    if (!prismaClient) {
      prismaClient = new PrismaClient({
        datasources: {
          db: {
            url: config.db.url,
          },
        },
        log: config.isDevelopment ? ['query', 'error', 'warn'] : ['error'],
      });
    }
    return prismaClient;
  };

  const withRetry = async <T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    delayMs: number = 1000
  ): Promise<T> => {
    let lastError: Error | null = null;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;
        if (attempt === maxRetries) break;
        
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, delayMs * attempt));
      }
    }
    throw lastError || new Error('Operation failed after retries');
  };

  const transaction = async <T>(
    fn: (tx: Prisma.TransactionClient) => Promise<T>
  ): Promise<T> => {
    const client = getClient();
    return await client.$transaction(async (tx) => {
      return await fn(tx);
    });
  };

  const disconnect = async (): Promise<void> => {
    if (prismaClient) {
      await prismaClient.$disconnect();
      prismaClient = null;
    }
  };

  return {
    getClient,
    withRetry,
    transaction,
    disconnect,
  };
} 