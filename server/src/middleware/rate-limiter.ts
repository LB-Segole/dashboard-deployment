import { Request, Response, NextFunction } from 'express';
import { RateLimiterRedis, RateLimiterRes } from 'rate-limiter-flexible';
import { redis } from '../database/redis';
import { config } from '../config';
import { logger } from '../utils/Logger';
import { AppError } from '../errors/AppError';

// Default rate limit settings
const DEFAULT_POINTS = 60; // Number of points
const DEFAULT_DURATION = 60; // Per 60 seconds
const DEFAULT_BLOCK_DURATION = 60 * 15; // 15 minutes

// Create Redis rate limiter
const createRedisRateLimiter = (
  keyPrefix: string,
  points: number = DEFAULT_POINTS,
  duration: number = DEFAULT_DURATION,
  blockDuration: number = DEFAULT_BLOCK_DURATION
) => {
  if (!redis) {
    logger.warn('Redis not configured, rate limiting will not be enforced');
    return null;
  }

  return new RateLimiterRedis({
    storeClient: redis,
    keyPrefix,
    points,
    duration,
    blockDuration,
  });
};

// API rate limiter
export const apiLimiter = createRedisRateLimiter('api_limit');

// Auth rate limiter (more restrictive)
export const authLimiter = createRedisRateLimiter('auth_limit', 5, 60 * 15);

// WebSocket rate limiter
export const wsLimiter = createRedisRateLimiter('ws_limit', 120, 60);

// OpenAI rate limiter
export const openaiLimiter = createRedisRateLimiter(
  'openai_limit',
  config.openai.rateLimit,
  60
);

// SignalWire rate limiter
export const signalwireLimiter = createRedisRateLimiter(
  'signalwire_limit',
  config.signalWire.maxCallsPerHour,
  60 * 60
);

// Rate limit middleware factory
export const rateLimiter = (limiter: RateLimiterRedis | null) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!limiter) {
      return next();
    }

    try {
      // Use IP as key, add user ID if available
      const key = `${req.ip}${(req as any).user?.id ? `_${(req as any).user.id}` : ''}`;

      await limiter.consume(key);
      next();
    } catch (rejRes) {
      if (rejRes instanceof RateLimiterRes) {
        logger.warn('Rate limit exceeded:', {
          ip: req.ip,
          userId: (req as any).user?.id,
          path: req.path,
        });

        const retryAfter = Math.ceil(rejRes.msBeforeNext / 1000) || 1;
        res.set('Retry-After', String(retryAfter));
        next(new AppError('Too many requests', 429));
      } else {
        next(rejRes);
      }
    }
  };
};

// Consume points without blocking (for internal use)
export const consumePoints = async (
  limiter: RateLimiterRedis | null,
  key: string,
  points: number = 1
): Promise<void> => {
  if (!limiter) return;

  try {
    await limiter.consume(key, points);
  } catch (error) {
    logger.error('Error consuming rate limit points:', error);
    throw new AppError('Rate limit exceeded', 429);
  }
}; 