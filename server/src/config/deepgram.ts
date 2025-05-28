import { env } from '@/env.mjs'
import { Deepgram } from '@deepgram/sdk'

export const deepgramClient = new Deepgram(env.DEEPGRAM_API_KEY)

export const transcribeAudio = async (audioUrl: string, options = {}) => {
  try {
    const response = await deepgramClient.transcription.preRecorded(
      { url: audioUrl },
      {
        punctuate: true,
        diarize: true,
        utterances: true,
        ...options,
      }
    )
    return response.results
  } catch (error) {
    console.error('Deepgram transcription error:', error)
    throw new Error('Failed to transcribe audio')
  }
}

export type DeepgramTranscription = ReturnType<typeof transcribeAudio> extends Promise<infer T> ? T : never