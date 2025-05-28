import { logger } from '@/utils/logger';
import { metrics } from '@/utils/Metrics';
import { retry } from '@/utils/retry';

export interface IntegrationConfig {
  retryAttempts?: number;
  retryDelay?: number;
  timeout?: number;
  maxRetryDelay?: number;
}

export abstract class BaseIntegration {
  protected readonly serviceName: string;
  protected readonly config: IntegrationConfig;

  constructor(serviceName: string, config: IntegrationConfig = {}) {
    this.serviceName = serviceName;
    this.config = {
      retryAttempts: 3,
      retryDelay: 1000,
      timeout: 30000,
      maxRetryDelay: 8000,
      ...config
    };
  }

  protected async executeWithRetry<T>(
    operation: () => Promise<T>,
    context: string,
    customConfig: Partial<IntegrationConfig> = {}
  ): Promise<T> {
    const startTime = Date.now();
    const mergedConfig = { ...this.config, ...customConfig };

    try {
      metrics.increment(`${this.serviceName}.${context}.attempts`);

      const result = await retry(
        operation,
        {
          retries: mergedConfig.retryAttempts!,
          factor: 2,
          minTimeout: mergedConfig.retryDelay!,
          maxTimeout: mergedConfig.maxRetryDelay!,
          onRetry: (error: Error, attempt: number) => {
            logger.warn(`${this.serviceName} operation retry`, {
              context,
              error: error.message,
              attempt,
              service: this.serviceName
            });
            metrics.increment(`${this.serviceName}.${context}.retries`);
          }
        }
      );

      const duration = Date.now() - startTime;
      metrics.timing(`${this.serviceName}.${context}.duration`, duration);
      metrics.increment(`${this.serviceName}.${context}.success`);

      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      metrics.timing(`${this.serviceName}.${context}.duration`, duration);
      metrics.increment(`${this.serviceName}.${context}.errors`);

      logger.error(`${this.serviceName} operation failed`, {
        context,
        error: error instanceof Error ? error.message : 'Unknown error',
        service: this.serviceName,
        duration
      });

      throw error;
    }
  }

  protected shouldRetry(error: any): boolean {
    // Common retry conditions across integrations
    if (error.status) {
      return [429, 500, 502, 503, 504].includes(error.status);
    }
    return ['ECONNRESET', 'ETIMEDOUT', 'ESOCKETTIMEDOUT'].includes(error.code);
  }
} 