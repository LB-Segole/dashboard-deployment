import winston from 'winston';
import { LoggingWinston } from '@google-cloud/logging-winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { z } from 'zod';

// Environment validation
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
  GOOGLE_CLOUD_PROJECT: z.string().optional(),
  LOG_RETENTION_DAYS: z.number().min(1).default(30)
});

const env = envSchema.parse(process.env);

// Custom format for log messages
const customFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.metadata(),
  winston.format.json()
);

// Base transports array
const transports: winston.transport[] = [];

// Console transport for all environments
transports.push(
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.timestamp(),
      winston.format.printf(({ timestamp, level, message, metadata }) => {
        const meta = metadata && Object.keys(metadata).length ? JSON.stringify(metadata) : '';
        return `[${timestamp}] ${level}: ${message} ${meta}`;
      })
    )
  })
);

// File transport for rotating logs (both environments)
transports.push(
  new DailyRotateFile({
    filename: 'logs/voiceai-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    maxFiles: `${env.LOG_RETENTION_DAYS}d`,
    maxSize: '20m',
    format: customFormat,
    level: 'info'
  })
);

// Error-specific file transport
transports.push(
  new DailyRotateFile({
    filename: 'logs/voiceai-error-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    maxFiles: `${env.LOG_RETENTION_DAYS}d`,
    maxSize: '20m',
    format: customFormat,
    level: 'error'
  })
);

// Add Google Cloud Logging in production
if (env.NODE_ENV === 'production' && env.GOOGLE_CLOUD_PROJECT) {
  transports.push(
    new LoggingWinston({
      projectId: env.GOOGLE_CLOUD_PROJECT,
      logName: 'voiceai-api',
      resource: {
        type: 'cloud_run_revision',
        labels: {
          service_name: 'voiceai-api',
          revision_name: process.env.K_REVISION || 'unknown'
        }
      }
    })
  );
}

// Create logger instance
export const logger = winston.createLogger({
  level: env.LOG_LEVEL,
  defaultMeta: {
    service: 'voiceai-api',
    environment: env.NODE_ENV
  },
  transports,
  // Handle uncaught exceptions and unhandled rejections
  exceptionHandlers: [
    new winston.transports.File({ filename: 'logs/exceptions.log' })
  ],
  rejectionHandlers: [
    new winston.transports.File({ filename: 'logs/rejections.log' })
  ],
  exitOnError: false
});

// Export a type-safe logging interface
export interface ILogger {
  error(message: string, metadata?: Record<string, unknown>): void;
  warn(message: string, metadata?: Record<string, unknown>): void;
  info(message: string, metadata?: Record<string, unknown>): void;
  debug(message: string, metadata?: Record<string, unknown>): void;
}

export const typedLogger: ILogger = logger;