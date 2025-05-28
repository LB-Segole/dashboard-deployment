import { Request, Response } from 'express'
import { query } from '@/config/database'
import { cacheGet, cacheSet } from '@/config/redis'
import { z } from 'zod'
import { generateResponse } from '@/config/openai'
import { BaseController } from './BaseController'
import { TranscriptService } from '@/services/transcriptService'
import { CallService } from '@/services/callService'
import { AppError } from '@/errors/AppError'
import { AuthenticatedRequest } from '@/types/express'

// Validation schemas
const TranscriptFilterSchema = z.object({
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  callId: z.string().uuid().optional(),
  agentId: z.string().uuid().optional(),
  status: z.enum(['pending', 'completed', 'failed']).optional(),
  searchQuery: z.string().optional(),
})

const ExportFormatSchema = z.enum(['json', 'txt', 'srt', 'vtt'])

export class TranscriptController extends BaseController {
  private transcriptService: TranscriptService
  private callService: CallService

  constructor() {
    super('TranscriptController')
    this.transcriptService = new TranscriptService()
    this.callService = new CallService()

    // Bind methods
    this.getTranscript = this.getTranscript.bind(this)
    this.listTranscripts = this.listTranscripts.bind(this)
    this.deleteTranscript = this.deleteTranscript.bind(this)
    this.analyzeTranscript = this.analyzeTranscript.bind(this)
    this.exportTranscript = this.exportTranscript.bind(this)
    this.searchTranscripts = this.searchTranscripts.bind(this)
  }

  public async getTranscript(req: AuthenticatedRequest, res: Response) {
    return this.execute(req, res, async () => {
      const { transcriptId } = req.params
      const userId = req.user?.id

      if (!userId) {
        throw new AppError('Not authenticated', 401)
      }

      const transcript = await this.transcriptService.getTranscript(transcriptId)
      if (!transcript) {
        throw new AppError('Transcript not found', 404)
      }

      // Check if user has access to this transcript
      const call = await this.callService.getCall(transcript.callId)
      if (!call || call.userId !== userId) {
        throw new AppError('Not authorized to access this transcript', 403)
      }

      return this.success(res, { transcript })
    })
  }

