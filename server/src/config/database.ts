import { config } from './index';
import { Pool, PoolClient, QueryResult, QueryResultRow, QueryConfig, Submittable } from 'pg';
import { logger } from '@/utils/Logger';

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

interface QueryOptions {
  name?: string;
  values?: any[];
  timeout?: number;
  retryAttempts?: number;
}

class DatabasePool {
  private pool: Pool;
  private static instance: DatabasePool;
  private readonly maxRetryAttempts = 3;
  private readonly retryDelay = 1000;
  private readonly queryTimeout = config.db.statementTimeout;
  private healthCheckInterval: NodeJS.Timeout | null = null;

  private constructor() {
    this.pool = new Pool({
      connectionString: config.db.url,
      ssl: config.db.ssl ? { rejectUnauthorized: false } : false,
      max: config.db.poolSize,
      idleTimeoutMillis: config.db.idleTimeout,
      connectionTimeoutMillis: config.db.connectionTimeout,
      statement_timeout: config.db.statementTimeout,
    });

    this.setupEventHandlers();
    this.startHealthCheck();
  }

  private setupEventHandlers(): void {
    this.pool.on('connect', (client: PoolClient) => {
      logger.info('New client connected to database');
      metrics.increment('database.connections.total');
      metrics.gauge('database.connections.active', this.pool.totalCount);

      client.on('error', (err: Error) => {
        logger.error('Database client error', { error: err });
        metrics.increment('database.errors');
      });
    });

    this.pool.on('error', (err: Error) => {
      logger.error('Unexpected error on idle client', { error: err });
      metrics.increment('database.pool.errors');
      
      if (config.isProduction) {
        process.exit(1);
      }
    });

    this.pool.on('remove', () => {
      logger.info('Client removed from pool');
      metrics.gauge('database.connections.active', this.pool.totalCount);
    });
  }

  private startHealthCheck(): void {
    if (this.healthCheckInterval) return;

    this.healthCheckInterval = setInterval(async () => {
      try {
        await this.query('SELECT 1');
        metrics.gauge('database.health', 1);
      } catch (error) {
        logger.error('Database health check failed', { error });
        metrics.gauge('database.health', 0);
      }
    }, 30000); // Every 30 seconds
  }

  public static getInstance(): DatabasePool {
    if (!DatabasePool.instance) {
      DatabasePool.instance = new DatabasePool();
    }
    return DatabasePool.instance;
  }

  private async retryQuery<T extends QueryResultRow>(
    queryFn: () => Promise<QueryResult<T>>,
    attempts: number = 0
  ): Promise<QueryResult<T>> {
    try {
      return await queryFn();
    } catch (error: any) {
      if (
        attempts < this.maxRetryAttempts &&
        (error.code === '40P01' || // Deadlock
         error.code === '40001' || // Serialization failure
         error.code === '08006' || // Connection failure
         error.code === '08001' || // Unable to connect
         error.code === '08004')   // Rejected connection
      ) {
        logger.warn('Retrying failed query', {
          attempt: attempts + 1,
          error: error.message,
          code: error.code,
        });

        await new Promise(resolve => setTimeout(resolve, this.retryDelay * Math.pow(2, attempts)));
        return this.retryQuery(queryFn, attempts + 1);
      }

      throw error;
    }
  }

  public async query<T extends QueryResultRow = any>(
    text: string,
    options: QueryOptions = {}
  ): Promise<QueryResult<T>> {
    const queryStartTime = Date.now();
    const client = await this.pool.connect();

    try {
      const queryConfig: QueryConfig = {
        text,
        name: options.name,
        values: options.values,
      };

      const queryFn = () => client.query<T>(queryConfig);
      const res = await this.retryQuery<T>(queryFn, 0);

      const duration = Date.now() - queryStartTime;
      metrics.timing('database.query.duration', duration);
      metrics.increment('database.query.total');

      if (config.logging.enableQueryLogging) {
        logger.debug('Executed query', {
          text: text.substring(0, 200), // Truncate long queries
          duration,
          rows: res.rowCount,
          name: options.name,
        });
      }

      return res;
    } catch (error: any) {
      metrics.increment('database.query.errors');
      logger.error('Query error', {
        text: text.substring(0, 200),
        error: error.message,
        code: error.code,
        name: options.name,
      });
      throw error;
    } finally {
      client.release();
    }
  }

  public async getClient(): Promise<PoolClient> {
    const client = await this.pool.connect();

    // Set a timeout to detect potential connection leaks
    const timeoutId = setTimeout(() => {
      logger.warn('Client has been checked out for more than 5 seconds!');
      metrics.increment('database.connection.leaks');
    }, 5000);

    // Store original methods
    const originalQuery = client.query.bind(client);
    const originalRelease = client.release.bind(client);

    // Wrap query method with monitoring
    const wrappedQuery = async <T extends QueryResultRow = any>(
      config: QueryConfig | string,
      values?: any[],
      callback?: (err: Error, result: QueryResult<T>) => void
    ): Promise<QueryResult<T>> => {
      const startTime = Date.now();
      try {
        let result: QueryResult<T>;
        if (typeof config === 'string') {
          result = await originalQuery(config, values);
        } else {
          result = await originalQuery(config);
        }
        metrics.timing('database.client.query.duration', Date.now() - startTime);
        return result;
      } catch (error) {
        metrics.increment('database.client.query.errors');
        throw error;
      }
    };

    // Type assertion to match the expected interface
    client.query = wrappedQuery as typeof client.query;

    // Wrap release method
    client.release = (err?: Error | boolean) => {
      clearTimeout(timeoutId);
      client.query = originalQuery;
      client.release = originalRelease;
      return originalRelease(err);
    };

    return client;
  }

  public async end(): Promise<void> {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
    }

    await this.pool.end();
    logger.info('Database pool has been closed');
  }

  public getPool(): Pool {
    return this.pool;
  }

  public getStats() {
    return {
      totalCount: this.pool.totalCount,
      idleCount: this.pool.idleCount,
      waitingCount: this.pool.waitingCount,
    };
  }
}

// Export singleton instance
export const db = DatabasePool.getInstance();
export default db;