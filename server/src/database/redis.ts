import Redis from 'ioredis';
import { config } from '../config';
import { logger } from '../utils/Logger';

let redis: Redis | null = null;

if (config.redis) {
  try {
    redis = new Redis(config.redis.url, {
      tls: config.redis.tls ? {} : undefined,
      retryStrategy(times: number): number {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
      maxRetriesPerRequest: 3,
    });

    redis.on('error', (error: Error) => {
      logger.error('Redis connection error:', error);
    });

    redis.on('connect', () => {
      logger.info('Redis connected successfully');
    });
  } catch (error) {
    logger.error('Redis initialization error:', error);
  }
}

export { redis }; 