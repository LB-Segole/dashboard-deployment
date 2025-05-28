import Redis from 'ioredis';
import { config } from '../config';
import { logger } from '../utils/Logger';

class RedisConnection {
  private client: Redis | null = null;
  private isConnected = false;

  async connect(): Promise<void> {
    if (this.isConnected) {
      return;
    }

    const options = {
      host: config.redis.host,
      port: config.redis.port,
      password: config.redis.password,
      tls: config.redis.tls ? {} : undefined,
      retryStrategy: (times: number) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
      maxRetriesPerRequest: 3,
    };

    this.client = new Redis(options);

    this.client.on('connect', () => {
      this.isConnected = true;
      logger.info('Redis connected');
    });

    this.client.on('error', (error) => {
      logger.error('Redis error:', error);
    });

    this.client.on('close', () => {
      this.isConnected = false;
      logger.warn('Redis connection closed');
    });

    await new Promise<void>((resolve, reject) => {
      this.client?.once('ready', () => resolve());
      this.client?.once('error', reject);
    });
  }

  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.quit();
      this.client = null;
      this.isConnected = false;
    }
  }

  getClient(): Redis {
    if (!this.client || !this.isConnected) {
      throw new Error('Redis client not connected');
    }
    return this.client;
  }

  async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    const client = this.getClient();
    if (ttlSeconds) {
      await client.setex(key, ttlSeconds, value);
    } else {
      await client.set(key, value);
    }
  }

  async get(key: string): Promise<string | null> {
    const client = this.getClient();
    return client.get(key);
  }

  async del(key: string): Promise<void> {
    const client = this.getClient();
    await client.del(key);
  }

  async incr(key: string): Promise<number> {
    const client = this.getClient();
    return client.incr(key);
  }

  async expire(key: string, seconds: number): Promise<void> {
    const client = this.getClient();
    await client.expire(key, seconds);
  }
}

export const RedisClient = new RedisConnection(); 