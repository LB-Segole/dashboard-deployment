import { z } from 'zod'

export const TranscriptSchema = z.object({
  id: z.string().uuid(),
  call_id: z.string().uuid(),
  raw_transcript: z.string().or(z.record(z.any())),
  summary: z.string().nullable(),
  sentiment_score: z.number().min(-1).max(1).nullable(),
  created_at: z.date(),
  updated_at: z.date().nullable(),
})

export type Transcript = z.infer<typeof TranscriptSchema>

export const CreateTranscriptSchema = TranscriptSchema.pick({
  call_id: true,
  raw_transcript: true,
}).extend({
  raw_transcript: z.string()
})

export type CreateTranscript = z.infer<typeof CreateTranscriptSchema>

export const UpdateTranscriptSchema = TranscriptSchema.pick({
  summary: true,
  sentiment_score: true,
}).partial()

export type UpdateTranscript = z.infer<typeof UpdateTranscriptSchema>