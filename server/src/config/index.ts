import { z } from 'zod';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables based on NODE_ENV
const envPath = process.env.NODE_ENV === 'test' 
  ? '.env.test'
  : process.env.NODE_ENV === 'production'
    ? '.env.production'
    : '.env.development';

dotenv.config({
  path: path.resolve(__dirname, `../../../${envPath}`),
});

// Environment variable validation schema
const envSchema = z.object({
  // App
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().min(1).max(65535).default(3000),
  HOST: z.string().default('0.0.0.0'),
  CORS_ORIGIN: z.string(),
  ALLOWED_ORIGINS: z.string(),
  API_VERSION: z.string().regex(/^v\d+$/).default('v1'),
  RATE_LIMIT_WINDOW: z.coerce.number().min(1).default(60000), // 1 minute
  RATE_LIMIT_MAX: z.coerce.number().min(1).default(100),

  // Database
  DATABASE_URL: z.string().url(),
  DB_SSL: z.coerce.boolean().default(false),
  DB_POOL_SIZE: z.coerce.number().min(1).max(100).default(10),
  DB_IDLE_TIMEOUT: z.coerce.number().min(1000).default(30000),
  DB_CONNECTION_TIMEOUT: z.coerce.number().min(1000).default(5000),
  DB_STATEMENT_TIMEOUT: z.coerce.number().min(1000).default(30000),

  // Redis
  REDIS_URL: z.string().url().optional(),
  REDIS_TLS: z.coerce.boolean().default(false),
  REDIS_PASSWORD: z.string().optional(),
  REDIS_CACHE_TTL: z.coerce.number().min(1).default(3600),
  REDIS_MAX_RETRIES: z.coerce.number().min(1).default(10),
  REDIS_RETRY_DELAY: z.coerce.number().min(100).default(1000),

  // JWT
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string().regex(/^\d+[hdwmy]$/).default('7d'),
  JWT_REFRESH_SECRET: z.string().min(32),
  JWT_REFRESH_EXPIRES_IN: z.string().regex(/^\d+[hdwmy]$/).default('30d'),
  JWT_ALGORITHM: z.enum(['HS256', 'HS384', 'HS512']).default('HS512'),

  // SignalWire
  SIGNALWIRE_PROJECT_ID: z.string(),
  SIGNALWIRE_TOKEN: z.string(),
  SIGNALWIRE_SPACE: z.string(),
  SIGNALWIRE_PHONE_NUMBER: z.string().regex(/^\+\d{10,15}$/),
  MAX_CALLS_PER_HOUR: z.coerce.number().min(1).default(100),
  SIGNALWIRE_RETRY_ATTEMPTS: z.coerce.number().min(1).default(3),
  SIGNALWIRE_RETRY_DELAY: z.coerce.number().min(100).default(1000),
  SIGNALWIRE_TIMEOUT: z.coerce.number().min(1000).default(30000),

  // OpenAI
  OPENAI_API_KEY: z.string(),
  OPENAI_MODEL: z.string().default('gpt-4'),
  OPENAI_TEMPERATURE: z.coerce.number().min(0).max(2).default(0.7),
  OPENAI_MAX_TOKENS: z.coerce.number().min(1).default(150),
  OPENAI_CACHE_TTL: z.coerce.number().min(1).default(3600),
  OPENAI_RATE_LIMIT: z.coerce.number().min(1).default(100),
  OPENAI_TIMEOUT: z.coerce.number().min(1000).default(30000),
  OPENAI_RETRY_ATTEMPTS: z.coerce.number().min(1).default(3),

  // Email
  SMTP_HOST: z.string(),
  SMTP_PORT: z.coerce.number().min(1).max(65535).default(587),
  SMTP_USER: z.string().optional(),
  SMTP_PASSWORD: z.string().optional(),
  EMAIL_FROM: z.string().email(),
  SMTP_SECURE: z.coerce.boolean().default(true),
  EMAIL_RETRY_ATTEMPTS: z.coerce.number().min(1).default(3),
  EMAIL_RETRY_DELAY: z.coerce.number().min(100).default(1000),

  // Monitoring
  SENTRY_DSN: z.string().url().optional(),
  NEW_RELIC_LICENSE_KEY: z.string().optional(),
  ENABLE_TRACING: z.coerce.boolean().default(false),
  MONITORING_LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('error'),
  ENABLE_METRICS: z.coerce.boolean().default(true),
  METRICS_PORT: z.coerce.number().min(1).max(65535).default(9090),

  // Logging
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
  LOG_DIR: z.string().default('logs'),
  LOG_MAX_FILES: z.coerce.number().min(1).default(10),
  LOG_MAX_SIZE: z.string().regex(/^\d+[kmg]b?$/i).default('20m'),
  LOG_FORMAT: z.enum(['json', 'pretty']).default('json'),
  ENABLE_REQUEST_LOGGING: z.coerce.boolean().default(true),
  ENABLE_QUERY_LOGGING: z.coerce.boolean().default(true),
});

// Parse and validate environment variables
const env = envSchema.parse(process.env);

