import { z } from 'zod'

export const CallStatusSchema = z.enum([
  'initiating',
  'started',
  'ringing',
  'in-progress',
  'completed',
  'failed',
  'busy',
  'deleted'
])

export const CallSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid().nullable(),
  agent_id: z.string().uuid().nullable(),
  call_sid: z.string().min(10),
  stream_sid: z.string().nullable(),
  from_number: z.string().min(10).max(20),
  to_number: z.string().min(10).max(20),
  status: CallStatusSchema,
  duration: z.number().int().min(0).nullable(),
  recording_url: z.string().url().nullable(),
  created_at: z.date(),
  ended_at: z.date().nullable(),
  updated_at: z.date().nullable(),
})

export type Call = z.infer<typeof CallSchema>

export const CreateCallSchema = CallSchema.pick({
  user_id: true,
  agent_id: true,
  from_number: true,
  to_number: true,
}).extend({
  status: CallStatusSchema.optional().default('initiating')
})

export type CreateCall = z.infer<typeof CreateCallSchema>

export const UpdateCallSchema = CallSchema.pick({
  status: true,
  call_sid: true,
  stream_sid: true,
  duration: true,
  recording_url: true,
}).partial()

export type UpdateCall = z.infer<typeof UpdateCallSchema>