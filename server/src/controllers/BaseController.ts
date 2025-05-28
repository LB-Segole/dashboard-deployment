import { Request, Response } from 'express';
import { logger } from '@/utils/Logger';
import { AppError } from '@/errors/AppError';
import { ZodError } from 'zod';
import { performance } from 'perf_hooks';

export abstract class BaseController {
  protected logger: typeof logger;
  private readonly context: string;

  constructor(context: string) {
    this.context = context;
    this.logger = logger.child({ context });
  }

  protected async execute(req: Request, res: Response, action: () => Promise<any>) {
    const requestId = req.headers['x-request-id'] || crypto.randomUUID();
    const startTime = performance.now();

    try {
      // Add request tracking
      const userAgent = req.get('user-agent');
      this.logger.info('Request started', {
        requestId,
        method: req.method,
        path: req.path,
        ip: req.ip,
        userAgent: typeof userAgent === 'string' ? userAgent : undefined,
      });

      const result = await action();

      // Log successful completion with timing
      const duration = Math.round(performance.now() - startTime);
      this.logger.info('Request completed', {
        requestId,
        duration,
        statusCode: res.statusCode,
      });

      return res.status(200).json(result);
    } catch (error) {
      const duration = Math.round(performance.now() - startTime);
      return this.handleError(error, res, { requestId, duration });
    }
  }

  protected handleError(error: any, res: Response, meta: { requestId: string; duration: number }) {
    if (error instanceof AppError) {
      this.logger.error('Application error:', {
        ...meta,
        message: error.message,
        code: error.code,
        statusCode: error.statusCode,
        details: error.details,
        stack: error.stack,
      });
      return res.status(error.statusCode).json({
        error: error.message,
        code: error.code,
        details: error.details,
        requestId: meta.requestId,
      });
    }

    if (error instanceof ZodError) {
      this.logger.warn('Validation error:', {
        ...meta,
        issues: error.issues,
      });
      return res.status(400).json({
        error: 'Validation failed',
        code: 'VALIDATION_ERROR',
        details: error.issues,
        requestId: meta.requestId,
      });
    }

    // Handle database errors
    if (error.code === '23505') { // PostgreSQL unique violation
      return res.status(409).json({
        error: 'Resource already exists',
        code: 'RESOURCE_CONFLICT',
        requestId: meta.requestId,
      });
    }

    this.logger.error('Unexpected error:', {
      ...meta,
      error: error.message,
      stack: error.stack,
      name: error.name,
    });

    return res.status(500).json({
      error: 'Internal server error',
      code: 'INTERNAL_SERVER_ERROR',
      requestId: meta.requestId,
    });
  }

  protected success<T>(res: Response, data: T, status: number = 200) {
    return res.status(status).json(data);
  }

  protected created<T>(res: Response, data: T) {
    return this.success(res, data, 201);
  }

  protected noContent(res: Response) {
    return res.status(204).send();
  }

  protected badRequest(res: Response, message: string, details?: any) {
    return res.status(400).json({
      error: message,
      code: 'BAD_REQUEST',
      details,
    });
  }

  protected unauthorized(res: Response, message: string = 'Unauthorized') {
    return res.status(401).json({
      error: message,
      code: 'UNAUTHORIZED',
    });
  }

  protected forbidden(res: Response, message: string = 'Forbidden') {
    return res.status(403).json({
      error: message,
      code: 'FORBIDDEN',
    });
  }

  protected notFound(res: Response, message: string = 'Not found') {
    return res.status(404).json({
      error: message,
      code: 'NOT_FOUND',
    });
  }

  protected conflict(res: Response, message: string, details?: any) {
    return res.status(409).json({
      error: message,
      code: 'CONFLICT',
      details,
    });
  }

  protected tooManyRequests(res: Response, message: string = 'Too many requests', retryAfter?: number) {
    const headers: Record<string, string> = {};
    if (retryAfter) {
      headers['Retry-After'] = retryAfter.toString();
    }

    return res.status(429).set(headers).json({
      error: message,
      code: 'TOO_MANY_REQUESTS',
      retryAfter,
    });
  }

  protected serviceUnavailable(res: Response, message: string = 'Service temporarily unavailable') {
    return res.status(503).json({
      error: message,
      code: 'SERVICE_UNAVAILABLE',
    });
  }
} 