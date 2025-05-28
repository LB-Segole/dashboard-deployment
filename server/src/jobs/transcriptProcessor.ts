import { query } from '@/config/database'
import { createChatCompletion } from '@/integrations/openai/completion'
import { logger } from '@/lib/logger'

export async function processTranscriptSummaries() {
  try {
    logger.info('Starting transcript summary processing')

    // Get transcripts without summaries
    const transcripts = await query(
      `SELECT t.call_id, t.raw_transcript, c.user_id
       FROM transcripts t
       JOIN calls c ON t.call_id = c.id
       WHERE t.summary IS NULL
       AND t.created_at > NOW() - INTERVAL '7 days'
       LIMIT 50`
    )

    if (transcripts.rows.length === 0) {
      logger.info('No transcripts to summarize')
      return
    }

    for (const transcript of transcripts.rows) {
      try {
        const transcriptText = JSON.parse(transcript.raw_transcript).results
          .channels[0].alternatives[0].transcript

        const summary = await createChatCompletion([
          {
            role: 'system',
            content: 'Create a concise summary of this conversation for the user.'
          },
          {
            role: 'user',
            content: `Summarize this call transcript:\n\n${transcriptText}`
          }
        ])

        await query(
          `UPDATE transcripts SET summary = $1 WHERE call_id = $2`,
          [summary, transcript.call_id]
        )

        logger.info(`Processed summary for call ${transcript.call_id}`)
      } catch (error) {
        logger.error(`Error processing transcript ${transcript.call_id}:`, error)
      }
    }

    logger.info(`Completed processing ${transcripts.rows.length} transcript summaries`)
  } catch (error) {
    logger.error('Error in transcript summary processing:', error)
    throw error
  }
}