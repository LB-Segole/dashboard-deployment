import { Request, Response, NextFunction } from 'express'
import { AnyZodObject, ZodEffects } from 'zod'
import { logger } from '@/lib/logger'

export const validate =
  (schema: AnyZodObject | ZodEffects<AnyZodObject>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params
      })
      return next()
    } catch (error) {
      logger.warn('Validation error:', error)
      return res.status(400).json(error)
    }
  }