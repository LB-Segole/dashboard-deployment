import { Request, Response, NextFunction } from 'express'
import { env } from '@/env.mjs'
import { logger } from '@/lib/logger'

const allowedOrigins = env.CORS_ALLOWED_ORIGINS.split(',')

export function corsMiddleware(req: Request, res: Response, next: NextFunction) {
  const origin = req.headers.origin

  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin)
    res.setHeader('Access-Control-Allow-Credentials', 'true')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      return res.status(204).end()
    }
  } else if (origin) {
    logger.warn(`Blocked CORS request from origin: ${origin}`)
  }

  next()
}

export function developmentCors(req: Request, res: Response, next: NextFunction) {
  if (env.NODE_ENV === 'development') {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')
    
    if (req.method === 'OPTIONS') {
      return res.status(204).end()
    }
  }

  next()
}