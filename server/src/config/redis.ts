import { config } from './index';
import { createClient, RedisClientType, RedisDefaultModules, RedisFunctions, RedisScripts } from 'redis';
import { logger } from '@/utils/Logger';
import { EventEmitter } from 'events';

type RedisClient = RedisClientType<RedisDefaultModules & RedisFunctions & RedisScripts>;

// Metrics interface (to be implemented)
interface Metrics {
  increment(key: string): void;
  gauge(key: string, value: number): void;
  timing(key: string, value: number): void;
}

// Temporary metrics implementation until proper metrics service is set up
const metrics: Metrics = {
  increment: (key: string) => logger.debug(`Metric increment: ${key}`),
  gauge: (key: string, value: number) => logger.debug(`Metric gauge: ${key} = ${value}`),
  timing: (key: string, value: number) => logger.debug(`Metric timing: ${key} = ${value}ms`),
};

interface CacheOptions {
  ttl?: number;
  nx?: boolean; // Only set if key does not exist
  xx?: boolean; // Only set if key exists
}

class RedisService extends EventEmitter {
  private client!: RedisClient;
  private isConnected: boolean = false;
  private reconnectAttempts: number = 0;
  private static instance: RedisService;
  private readonly maxReconnectAttempts = config.redis?.maxRetries ?? 10;
  private readonly initialReconnectDelay = 100;
  private readonly maxReconnectDelay = 5000;
  private healthCheckInterval: NodeJS.Timeout | null = null;

  private constructor() {
    super();

    if (!config.redis?.url) {
      logger.warn('Redis URL not configured, Redis service will not be available');
      return;
    }

    this.initializeClient();
    this.setupEventHandlers();
    this.startHealthCheck();
    this.connect();
  }

  private initializeClient(): void {
    this.client = createClient({
      url: config.redis!.url,
      socket: {
        tls: config.redis!.tls,
        reconnectStrategy: (retries) => this.handleReconnectStrategy(retries),
        connectTimeout: 5000,
        keepAlive: 5000,
      },
      commandsQueueMaxLength: 100,
      disableOfflineQueue: true,
    });
  }

  private setupEventHandlers(): void {
    if (!this.client) return;

    this.client.on('error', (error) => {
      logger.error('Redis client error', { error });
      this.isConnected = false;
      metrics.increment('redis.errors');
      this.emit('error', error);
    });

    this.client.on('connect', () => {
      logger.info('Redis client connected');
      this.isConnected = true;
      this.reconnectAttempts = 0;
      metrics.increment('redis.connections');
      metrics.gauge('redis.connected', 1);
      this.emit('connect');
    });

    this.client.on('reconnecting', () => {
      logger.warn('Redis client reconnecting', {
        attempt: this.reconnectAttempts + 1,
      });
      metrics.increment('redis.reconnects');
      metrics.gauge('redis.connected', 0);
      this.emit('reconnecting');
    });

    this.client.on('end', () => {
      logger.info('Redis client connection closed');
      this.isConnected = false;
      metrics.gauge('redis.connected', 0);
      this.emit('end');
    });

    this.client.on('ready', () => {
      logger.info('Redis client ready');
      metrics.gauge('redis.ready', 1);
      this.emit('ready');
    });
  }

  private startHealthCheck(): void {
    if (this.healthCheckInterval) return;

    this.healthCheckInterval = setInterval(async () => {
      try {
        if (this.isConnected && this.client) {
          await this.client.ping();
          metrics.gauge('redis.health', 1);
        }
      } catch (error) {
        logger.error('Redis health check failed', { error });
        metrics.gauge('redis.health', 0);
      }
    }, 30000); // Every 30 seconds
  }

  private handleReconnectStrategy(retries: number): number | Error {
    this.reconnectAttempts = retries;

    if (retries >= this.maxReconnectAttempts) {
      const error = new Error('Max reconnection attempts reached');
      logger.error('Redis reconnection failed', { error });
      metrics.increment('redis.reconnect.failures');
      this.emit('reconnectFailed', error);
      return error;
    }

    const delay = Math.min(
      this.initialReconnectDelay * Math.pow(2, retries),
      this.maxReconnectDelay
    );

    logger.debug('Redis reconnect strategy', { retries, delay });
    return delay;
  }

