import { Request, Response, NextFunction } from 'express'
import { PublicUser } from '@/database/models/user'
import { logger } from '@/lib/logger'

export function adminAuth(req: Request, res: Response, next: NextFunction) {
  const user = req.user as PublicUser | undefined

  if (!user) {
    logger.warn('Admin auth attempt without authentication')
    return res.status(401).json({ error: 'Authentication required' })
  }

  // Check for admin or superadmin role
  if (!['admin', 'superadmin'].includes(user.role)) {
    logger.warn(`Unauthorized admin access attempt by user ${user.id}`)
    return res.status(403).json({ error: 'Admin privileges required' })
  }

  // Additional verification for sensitive operations
  if (req.method !== 'GET') {
    const adminActionKey = req.headers['x-admin-action-key']
    if (!adminActionKey || adminActionKey !== env.ADMIN_ACTION_SECRET) {
      logger.warn(`Admin action attempt without valid key by user ${user.id}`)
      return res.status(403).json({ error: 'Admin action verification failed' })
    }
  }

  next()
}

export function superAdminOnly(req: Request, res: Response, next: NextFunction) {
  const user = req.user as PublicUser | undefined

  if (!user) {
    return res.status(401).json({ error: 'Authentication required' })
  }

  if (user.role !== 'superadmin') {
    logger.warn(`Superadmin access attempt by user ${user.id}`)
    return res.status(403).json({ error: 'Superadmin privileges required' })
  }

  next()
}