import { Request, Response } from 'express'
import { z } from 'zod'
import { BaseController } from './BaseController'
import { CallService } from '@/services/callService'
import { SignalWireService } from '@/services/signalwireService'
import { DeepgramService } from '@/services/deepgramService'
import { AppError } from '@/errors/AppError'
import { AuthenticatedRequest } from '@/types/express'
import { AgentService } from '@/services/agentService'
import { config } from '@/config'
import { prisma } from '@/lib/prisma'

const CallSchema = z.object({
  from_number: z.string().min(10),
  to_number: z.string().min(10),
  agent_id: z.string().uuid().optional(),
  user_id: z.string().uuid().optional(),
})

// Validation schemas with stricter rules
const PhoneNumberSchema = z.string()
  .regex(/^\+[1-9]\d{1,14}$/, 'Phone number must be in E.164 format (e.g. +1234567890)')

const InitiateCallSchema = z.object({
  phoneNumber: PhoneNumberSchema,
  agentId: z.string().uuid(),
  recordCall: z.boolean().default(true),
  transcribeCall: z.boolean().default(true),
  callbackUrl: z.string().url().optional(),
  metadata: z.record(z.any()).optional(),
})

const CallFilterSchema = z.object({
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  status: z.enum(['queued', 'ringing', 'in-progress', 'completed', 'failed', 'busy', 'no-answer']).optional(),
  agentId: z.string().uuid().optional(),
  direction: z.enum(['inbound', 'outbound']).optional(),
  searchQuery: z.string().optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
})

const CallWebhookSchema = z.object({
  event_type: z.enum([
    'call.initiated',
    'call.ringing',
    'call.answered',
    'call.ended',
    'call.recording.ready',
    'call.transcription.ready',
  ]),
  call_id: z.string(),
  timestamp: z.number(),
  data: z.record(z.any()),
})

export class CallController extends BaseController {
  private callService: typeof CallService
  private agentService: typeof AgentService
  private signalWireService: typeof SignalWireService
  private deepgramService: typeof DeepgramService

  constructor() {
    super('CallController')
    this.callService = CallService
    this.agentService = AgentService
    this.signalWireService = SignalWireService
    this.deepgramService = DeepgramService

    // Bind methods
    this.initiateCall = this.initiateCall.bind(this)
    this.endCall = this.endCall.bind(this)
    this.listCalls = this.listCalls.bind(this)
  }

  public async initiateCall(req: AuthenticatedRequest, res: Response) {
    return this.execute(req, res, async () => {
      const userId = req.user?.id
      if (!userId) {
        throw new AppError('Not authenticated', 401)
      }

      const callData = InitiateCallSchema.parse(req.body)

      try {
        const call = await this.callService.initiateCall(
          userId,
          callData.agentId,
          callData.phoneNumber
        )

        return this.created(res, { call })
      } catch (error) {
        if (error instanceof Error) {
          this.logger.error('Failed to initiate call:', {
            error: error.message,
            userId,
            phoneNumber: callData.phoneNumber,
          })

          if (error.message.includes('service unavailable')) {
            return this.serviceUnavailable(res, 'Call service temporarily unavailable')
          }
        }
        throw error
      }
    })
  }

  public async endCall(req: AuthenticatedRequest, res: Response) {
    return this.execute(req, res, async () => {
      const userId = req.user?.id
      if (!userId) {
        throw new AppError('Not authenticated', 401)
      }

      const { callId } = req.params

      try {
        await this.callService.endCall(callId, userId)
        return this.success(res, { message: 'Call ended successfully' })
      } catch (error) {
        if (error instanceof AppError && error.message === 'Call not found') {
          throw new AppError('Call not found', 404)
        }
        throw error
      }
    })
  }

  public async listCalls(req: AuthenticatedRequest, res: Response) {
    return this.execute(req, res, async () => {
      const userId = req.user?.id
      if (!userId) {
        throw new AppError('Not authenticated', 401)
      }

      const filters = CallFilterSchema.parse(req.query)
      const { page, limit } = filters

      try {
        const offset = (page - 1) * limit
        const calls = await this.callService.getCalls(userId, limit, offset)
        
        // Get total count for pagination
        const total = await prisma.call.count({ where: { userId } })

        return this.success(res, {
          calls,
          pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit),
          },
        })
      } catch (error) {
        if (error instanceof Error && error.message.includes('database error')) {
          return this.serviceUnavailable(res, 'Database service temporarily unavailable')
        }
        throw error
      }
    })
  }
}