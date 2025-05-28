import winston from 'winston';
import { config } from '../config';
import { useRequestContext } from './useRequestContext';

let logger: winston.Logger | null = null;

export function useLogger(context?: string) {
  const { getRequestId, getUserId, getCorrelationId } = useRequestContext();

  const getLogger = (): winston.Logger => {
    if (!logger) {
      const logFormat = winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        config.logging.format === 'json'
          ? winston.format.json()
          : winston.format.prettyPrint()
      );

      logger = winston.createLogger({
        level: config.logging.level,
        format: logFormat,
        defaultMeta: {
          service: 'voice-ai-agent',
          environment: config.env,
        },
        transports: [
          new winston.transports.File({
            filename: `${config.logging.dir}/error.log`,
            level: 'error',
            maxsize: parseLogSize(config.logging.maxSize),
            maxFiles: config.logging.maxFiles,
          }),
          new winston.transports.File({
            filename: `${config.logging.dir}/combined.log`,
            maxsize: parseLogSize(config.logging.maxSize),
            maxFiles: config.logging.maxFiles,
          }),
        ],
      });

      if (config.isDevelopment) {
        logger.add(
          new winston.transports.Console({
            format: winston.format.combine(
              winston.format.colorize(),
              winston.format.simple()
            ),
          })
        );
      }
    }

    return logger;
  };

  const log = (level: string, message: string, meta: Record<string, any> = {}) => {
    const logger = getLogger();
    const requestId = getRequestId();
    const userId = getUserId();
    const correlationId = getCorrelationId();

    const logMeta = {
      ...meta,
      ...(context && { context }),
      ...(requestId && { requestId }),
      ...(userId && { userId }),
      ...(correlationId && { correlationId }),
    };

    logger.log(level, message, logMeta);
  };

  const info = (message: string, meta: Record<string, any> = {}) => {
    log('info', message, meta);
  };

  const error = (message: string, meta: Record<string, any> = {}) => {
    log('error', message, meta);
  };

  const warn = (message: string, meta: Record<string, any> = {}) => {
    log('warn', message, meta);
  };

  const debug = (message: string, meta: Record<string, any> = {}) => {
    log('debug', message, meta);
  };

  return {
    getLogger,
    log,
    info,
    error,
    warn,
    debug,
  };
}

function parseLogSize(size: string): number {
  const match = size.match(/^(\d+)([kmg])?b?$/i);
  if (!match) return 20 * 1024 * 1024; // Default 20MB

  const [, num, unit] = match;
  const bytes = parseInt(num, 10);
  
  switch (unit?.toLowerCase()) {
    case 'k': return bytes * 1024;
    case 'm': return bytes * 1024 * 1024;
    case 'g': return bytes * 1024 * 1024 * 1024;
    default: return bytes;
  }
} 