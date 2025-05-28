import { query } from '@/config/database'
import { Transcript, CreateTranscript, UpdateTranscript } from '@/database/models/transcript'

export class TranscriptRepository {
  async create(transcriptData: CreateTranscript): Promise<Transcript> {
    const result = await query(
      `INSERT INTO transcripts 
       (call_id, raw_transcript)
       VALUES ($1, $2)
       RETURNING *`,
      [transcriptData.call_id, transcriptData.raw_transcript]
    )
    return result.rows[0]
  }

  async findByCallId(callId: string): Promise<Transcript | null> {
    const result = await query(
      'SELECT * FROM transcripts WHERE call_id = $1',
      [callId]
    )
    return result.rows[0] || null
  }

  async update(callId: string, updates: UpdateTranscript): Promise<Transcript> {
    const fields = Object.keys(updates)
    const values = Object.values(updates)

    const setClause = fields
      .map((field, index) => `${field} = $${index + 2}`)
      .join(', ')

    const queryStr = `
      UPDATE transcripts 
      SET ${setClause}, updated_at = NOW() 
      WHERE call_id = $1 
      RETURNING *
    `

    const result = await query(queryStr, [callId, ...values])
    return result.rows[0]
  }

  async delete(callId: string): Promise<void> {
    await query('DELETE FROM transcripts WHERE call_id = $1', [callId])
  }

  async getCallSummary(callId: string): Promise<string | null> {
    const result = await query(
      'SELECT summary FROM transcripts WHERE call_id = $1',
      [callId]
    )
    return result.rows[0]?.summary || null
  }
}