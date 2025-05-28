import winston from 'winston';
import path from 'path';
import { config } from '../config';

// Custom log format
const logFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

// Create logs directory if it doesn't exist
const logsDir = path.join(process.cwd(), config.logging.dir);

// Create the logger instance
export const logger = winston.createLogger({
  level: config.logging.level,
  format: logFormat,
  defaultMeta: { service: 'voiceai-server' },
  transports: [
    // Write all logs to console
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
    // Write all logs with level 'info' and below to combined.log
    new winston.transports.File({
      filename: path.join(logsDir, 'combined.log'),
      maxsize: parseInt(config.logging.maxSize),
      maxFiles: config.logging.maxFiles,
    }),
    // Write all logs with level 'error' and below to error.log
    new winston.transports.File({
      filename: path.join(logsDir, 'error.log'),
      level: 'error',
      maxsize: parseInt(config.logging.maxSize),
      maxFiles: config.logging.maxFiles,
    }),
  ],
  // Handle uncaught exceptions and unhandled rejections
  exceptionHandlers: [
    new winston.transports.File({
      filename: path.join(logsDir, 'exceptions.log'),
      maxsize: parseInt(config.logging.maxSize),
      maxFiles: config.logging.maxFiles,
    }),
  ],
  rejectionHandlers: [
    new winston.transports.File({
      filename: path.join(logsDir, 'rejections.log'),
      maxsize: parseInt(config.logging.maxSize),
      maxFiles: config.logging.maxFiles,
    }),
  ],
});

// Create a separate logger for request logging
export const requestLogger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  defaultMeta: { service: 'voiceai-server-requests' },
  transports: [
    new winston.transports.File({
      filename: path.join(logsDir, 'requests.log'),
      maxsize: parseInt(config.logging.maxSize),
      maxFiles: config.logging.maxFiles,
    }),
  ],
});

// Add Sentry logging in production
if (config.isProduction && config.monitoring.sentryDsn) {
  const Sentry = require('@sentry/node');
  Sentry.init({
    dsn: config.monitoring.sentryDsn,
    environment: config.env,
    tracesSampleRate: 1.0,
  });

  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
        winston.format.printf((info) => {
          if (info.level === 'error') {
            Sentry.captureException(info.error || info.message);
          }
          return JSON.stringify(info);
        })
      ),
    })
  );
}

// Add New Relic logging in production
if (config.isProduction && config.monitoring.newRelicKey) {
  require('newrelic');
}

// Development logging
if (config.isDevelopment) {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp(),
        winston.format.align(),
        winston.format.printf(
          (info) => `${info.timestamp} ${info.level}: ${info.message}`
        )
      ),
    })
  );
}

// Export a function to create child loggers
export const createLogger = (module: string) => {
  return logger.child({ module });
};