import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError';
import { logger } from '../utils/Logger';
import { config } from '../config';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';

export const ErrorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Log error details
  logger.error('Error details:', {
    error: {
      name: error.name,
      message: error.message,
      stack: config.isDevelopment ? error.stack : undefined,
      ...(error instanceof AppError && {
        statusCode: error.statusCode,
        code: error.code,
        isOperational: error.isOperational,
        details: error.details,
      }),
    },
    request: {
      method: req.method,
      url: req.url,
      params: req.params,
      query: req.query,
      body: config.isDevelopment ? req.body : undefined,
      headers: {
        'user-agent': req.get('user-agent'),
        'x-request-id': req.get('x-request-id'),
      },
    },
  });

  // Handle Zod validation errors
  if (error instanceof ZodError) {
    return res.status(400).json({
      status: 'error',
      code: 'VALIDATION_ERROR',
      message: 'Validation failed',
      details: error.errors,
    });
  }

  // Handle Prisma errors
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    // Handle unique constraint violations
    if (error.code === 'P2002') {
      return res.status(409).json({
        status: 'error',
        code: 'CONFLICT_ERROR',
        message: 'Resource already exists',
        details: {
          fields: error.meta?.target,
        },
      });
    }

    // Handle not found errors
    if (error.code === 'P2025') {
      return res.status(404).json({
        status: 'error',
        code: 'NOT_FOUND_ERROR',
        message: 'Resource not found',
      });
    }
  }

  // Handle known application errors
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      status: 'error',
      code: error.code,
      message: error.message,
      ...(error.details && { details: error.details }),
    });
  }

  // Handle unknown errors
  const statusCode = error instanceof AppError ? error.statusCode : 500;
  const errorResponse = {
    status: 'error',
    code: 'INTERNAL_SERVER_ERROR',
    message: config.isProduction
      ? 'An unexpected error occurred'
      : error.message,
  };

  if (config.isDevelopment) {
    (errorResponse as any).stack = error.stack;
  }

  return res.status(statusCode).json(errorResponse);
};

// Handle 404 errors
export const NotFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const err = new AppError(`Route ${req.originalUrl} not found`, 404);
  next(err);
};

// Handle validation errors
export const ValidationErrorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof ZodError) {
    return res.status(400).json({
      status: 'error',
      message: 'Validation Error',
      errors: err.errors,
    });
  }
  next(err);
};

// Rate limit error handler
export const RateLimitErrorHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(429).json({
    status: 'error',
    message: 'Too many requests, please try again later',
  });
};

// Handle async errors
export const AsyncErrorHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}; 