import { Request, Response } from 'express'
import { z } from 'zod'
import { BaseController } from './BaseController'
import { SignalWireService } from '@/services/signalwireService'
import { DeepgramService } from '@/services/deepgramService'
import { AppError } from '@/errors/AppError'
import { prisma } from '@/lib/prisma'
import { config } from '@/config'

const CallEventSchema = z.object({
  CallSid: z.string(),
  CallStatus: z.enum(['queued', 'ringing', 'in-progress', 'completed', 'busy', 'failed']),
  CallDuration: z.string().optional(),
  RecordingUrl: z.string().optional(),
  RecordingDuration: z.string().optional(),
  TranscriptionText: z.string().optional(),
  TranscriptionSid: z.string().optional(),
})

export class WebhookController extends BaseController {
  private signalWireService: typeof SignalWireService
  private deepgramService: typeof DeepgramService

  constructor() {
    super('WebhookController')
    this.signalWireService = SignalWireService
    this.deepgramService = DeepgramService

    // Bind methods
    this.handleCallStatus = this.handleCallStatus.bind(this)
    this.connectCallToAgent = this.connectCallToAgent.bind(this)
    this.handleCallStream = this.handleCallStream.bind(this)
    this.handleRecordingComplete = this.handleRecordingComplete.bind(this)
    this.handleTranscriptionComplete = this.handleTranscriptionComplete.bind(this)
  }

  public async handleCallStatus(req: Request, res: Response) {
    return this.execute(req, res, async () => {
      const { CallSid, CallStatus, CallDuration, RecordingUrl } = CallEventSchema.parse(req.body)

      // Update call status in database
      await prisma.call.update({
        where: { signalwireCallSid: CallSid },
        data: {
          status: CallStatus,
          duration: CallDuration ? parseInt(CallDuration, 10) : undefined,
          recordingUrl: RecordingUrl,
          updatedAt: new Date(),
        },
      })

      // If call is completed and has recording, trigger transcription
      if (CallStatus === 'completed' && RecordingUrl) {
        const call = await prisma.call.findUnique({
          where: { signalwireCallSid: CallSid },
        })

        if (call) {
          // Process transcription in background
          this.deepgramService.transcribeAudio(RecordingUrl)
            .then(async (transcription) => {
              await prisma.transcript.create({
                data: {
                  callId: call.id,
                  rawTranscript: JSON.stringify(transcription),
                  summary: '',
                },
              })
            })
            .catch(error => {
              this.logger.error('Background transcription error:', error)
            })
        }
      }

      return this.success(res, { message: 'OK' })
    })
  }

  public async connectCallToAgent(req: Request, res: Response) {
    return this.execute(req, res, async () => {
      const { callId } = req.params

      const call = await prisma.call.findUnique({
        where: { id: callId },
        include: {
          agent: {
            select: {
              id: true,
              voiceModel: true,
              initialMessage: true,
            },
          },
        },
      })

      if (!call) {
        throw new AppError('Call not found', 404)
      }

      if (!call.agent) {
        throw new AppError('No agent assigned to call', 400)
      }

      // Construct webhookUrl from config.app.host and config.app.port
      const webhookUrl = `http://${config.app.host}:${config.app.port}`;

      // Generate TwiML response to connect call to agent
      const twiml = `<?xml version="1.0" encoding="UTF-8"?>
        <Response>
          <Connect>
            <Stream url="${webhookUrl}/call/stream/${callId}" />
            ${call.agent.initialMessage ? 
              `<Say voice="${call.agent.voiceModel}">${call.agent.initialMessage}</Say>` : ''}
          </Connect>
        </Response>`

      res.type('application/xml').send(twiml)
    })
  }

  public async handleCallStream(req: Request, res: Response) {
    return this.execute(req, res, async () => {
      const { callId } = req.params
      const { event, streamSid } = req.body

      // Handle different WebSocket events
      switch (event) {
        case 'connected':
          this.logger.info(`Stream connected for call ${callId}:`, { streamSid })
          await prisma.call.update({
            where: { id: callId },
            data: { streamSid },
          })
          break
          
        case 'start':
          this.logger.info(`Stream started for call ${callId}`)
          break
          
        case 'media':
          // Process real-time audio data here
          break
          
        case 'stop':
          this.logger.info(`Stream ended for call ${callId}`)
          await prisma.call.update({
            where: { id: callId },
            data: { streamSid: null },
          })
          break
      }

      return this.success(res, { message: 'OK' })
    })
  }

  public async handleRecordingComplete(req: Request, res: Response) {
    return this.execute(req, res, async () => {
      const { CallSid, RecordingUrl, RecordingDuration } = CallEventSchema.parse(req.body)

      await prisma.call.update({
        where: { signalwireCallSid: CallSid },
        data: {
          recordingUrl: RecordingUrl,
          duration: RecordingDuration ? parseInt(RecordingDuration, 10) : undefined,
          updatedAt: new Date(),
        },
      })

      return this.success(res, { message: 'OK' })
    })
  }

  public async handleTranscriptionComplete(req: Request, res: Response) {
    return this.execute(req, res, async () => {
      const { callId } = req.params
      const { TranscriptionText, TranscriptionSid } = CallEventSchema.parse(req.body)

      await prisma.transcript.upsert({
        where: { callId },
        create: {
          callId,
          rawTranscript: TranscriptionText,
          summary: '',
        },
        update: {
          rawTranscript: TranscriptionText,
          updatedAt: new Date(),
        },
      })

      return this.success(res, { message: 'OK' })
    })
  }
}