import { Router } from 'express';
import { prisma } from '../database/client';
import { redis } from '../database/redis';
import { logger } from '../utils/Logger';
import { AsyncErrorHandler } from '../middleware/error-handler';

const router = Router();

type ServiceStatus = 'ok' | 'error' | 'unknown' | 'not_configured';

interface HealthCheck {
  status: 'ok' | 'error';
  timestamp: string;
  uptime: number;
  memoryUsage: NodeJS.MemoryUsage;
  services: {
    database: ServiceStatus;
    redis: ServiceStatus;
  };
}

interface ServiceHealthCheck {
  status: ServiceStatus;
  latency: number | null;
  error?: string;
}

interface DetailedHealthCheck {
  status: 'ok' | 'error';
  timestamp: string;
  version: string;
  node: {
    version: string;
    memoryUsage: NodeJS.MemoryUsage;
    cpuUsage: NodeJS.CpuUsage;
    uptime: number;
  };
  system: {
    platform: string;
    arch: string;
    release: NodeJS.Process['release'];
    env: string | undefined;
  };
  services: {
    database: ServiceHealthCheck;
    redis: ServiceHealthCheck;
  };
}

// Health check endpoint
router.get(
  '/',
  AsyncErrorHandler(async (req, res) => {
    const health: HealthCheck = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
      services: {
        database: 'unknown',
        redis: 'unknown',
      },
    };

    try {
      // Check database connection
      await prisma.$queryRaw`SELECT 1`;
      health.services.database = 'ok';
    } catch (error) {
      logger.error('Database health check failed:', error);
      health.services.database = 'error';
      health.status = 'error';
    }

    try {
      // Check Redis connection if configured
      if (redis) {
        await redis.ping();
        health.services.redis = 'ok';
      } else {
        health.services.redis = 'not_configured';
      }
    } catch (error) {
      logger.error('Redis health check failed:', error);
      health.services.redis = 'error';
      health.status = 'error';
    }

    // Set appropriate status code
    const statusCode = health.status === 'ok' ? 200 : 503;
    res.status(statusCode).json(health);
  })
);

// Detailed health check for internal use
router.get(
  '/details',
  AsyncErrorHandler(async (req, res) => {
    const details: DetailedHealthCheck = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || 'unknown',
      node: {
        version: process.version,
        memoryUsage: process.memoryUsage(),
        cpuUsage: process.cpuUsage(),
        uptime: process.uptime(),
      },
      system: {
        platform: process.platform,
        arch: process.arch,
        release: process.release,
        env: process.env.NODE_ENV,
      },
      services: {
        database: {
          status: 'unknown',
          latency: null,
        },
        redis: {
          status: 'unknown',
          latency: null,
        },
      },
    };

    try {
      // Check database with latency
      const dbStart = Date.now();
      await prisma.$queryRaw`SELECT 1`;
      details.services.database = {
        status: 'ok',
        latency: Date.now() - dbStart,
      };
    } catch (error) {
      logger.error('Database detailed health check failed:', error);
      details.services.database = {
        status: 'error',
        latency: null,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
      details.status = 'error';
    }

    try {
      // Check Redis with latency if configured
      if (redis) {
        const redisStart = Date.now();
        await redis.ping();
        details.services.redis = {
          status: 'ok',
          latency: Date.now() - redisStart,
        };
      } else {
        details.services.redis = {
          status: 'not_configured',
          latency: null,
        };
      }
    } catch (error) {
      logger.error('Redis detailed health check failed:', error);
      details.services.redis = {
        status: 'error',
        latency: null,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
      details.status = 'error';
    }

    // Set appropriate status code
    const statusCode = details.status === 'ok' ? 200 : 503;
    res.status(statusCode).json(details);
  })
);

export default router; 