import * as z from 'zod';

export const phoneNumberSchema = z.string()
  .min(10, 'Phone number must be at least 10 digits')
  .max(15, 'Phone number too long')
  .regex(/^[\d\s\+\-\(\)]+$/, 'Invalid phone number format');

export const agentConfigSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  voice: z.enum(['male', 'female', 'neutral']),
  language: z.string().min(2, 'Select a valid language'),
  initialMessage: z.string().min(10, 'Initial message too short'),
  interruptionThreshold: z.number().min(0.1).max(2.0),
  sentimentAnalysis: z.boolean(),
  endCallKeywords: z.array(z.string()).optional(),
});

export const userSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  role: z.enum(['admin', 'agent-manager', 'viewer']),
  phone: phoneNumberSchema.optional(),
});

export const callFilterSchema = z.object({
  dateRange: z.object({
    start: z.date(),
    end: z.date(),
  }).optional(),
  agentId: z.string().optional(),
  status: z.enum(['completed', 'failed', 'all']).optional(),
  minDuration: z.number().optional(),
});