  private async connect(): Promise<void> {
    if (!this.client) return;

    try {
      await this.client.connect();
    } catch (error) {
      logger.error('Failed to connect to Redis', { error });
      metrics.increment('redis.connect.failures');
      throw error;
    }
  }

  public static getInstance(): RedisService {
    if (!RedisService.instance) {
      RedisService.instance = new RedisService();
    }
    return RedisService.instance;
  }

  public async get<T = any>(key: string): Promise<T | null> {
    if (!this.isConnected || !this.client) {
      logger.warn('Redis not connected, skipping get operation');
      metrics.increment('redis.operations.skipped');
      return null;
    }

    const startTime = Date.now();
    try {
      const value = await this.client.get(key);
      metrics.timing('redis.get.duration', Date.now() - startTime);
      metrics.increment('redis.get.total');
      return value ? JSON.parse(value) : null;
    } catch (error) {
      logger.error('Redis get error', { error, key });
      metrics.increment('redis.get.errors');
      return null;
    }
  }

  public async set(
    key: string,
    value: any,
    options: CacheOptions = {}
  ): Promise<boolean> {
    if (!this.isConnected || !this.client) {
      logger.warn('Redis not connected, skipping set operation');
      metrics.increment('redis.operations.skipped');
      return false;
    }

    const startTime = Date.now();
    try {
      const stringValue = JSON.stringify(value);
      const setOptions: any = {};

      if (options.ttl) {
        setOptions.EX = options.ttl;
      }
      if (options.nx) {
        setOptions.NX = true;
      }
      if (options.xx) {
        setOptions.XX = true;
      }

      await this.client.set(key, stringValue, setOptions);
      metrics.timing('redis.set.duration', Date.now() - startTime);
      metrics.increment('redis.set.total');
      return true;
    } catch (error) {
      logger.error('Redis set error', { error, key });
      metrics.increment('redis.set.errors');
      return false;
    }
  }

  public async delete(key: string): Promise<boolean> {
    if (!this.isConnected || !this.client) {
      logger.warn('Redis not connected, skipping delete operation');
      metrics.increment('redis.operations.skipped');
      return false;
    }

    const startTime = Date.now();
    try {
      await this.client.del(key);
      metrics.timing('redis.delete.duration', Date.now() - startTime);
      metrics.increment('redis.delete.total');
      return true;
    } catch (error) {
      logger.error('Redis delete error', { error, key });
      metrics.increment('redis.delete.errors');
      return false;
    }
  }

  public async exists(key: string): Promise<boolean> {
    if (!this.isConnected || !this.client) {
      logger.warn('Redis not connected, skipping exists operation');
      metrics.increment('redis.operations.skipped');
      return false;
    }

    const startTime = Date.now();
    try {
      const result = await this.client.exists(key);
      metrics.timing('redis.exists.duration', Date.now() - startTime);
      metrics.increment('redis.exists.total');
      return result === 1;
    } catch (error) {
      logger.error('Redis exists error', { error, key });
      metrics.increment('redis.exists.errors');
      return false;
    }
  }

  public async flushAll(): Promise<boolean> {
    if (!this.isConnected || !this.client) {
      logger.warn('Redis not connected, skipping flushAll operation');
      metrics.increment('redis.operations.skipped');
      return false;
    }

    const startTime = Date.now();
    try {
      await this.client.flushAll();
      metrics.timing('redis.flushAll.duration', Date.now() - startTime);
      metrics.increment('redis.flushAll.total');
      return true;
    } catch (error) {
      logger.error('Redis flushAll error', { error });
      metrics.increment('redis.flushAll.errors');
      return false;
    }
  }

  public getClient(): RedisClient | null {
    return this.client || null;
  }

  public isReady(): boolean {
    return this.isConnected && !!this.client;
  }

  public async quit(): Promise<void> {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
    }

    if (this.isConnected && this.client) {
      try {
        await this.client.quit();
        this.isConnected = false;
        metrics.gauge('redis.connected', 0);
      } catch (error) {
        logger.error('Redis quit error', { error });
        metrics.increment('redis.quit.errors');
      }
    }
  }

  public getStats() {
    return {
      isConnected: this.isConnected,
      reconnectAttempts: this.reconnectAttempts,
    };
  }
}

// Export singleton instance
export const redis = RedisService.getInstance();
export default redis;