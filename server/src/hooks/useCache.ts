import Redis from 'ioredis';
import { config } from '../config';

let redisClient: Redis | null = null;

export function useCache() {
  const getClient = (): Redis | null => {
    if (!redisClient && config.redis) {
      const redisConfig = config.redis;
      redisClient = new Redis(redisConfig.url, {
        maxRetriesPerRequest: redisConfig.maxRetries,
        retryStrategy: (times: number) => {
          if (times > redisConfig.maxRetries) return null;
          return Math.min(times * redisConfig.retryDelay, 3000);
        },
        tls: redisConfig.tls ? {} : undefined,
        password: redisConfig.password,
      });

      redisClient.on('error', (error) => {
        console.error('Redis connection error:', error);
      });
    }
    return redisClient;
  };

  const get = async <T>(key: string): Promise<T | null> => {
    const client = getClient();
    if (!client) return null;

    try {
      const value = await client.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Redis get error:', error);
      return null;
    }
  };

  const set = async <T>(
    key: string,
    value: T,
    ttlSeconds: number = config.redis?.cacheTTL || 3600
  ): Promise<boolean> => {
    const client = getClient();
    if (!client) return false;

    try {
      const result = await client.set(
        key,
        JSON.stringify(value),
        'EX',
        ttlSeconds
      );
      return result === 'OK';
    } catch (error) {
      console.error('Redis set error:', error);
      return false;
    }
  };

  const del = async (key: string): Promise<boolean> => {
    const client = getClient();
    if (!client) return false;

    try {
      const result = await client.del(key);
      return result > 0;
    } catch (error) {
      console.error('Redis delete error:', error);
      return false;
    }
  };

  const disconnect = async (): Promise<void> => {
    if (redisClient) {
      await redisClient.quit();
      redisClient = null;
    }
  };

  return {
    getClient,
    get,
    set,
    del,
    disconnect,
  };
} 