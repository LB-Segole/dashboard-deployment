import { env } from '../env.mjs'
import { z } from 'zod'

const cloudRunConfigSchema = z.object({
  serviceUrl: z.string().url(),
  serviceAccount: z.string().email(),
  region: z.string().default('us-central1'),
  maxInstances: z.number().int().min(1).max(1000),
  minInstances: z.number().int().min(0),
  concurrency: z.number().int().min(1).max(1000),
  healthCheck: z.object({
    path: z.string().default('/health'),
    interval: z.number().int().min(1).max(300).default(60), // seconds
    timeout: z.number().int().min(1).max(60).default(5), // seconds
    healthyThreshold: z.number().int().min(1).max(10).default(2),
    unhealthyThreshold: z.number().int().min(1).max(10).default(3),
  }).default({}),
  monitoring: z.object({
    enabled: z.boolean().default(true),
    metricsPrefix: z.string().default('cloudrun'),
    customMetrics: z.array(z.string()).default([]),
  }).default({}),
})

function parseIntSafe(value: string | undefined, defaultValue: number): number {
  if (!value) return defaultValue
  const parsed = parseInt(value, 10)
  return isNaN(parsed) ? defaultValue : parsed
}

export const cloudRunConfig = cloudRunConfigSchema.parse({
  serviceUrl: env.GOOGLE_CLOUD_RUN_SERVICE_URL,
  serviceAccount: env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  region: env.GOOGLE_CLOUD_REGION || 'us-central1',
  maxInstances: parseIntSafe(env.GOOGLE_CLOUD_MAX_INSTANCES, 5),
  minInstances: parseIntSafe(env.GOOGLE_CLOUD_MIN_INSTANCES, 0),
  concurrency: parseIntSafe(env.GOOGLE_CLOUD_CONCURRENCY, 80),
  healthCheck: {
    path: env.GOOGLE_CLOUD_HEALTH_CHECK_PATH || '/health',
    interval: parseIntSafe(env.GOOGLE_CLOUD_HEALTH_CHECK_INTERVAL, 60),
    timeout: parseIntSafe(env.GOOGLE_CLOUD_HEALTH_CHECK_TIMEOUT, 5),
    healthyThreshold: parseIntSafe(env.GOOGLE_CLOUD_HEALTH_CHECK_HEALTHY_THRESHOLD, 2),
    unhealthyThreshold: parseIntSafe(env.GOOGLE_CLOUD_HEALTH_CHECK_UNHEALTHY_THRESHOLD, 3),
  },
  monitoring: {
    enabled: env.GOOGLE_CLOUD_MONITORING_ENABLED !== 'false',
    metricsPrefix: env.GOOGLE_CLOUD_METRICS_PREFIX || 'cloudrun',
    customMetrics: env.GOOGLE_CLOUD_CUSTOM_METRICS?.split(',').filter(Boolean) || [],
  },
})

export type CloudRunConfig = z.infer<typeof cloudRunConfigSchema>

// Export schema for validation in other parts of the application
export const cloudRunConfigValidationSchema = cloudRunConfigSchema