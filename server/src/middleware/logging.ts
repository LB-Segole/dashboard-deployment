import { Request, Response, NextFunction } from 'express'
import { logger } from '@/lib/logger'

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const start = Date.now()

  res.on('finish', () => {
    const duration = Date.now() - start
    logger.http({
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration,
      ip: req.ip,
      user: (req.user as any)?.id
    })
  })

  next()
}