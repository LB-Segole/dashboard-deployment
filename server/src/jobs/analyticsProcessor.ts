import { query } from '@/config/database'
import { getMongoCollection } from '@/database/mongodb'
import { collections } from '@/database/mongodb'
import { createEmbedding } from '@/integrations/openai/embedding'
import { createChatCompletion } from '@/integrations/openai/completion'
import { logger } from '@/lib/logger'

export async function processAnalytics() {
  try {
    logger.info('Starting analytics processing job')

    // Get recent calls that haven't been processed
    const calls = await query(
      `SELECT c.id, c.user_id, t.raw_transcript 
       FROM calls c
       JOIN transcripts t ON c.id = t.call_id
       LEFT JOIN call_analytics ca ON c.id = ca.call_id
       WHERE ca.call_id IS NULL
       AND c.created_at > NOW() - INTERVAL '7 days'
       LIMIT 50`
    )

    if (calls.rows.length === 0) {
      logger.info('No new calls to process for analytics')
      return
    }

    const analyticsCollection = await getMongoCollection(collections.conversationAnalytics)

    for (const call of calls.rows) {
      try {
        const transcript = JSON.parse(call.raw_transcript)
        const conversationText = transcript.results.channels[0].alternatives[0].transcript

        // Generate conversation embedding
        const embedding = await createEmbedding(conversationText)

        // Analyze sentiment
        const sentiment = await createChatCompletion([
          {
            role: 'system',
            content: 'Analyze sentiment of this conversation. Respond with JSON: {sentiment: "positive|neutral|negative", score: 0-100}'
          },
          {
            role: 'user',
            content: conversationText
          }
        ])

        // Extract key topics
        const topics = await createChatCompletion([
          {
            role: 'system',
            content: 'Extract 3-5 key topics from this conversation as a JSON array'
          },
          {
            role: 'user',
            content: conversationText
          }
        ])

        // Save analytics
        await analyticsCollection.insertOne({
          callId: call.id,
          userId: call.user_id,
          embedding,
          sentiment: JSON.parse(sentiment || '{}'),
          topics: JSON.parse(topics || '[]'),
          processedAt: new Date()
        })

        logger.info(`Processed analytics for call ${call.id}`)
      } catch (error) {
        logger.error(`Error processing call ${call.id}:`, error)
      }
    }

    logger.info(`Completed processing analytics for ${calls.rows.length} calls`)
  } catch (error) {
    logger.error('Error in analytics processing job:', error)
    throw error
  }
}