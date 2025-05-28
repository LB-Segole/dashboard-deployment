import { z } from 'zod'

export const ApiUsageSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  endpoint: z.string().max(100),
  method: z.enum(['GET', 'POST', 'PUT', 'DELETE', 'PATCH']),
  count: z.number().int().min(0),
  last_used: z.date(),
  created_at: z.date(),
})

export type ApiUsage = z.infer<typeof ApiUsageSchema>

export const ApiUsageRecordSchema = ApiUsageSchema.omit({ 
  id: true,
  created_at: true 
})

export type ApiUsageRecord = z.infer<typeof ApiUsageRecordSchema>