  public async listTranscripts(req: AuthenticatedRequest, res: Response) {
    return this.execute(req, res, async () => {
      const userId = req.user?.id
      if (!userId) {
        throw new AppError('Not authenticated', 401)
      }

      const filters = TranscriptFilterSchema.parse(req.query)
      const { page = 1, limit = 20 } = req.query

      const [transcripts, total] = await Promise.all([
        this.transcriptService.listTranscripts({
          userId,
          ...filters,
          page: Number(page),
          limit: Number(limit),
        }),
        this.transcriptService.countTranscripts({
          userId,
          ...filters,
        }),
      ])

      return this.success(res, {
        transcripts,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit)),
        },
      })
    })
  }

  public async deleteTranscript(req: AuthenticatedRequest, res: Response) {
    return this.execute(req, res, async () => {
      const { transcriptId } = req.params
      const userId = req.user?.id

      if (!userId) {
        throw new AppError('Not authenticated', 401)
      }

      const transcript = await this.transcriptService.getTranscript(transcriptId)
      if (!transcript) {
        throw new AppError('Transcript not found', 404)
      }

      // Check if user has access to this transcript
      const call = await this.callService.getCall(transcript.callId)
      if (!call || call.userId !== userId) {
        throw new AppError('Not authorized to delete this transcript', 403)
      }

      await this.transcriptService.deleteTranscript(transcriptId)
      return this.noContent(res)
    })
  }

  public async analyzeTranscript(req: AuthenticatedRequest, res: Response) {
    return this.execute(req, res, async () => {
      const { transcriptId } = req.params
      const userId = req.user?.id

      if (!userId) {
        throw new AppError('Not authenticated', 401)
      }

      const transcript = await this.transcriptService.getTranscript(transcriptId)
      if (!transcript) {
        throw new AppError('Transcript not found', 404)
      }

      // Check if user has access to this transcript
      const call = await this.callService.getCall(transcript.callId)
      if (!call || call.userId !== userId) {
        throw new AppError('Not authorized to analyze this transcript', 403)
      }

      const analysis = await this.transcriptService.analyzeTranscript(transcriptId)
      return this.success(res, { analysis })
    })
  }

  public async exportTranscript(req: AuthenticatedRequest, res: Response) {
    return this.execute(req, res, async () => {
      const { transcriptId } = req.params
      const { format } = ExportFormatSchema.parse(req.query)
      const userId = req.user?.id

      if (!userId) {
        throw new AppError('Not authenticated', 401)
      }

      const transcript = await this.transcriptService.getTranscript(transcriptId)
      if (!transcript) {
        throw new AppError('Transcript not found', 404)
      }

      // Check if user has access to this transcript
      const call = await this.callService.getCall(transcript.callId)
      if (!call || call.userId !== userId) {
        throw new AppError('Not authorized to export this transcript', 403)
      }

      const exportData = await this.transcriptService.exportTranscript(transcriptId, format)

      // Set appropriate headers based on format
      const contentTypes = {
        json: 'application/json',
        txt: 'text/plain',
        srt: 'application/x-subrip',
        vtt: 'text/vtt',
      }

      res.setHeader('Content-Type', contentTypes[format])
      res.setHeader(
        'Content-Disposition',
        `attachment; filename=transcript-${transcriptId}.${format}`
      )

      return res.send(exportData)
    })
  }

  public async searchTranscripts(req: AuthenticatedRequest, res: Response) {
    return this.execute(req, res, async () => {
      const userId = req.user?.id
      if (!userId) {
        throw new AppError('Not authenticated', 401)
      }

      const { query, page = 1, limit = 20 } = req.query
      if (!query || typeof query !== 'string') {
        throw new AppError('Search query is required', 400)
      }

      const [results, total] = await Promise.all([
export const getTranscript = async (req: Request, res: Response) => {
  try {
    const { callId } = req.params
    const userId = req.user?.id
    const cacheKey = `transcript:${callId}`

    const cachedTranscript = await cacheGet(cacheKey)
    if (cachedTranscript) {
      return res.status(200).json(cachedTranscript)
    }

    const transcriptResult = await query(
      `SELECT t.id, t.raw_transcript, t.summary, t.created_at,
       c.from_number, c.to_number, c.duration, c.created_at as call_time
       FROM transcripts t
       JOIN calls c ON t.call_id = c.id
       WHERE t.call_id = $1 AND (c.user_id = $2 OR $2 IS NULL)`,
      [callId, userId]
    )

    if (transcriptResult.rows.length === 0) {
      return res.status(404).json({ error: 'Transcript not found' })
    }

    const transcript = transcriptResult.rows[0]
    await cacheSet(cacheKey, transcript, 3600) // Cache for 1 hour

    res.status(200).json(transcript)
  } catch (error) {
    console.error('Get transcript error:', error)
    res.status(500).json({ error: 'Failed to get transcript' })
  }
}

export const summarizeTranscript = async (req: Request, res: Response) => {
  try {
    const { callId } = req.params
    const userId = req.user?.id

    // Get transcript from database
    const transcriptResult = await query(
      `SELECT t.raw_transcript FROM transcripts t
       JOIN calls c ON t.call_id = c.id
       WHERE t.call_id = $1 AND (c.user_id = $2 OR $2 IS NULL)`,
      [callId, userId]
    )

    if (transcriptResult.rows.length === 0) {
      return res.status(404).json({ error: 'Transcript not found' })
    }

    const { raw_transcript } = transcriptResult.rows[0]
    const transcript = JSON.parse(raw_transcript)

    // Convert transcript to conversation format
    let conversation = ''
    if (transcript.utterances) {
      conversation = transcript.utterances.map((u: any) => 
        `${u.speaker}: ${u.transcript}`
      ).join('\n')
    } else {
      conversation = transcript.channels[0].alternatives[0].transcript
    }

    // Generate summary using OpenAI
    const summary = await generateResponse([
      {
        role: 'system',
        content: 'You are a professional summarizer. Create a concise yet comprehensive summary of this phone conversation. Highlight key points, decisions, and action items.'
      },
      {
        role: 'user',
        content: conversation
      }
    ])

    // Update transcript with summary
    await query(
      `UPDATE transcripts SET summary = $1 WHERE call_id = $2`,
      [summary, callId]
    )

    // Clear cache
    await cacheDelete(`transcript:${callId}`)

    res.status(200).json({ 
      callId,
      summary,
      message: 'Transcript summarized successfully'
    })
  } catch (error) {
    console.error('Summarize transcript error:', error)
    res.status(500).json({ error: 'Failed to summarize transcript' })
  }
}

export const analyzeSentiment = async (req: Request, res: Response) => {
  try {
    const { callId } = req.params
    const userId = req.user?.id

    // Get transcript from database
    const transcriptResult = await query(
      `SELECT t.raw_transcript FROM transcripts t
       JOIN calls c ON t.call_id = c.id
       WHERE t.call_id = $1 AND (c.user_id = $2 OR $2 IS NULL)`,
      [callId, userId]
    )

    if (transcriptResult.rows.length === 0) {
      return res.status(404).json({ error: 'Transcript not found' })
    }

    const { raw_transcript } = transcriptResult.rows[0]
    const transcript = JSON.parse(raw_transcript)

    // Convert transcript to conversation format
    let conversation = ''
    if (transcript.utterances) {
      conversation = transcript.utterances.map((u: any) => 
        `${u.speaker}: ${u.transcript}`
      ).join('\n')
    } else {
      conversation = transcript.channels[0].alternatives[0].transcript
    }

    // Analyze sentiment using OpenAI
    const sentimentAnalysis = await generateResponse([
      {
        role: 'system',
        content: 'Analyze the sentiment of this conversation. Provide:\n1. Overall sentiment (positive/neutral/negative)\n2. Sentiment score (0-100)\n3. Key emotional moments\n4. Suggestions for improvement\n\nFormat as JSON.'
      },
      {
        role: 'user',
        content: conversation
      }
    ], 'gpt-4', { response_format: { type: 'json_object' } })

    res.status(200).json(JSON.parse(sentimentAnalysis || '{}'))
  } catch (error) {
    console.error('Analyze sentiment error:', error)
    res.status(500).json({ error: 'Failed to analyze sentiment' })
  }
}

export const extractActionItems = async (req: Request, res: Response) => {
  try {
    const { callId } = req.params
    const userId = req.user?.id

    // Get transcript from database
    const transcriptResult = await query(
      `SELECT t.raw_transcript FROM transcripts t
       JOIN calls c ON t.call_id = c.id
       WHERE t.call_id = $1 AND (c.user_id = $2 OR $2 IS NULL)`,
      [callId, userId]
    )

    if (transcriptResult.rows.length === 0) {
      return res.status(404).json({ error: 'Transcript not found' })
    }

    const { raw_transcript } = transcriptResult.rows[0]
    const transcript = JSON.parse(raw_transcript)

    // Convert transcript to conversation format
    let conversation = ''
    if (transcript.utterances) {
      conversation = transcript.utterances.map((u: any) => 
        `${u.speaker}: ${u.transcript}`
      ).join('\n')
    } else {
      conversation = transcript.channels[0].alternatives[0].transcript
    }

    // Extract action items using OpenAI
    const actionItems = await generateResponse([
      {
        role: 'system',
        content: 'Extract clear action items from this conversation. Format as a JSON array with items containing: task, assignee, deadline (if mentioned), and priority (low/medium/high).'
      },
      {
        role: 'user',
        content: conversation
      }
    ], 'gpt-4', { response_format: { type: 'json_object' } })

    res.status(200).json(JSON.parse(actionItems || '{}'))
  } catch (error) {
    console.error('Extract action items error:', error)
    res.status(500).json({ error: 'Failed to extract action items' })
  }
}