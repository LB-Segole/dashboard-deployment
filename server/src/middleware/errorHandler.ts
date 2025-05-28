import { Request, Response, NextFunction } from 'express'
import { logger } from '@/lib/logger'
import { ZodError } from 'zod'

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof ZodError) {
    logger.warn('Validation error:', err.errors)
    return res.status(400).json({
      error: 'Validation failed',
      details: err.errors
    })
  }

  logger.error('Unhandled error:', err)

  res.status(500).json({
    error: process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : err.message
  })
}