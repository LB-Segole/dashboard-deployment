import { z } from 'zod'

export const AgentSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  name: z.string().min(2).max(100),
  voice_id: z.string().min(1).max(50),
  language: z.string().min(2).max(10),
  persona: z.string().min(10).max(2000),
  initial_message: z.string().min(5).max(500),
  interruption_threshold: z.number().min(0.1).max(1.0).default(0.5),
  temperature: z.number().min(0).max(1).default(0.7),
  created_at: z.date(),
  updated_at: z.date().nullable(),
})

export type Agent = z.infer<typeof AgentSchema>

export const CreateAgentSchema = AgentSchema.omit({ 
  id: true, 
  created_at: true, 
  updated_at: true 
})

export type CreateAgent = z.infer<typeof CreateAgentSchema>

export const UpdateAgentSchema = CreateAgentSchema.partial()

export type UpdateAgent = z.infer<typeof UpdateAgentSchema>