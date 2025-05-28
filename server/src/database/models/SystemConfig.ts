import { z } from 'zod'

export const SystemConfigSchema = z.object({
  id: z.string().uuid(),
  max_concurrent_calls: z.number().int().min(1).max(1000),
  default_agent_id: z.string().uuid().nullable(),
  system_maintenance: z.boolean().default(false),
  call_timeout_seconds: z.number().int().min(10).max(600),
  created_at: z.date(),
  updated_at: z.date(),
})

export type SystemConfig = z.infer<typeof SystemConfigSchema>

export const UpdateSystemConfigSchema = SystemConfigSchema.omit({ 
  id: true,
  created_at: true 
}).partial()

export type UpdateSystemConfig = z.infer<typeof UpdateSystemConfigSchema>