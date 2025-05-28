import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { env } from '@/env.mjs'
import { query } from '@/config/database'
import { PublicUser } from '@/database/models/user'
import { logger } from '@/lib/logger'

declare global {
  namespace Express {
    interface Request {
      user?: PublicUser
    }
  }
}

export async function authenticate(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization

  if (!authHeader?.startsWith('Bearer ')) {
    logger.warn('Authentication attempt without bearer token')
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as { id: string }

    // Get user from database
    const result = await query(
      `SELECT id, email, name, role, created_at 
       FROM users WHERE id = $1`,
      [decoded.id]
    )

    if (result.rows.length === 0) {
      logger.warn(`Token valid but user not found: ${decoded.id}`)
      return res.status(401).json({ error: 'Unauthorized' })
    }

    req.user = result.rows[0]
    next()
  } catch (error) {
    logger.warn('Invalid authentication token:', error)
    return res.status(401).json({ error: 'Unauthorized' })
  }
}