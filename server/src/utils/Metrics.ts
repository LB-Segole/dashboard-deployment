import { config } from '@/config';
import { logger } from './logger';

class Metrics {
  private static instance: Metrics;
  private metricsEnabled: boolean;

  private constructor() {
    this.metricsEnabled = config.monitoring.enableMetrics;
  }

  public static getInstance(): Metrics {
    if (!Metrics.instance) {
      Metrics.instance = new Metrics();
    }
    return Metrics.instance;
  }

  increment(metric: string, value: number = 1, tags: Record<string, string> = {}): void {
    if (!this.metricsEnabled) return;

    try {
      // Here you would integrate with your metrics provider (e.g., Datadog, StatsD, Prometheus)
      // For now, we'll just log the metrics in development
      if (config.isDevelopment) {
        logger.debug('Metric increment', { metric, value, tags });
      }
    } catch (error) {
      logger.error('Failed to increment metric', { metric, value, tags, error });
    }
  }

  timing(metric: string, value: number, tags: Record<string, string> = {}): void {
    if (!this.metricsEnabled) return;

    try {
      // Here you would integrate with your metrics provider
      if (config.isDevelopment) {
        logger.debug('Metric timing', { metric, value, tags });
      }
    } catch (error) {
      logger.error('Failed to record timing metric', { metric, value, tags, error });
    }
  }

  gauge(metric: string, value: number, tags: Record<string, string> = {}): void {
    if (!this.metricsEnabled) return;

    try {
      // Here you would integrate with your metrics provider
      if (config.isDevelopment) {
        logger.debug('Metric gauge', { metric, value, tags });
      }
    } catch (error) {
      logger.error('Failed to record gauge metric', { metric, value, tags, error });
    }
  }
}

export const metrics = Metrics.getInstance(); 