// Configuration object with strict typing
export const config = {
  env: env.NODE_ENV,
  isProduction: env.NODE_ENV === 'production',
  isDevelopment: env.NODE_ENV === 'development',
  isTest: env.NODE_ENV === 'test',

  app: {
    port: env.PORT,
    host: env.HOST,
    corsOrigin: env.CORS_ORIGIN.split(',').map(origin => origin.trim()),
    allowedOrigins: env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim()),
    name: 'VoiceAI',
    version: process.env.npm_package_version ?? '1.0.0',
    apiVersion: env.API_VERSION,
    rateLimit: {
      windowMs: env.RATE_LIMIT_WINDOW,
      max: env.RATE_LIMIT_MAX,
    },
  },

  db: {
    url: env.DATABASE_URL,
    ssl: env.DB_SSL,
    poolSize: env.DB_POOL_SIZE,
    idleTimeout: env.DB_IDLE_TIMEOUT,
    connectionTimeout: env.DB_CONNECTION_TIMEOUT,
    statementTimeout: env.DB_STATEMENT_TIMEOUT,
  },

  redis: env.REDIS_URL ? {
    url: env.REDIS_URL,
    tls: env.REDIS_TLS,
    password: env.REDIS_PASSWORD,
    cacheTTL: env.REDIS_CACHE_TTL,
    maxRetries: env.REDIS_MAX_RETRIES,
    retryDelay: env.REDIS_RETRY_DELAY,
  } : null,

  jwt: {
    secret: env.JWT_SECRET,
    expiresIn: env.JWT_EXPIRES_IN,
    refreshSecret: env.JWT_REFRESH_SECRET,
    refreshExpiresIn: env.JWT_REFRESH_EXPIRES_IN,
    algorithm: env.JWT_ALGORITHM,
  },

  signalWire: {
    projectId: env.SIGNALWIRE_PROJECT_ID,
    apiToken: env.SIGNALWIRE_TOKEN,
    spaceUrl: env.SIGNALWIRE_SPACE,
    phoneNumber: env.SIGNALWIRE_PHONE_NUMBER,
    maxCallsPerHour: env.MAX_CALLS_PER_HOUR,
    retryAttempts: env.SIGNALWIRE_RETRY_ATTEMPTS,
    retryDelay: env.SIGNALWIRE_RETRY_DELAY,
    timeout: env.SIGNALWIRE_TIMEOUT,
  },

  openai: {
    apiKey: env.OPENAI_API_KEY,
    model: env.OPENAI_MODEL,
    temperature: env.OPENAI_TEMPERATURE,
    maxTokens: env.OPENAI_MAX_TOKENS,
    cacheTTL: env.OPENAI_CACHE_TTL,
    rateLimit: env.OPENAI_RATE_LIMIT,
    timeout: env.OPENAI_TIMEOUT,
    retryAttempts: env.OPENAI_RETRY_ATTEMPTS,
  },

  email: {
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    user: env.SMTP_USER,
    password: env.SMTP_PASSWORD,
    from: env.EMAIL_FROM,
    secure: env.SMTP_SECURE,
    retryAttempts: env.EMAIL_RETRY_ATTEMPTS,
    retryDelay: env.EMAIL_RETRY_DELAY,
  },

  monitoring: {
    sentryDsn: env.SENTRY_DSN,
    newRelicKey: env.NEW_RELIC_LICENSE_KEY,
    enableTracing: env.ENABLE_TRACING,
    logLevel: env.MONITORING_LOG_LEVEL,
    enableMetrics: env.ENABLE_METRICS,
    metricsPort: env.METRICS_PORT,
  },

  logging: {
    level: env.LOG_LEVEL,
    dir: env.LOG_DIR,
    maxFiles: env.LOG_MAX_FILES,
    maxSize: env.LOG_MAX_SIZE,
    format: env.LOG_FORMAT,
    enableRequestLogging: env.ENABLE_REQUEST_LOGGING,
    enableQueryLogging: env.ENABLE_QUERY_LOGGING,
  },
} as const;

// Production environment validation
if (config.isProduction) {
  const requiredEnvVars = [
    'JWT_SECRET',
    'JWT_REFRESH_SECRET',
    'DATABASE_URL',
    'REDIS_URL',
    'OPENAI_API_KEY',
    'SIGNALWIRE_PROJECT_ID',
    'SIGNALWIRE_TOKEN',
    'SIGNALWIRE_SPACE',
    'SIGNALWIRE_PHONE_NUMBER',
    'SMTP_HOST',
    'SMTP_USER',
    'SMTP_PASSWORD',
    'EMAIL_FROM',
    'SENTRY_DSN',
  ] as const;

  const missingVars = requiredEnvVars.filter(key => !process.env[key]);
  
  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables in production:\n${missingVars.join('\n')}`
    );
  }

  // Additional production checks
  if (!config.redis) {
    throw new Error('Redis is required in production mode');
  }

  if (!config.monitoring.sentryDsn) {
    throw new Error('Sentry DSN is required in production mode');
  }

  if (config.app.corsOrigin.includes('*')) {
    throw new Error('Wildcard CORS origin is not allowed in production mode');
  }
}

// Freeze configuration to prevent runtime modifications
Object.freeze(config);
export type Config = typeof config;
export default config; 