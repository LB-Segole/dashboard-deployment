import { Request, Response, NextFunction } from 'express'
import rateLimit from 'express-rate-limit'
import { env } from '@/env.mjs'
import { logger } from '@/lib/logger'

export const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: env.NODE_ENV === 'production' ? 100 : 1000, // limit each IP
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn(`Rate limit exceeded for IP ${req.ip}`)
    res.status(429).json({
      error: 'Too many requests, please try again later'
    })
  }
})

export const authRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // limit each IP to 10 login attempts per hour
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  handler: (req, res) => {
    logger.warn(`Auth rate limit exceeded for IP ${req.ip}`)
    res.status(429).json({
      error: 'Too many login attempts, please try again later'
    })
  }
})