import { Deepgram } from '@deepgram/sdk'
import { PrerecordedTranscriptionOptions, LiveTranscriptionOptions } from '@deepgram/sdk/dist/types'
import { config } from '@/config'
import { BaseIntegration, IntegrationConfig } from '../base/BaseIntegration'

export class DeepgramIntegration extends BaseIntegration {
  private client: Deepgram
  private static instance: DeepgramIntegration

  private constructor() {
    const integrationConfig: IntegrationConfig = {
      retryAttempts: 3,
      retryDelay: 1000,
      timeout: 30000,
    }

    super('deepgram', integrationConfig)

    const apiKey = process.env.DEEPGRAM_API_KEY
    if (!apiKey) {
      throw new Error('Deepgram API key is required')
    }

    this.client = new Deepgram(apiKey)
  }

  public static getInstance(): DeepgramIntegration {
    if (!DeepgramIntegration.instance) {
      DeepgramIntegration.instance = new DeepgramIntegration()
    }
    return DeepgramIntegration.instance
  }

  public getClient(): Deepgram {
    return this.client
  }

  private createPrerecordedOptions(options: Partial<PrerecordedTranscriptionOptions> = {}): PrerecordedTranscriptionOptions {
    return {
      language: options.language || 'en-US',
      punctuate: options.punctuate ?? true,
      diarize: options.diarize ?? true,
      utterances: options.utterances ?? true,
      model: options.model || 'nova-2',
      tier: options.tier || 'enhanced',
      ...options,
    }
  }

  private createLiveOptions(options: Partial<LiveTranscriptionOptions> = {}): LiveTranscriptionOptions {
    return {
      language: options.language || 'en-US',
      punctuate: options.punctuate ?? true,
      diarize: options.diarize ?? true,
      utterances: options.utterances ?? true,
      interim_results: options.interim_results ?? false,
      model: options.model || 'nova-2',
      tier: options.tier || 'enhanced',
      ...options,
    }
  }

  public async transcribePreRecorded(audioUrl: string, options: Partial<PrerecordedTranscriptionOptions> = {}): Promise<any> {
    return this.executeWithRetry(
      async () => {
        return await this.client.transcription.preRecorded(
          { url: audioUrl },
          this.createPrerecordedOptions(options)
        )
      },
      'transcribePreRecorded'
    )
  }

  public async transcribeFile(audioFile: Buffer, mimeType: string, options: Partial<PrerecordedTranscriptionOptions> = {}): Promise<any> {
    return this.executeWithRetry(
      async () => {
        return await this.client.transcription.preRecorded(
          { buffer: audioFile, mimetype: mimeType },
          this.createPrerecordedOptions(options)
        )
      },
      'transcribeFile'
    )
  }

  public createLiveTranscription(options: Partial<LiveTranscriptionOptions> = {}): any {
    return this.client.transcription.live(this.createLiveOptions(options))
  }
}

export const deepgram = DeepgramIntegration.getInstance()