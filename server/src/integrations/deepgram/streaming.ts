import { v4 as uuidv4 } from 'uuid'
import { LiveTranscriptionResponse } from '@deepgram/sdk/dist/types'
import { collections } from '@/database/mongodb'
import { getMongoCollection } from '@/database/mongodb'
import { deepgram } from './client'
import { logger } from '@/utils/logger'
import { metrics } from '@/utils/Metrics'

interface TranscriptData {
  callId: string
  userId: string
  sessionId: string
  isFinal: boolean
  channel: any
  transcript: string
  confidence: number
  words: any[]
  timestamp: Date
}

export class DeepgramStreamer {
  private callId: string
  private userId: string
  private sessionId: string

  constructor(callId: string, userId: string) {
    this.callId = callId
    this.userId = userId
    this.sessionId = uuidv4()
  }

  async startStreaming(streamOptions = {}) {
    const connection = deepgram.createLiveTranscription(streamOptions)

    connection.on('open', () => {
      logger.info(`Deepgram connection opened for call ${this.callId}`, {
        callId: this.callId,
        userId: this.userId,
        sessionId: this.sessionId,
      })
      metrics.increment('deepgram.stream.connection.opened')
      this.logTranscriptionEvent('connection_opened')
    })

    connection.on('close', () => {
      logger.info(`Deepgram connection closed for call ${this.callId}`, {
        callId: this.callId,
        userId: this.userId,
        sessionId: this.sessionId,
      })
      metrics.increment('deepgram.stream.connection.closed')
      this.logTranscriptionEvent('connection_closed')
    })

    connection.on('error', (error: Error) => {
      logger.error('Deepgram connection error:', {
        error: error.message,
        callId: this.callId,
        userId: this.userId,
        sessionId: this.sessionId,
      })
      metrics.increment('deepgram.stream.connection.error')
      this.logTranscriptionEvent('connection_error', { error: error.message })
    })

    connection.on('transcriptReceived', (data: LiveTranscriptionResponse) => {
      metrics.increment('deepgram.stream.transcript.received')
      this.handleTranscript(data)
    })

    return connection
  }

  private async handleTranscript(data: LiveTranscriptionResponse) {
    try {
      const transcripts = await getMongoCollection(collections.realtimeTranscriptions)
      const transcriptData: TranscriptData = {
        callId: this.callId,
        userId: this.userId,
        sessionId: this.sessionId,
        isFinal: data.is_final,
        channel: data.channel,
        transcript: data.channel.alternatives[0].transcript,
        confidence: data.channel.alternatives[0].confidence,
        words: data.channel.alternatives[0].words,
        timestamp: new Date(),
      }

      await transcripts.insertOne(transcriptData)

      if (data.is_final) {
        metrics.increment('deepgram.stream.transcript.final')
        this.logTranscriptionEvent('final_transcript', {
          transcript: transcriptData.transcript,
          confidence: transcriptData.confidence,
        })
      }
    } catch (error) {
      logger.error('Error handling transcript:', {
        error: error instanceof Error ? error.message : 'Unknown error',
        callId: this.callId,
        userId: this.userId,
        sessionId: this.sessionId,
      })
      metrics.increment('deepgram.stream.transcript.error')
      this.logTranscriptionEvent('transcript_error', {
        error: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  }

  private async logTranscriptionEvent(
    eventType: string,
    metadata: Record<string, any> = {}
  ) {
    try {
      const callLogs = await getMongoCollection(collections.callLogs)
      await callLogs.insertOne({
        callId: this.callId,
        userId: this.userId,
        sessionId: this.sessionId,
        eventType,
        timestamp: new Date(),
        metadata: {
          ...metadata,
          service: 'deepgram',
        },
      })
    } catch (error) {
      logger.error('Error logging transcription event:', {
        error: error instanceof Error ? error.message : 'Unknown error',
        callId: this.callId,
        userId: this.userId,
        sessionId: this.sessionId,
        eventType,
      })
      metrics.increment('deepgram.stream.log.error')
    }
  }
}