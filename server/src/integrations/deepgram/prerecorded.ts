import { getDeepgramClient } from './client'
import { query } from '@/config/database'
import { CallStatus } from '@/database/models/call'
import { CreateTranscript } from '@/database/models/transcript'

export async function transcribePreRecordedAudio(
  audioUrl: string,
  callId: string,
  options = {}
) {
  const deepgram = getDeepgramClient()

  try {
    const response = await deepgram.transcription.preRecorded(
      { url: audioUrl },
      {
        punctuate: true,
        diarize: true,
        utterances: true,
        ...options,
      }
    )

    const transcriptData: CreateTranscript = {
      call_id: callId,
      raw_transcript: JSON.stringify(response.results),
    }

    await query(
      `INSERT INTO transcripts 
       (call_id, raw_transcript) 
       VALUES ($1, $2)
       ON CONFLICT (call_id) DO UPDATE SET
       raw_transcript = EXCLUDED.raw_transcript,
       updated_at = NOW()`,
      [transcriptData.call_id, transcriptData.raw_transcript]
    )

    await query(
      `UPDATE calls SET status = $1 WHERE id = $2`,
      [CallStatus.enum.completed, callId]
    )

    return response.results
  } catch (error) {
    console.error('Deepgram transcription error:', error)
    throw new Error('Failed to transcribe audio')
  }
}