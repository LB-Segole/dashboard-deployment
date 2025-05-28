import { Request, Response } from 'express';
import { collections } from '@/database/mongodb';
import { getMongoCollection } from '@/database/mongodb';
import { logger } from '@/utils/logger';
import { metrics } from '@/utils/Metrics';
import { prisma } from '@/lib/prisma';

export async function handleDeepgramWebhook(req: Request, res: Response) {
  const startTime = Date.now();
  
  try {
    const { metadata, results } = req.body;

    if (!metadata?.callId) {
      logger.warn('Missing callId in Deepgram webhook metadata', { body: req.body });
      metrics.increment('deepgram.webhook.error.missing_call_id');
      return res.status(400).json({ error: 'Missing callId in metadata' });
    }

    // Store full transcript in MongoDB
    const transcripts = await getMongoCollection(collections.realtimeTranscriptions);
    await transcripts.insertOne({
      callId: metadata.callId,
      userId: metadata.userId,
      transcriptType: 'final',
      results,
      createdAt: new Date(),
    });

    // Update call status in database
    await prisma.call.update({
      where: { id: metadata.callId },
      data: {
        status: 'completed',
        transcriptionCompleted: true,
        transcriptionCompletedAt: new Date(),
      },
    });

    // Store summary if available
    if (results.summary) {
      await prisma.transcript.upsert({
        where: { callId: metadata.callId },
        create: {
          callId: metadata.callId,
          summary: results.summary.short,
          fullTranscript: results.channels[0]?.alternatives[0]?.transcript || '',
          metadata: results,
        },
        update: {
          summary: results.summary.short,
          fullTranscript: results.channels[0]?.alternatives[0]?.transcript || '',
          metadata: results,
        },
      });
    }

    const duration = Date.now() - startTime;
    metrics.timing('deepgram.webhook.duration', duration);
    metrics.increment('deepgram.webhook.success');

    logger.info('Deepgram webhook processed successfully', {
      callId: metadata.callId,
      userId: metadata.userId,
      duration,
    });

    res.status(200).json({ message: 'Webhook processed successfully' });
  } catch (error) {
    const duration = Date.now() - startTime;
    metrics.timing('deepgram.webhook.duration', duration);
    metrics.increment('deepgram.webhook.error');

    logger.error('Error processing Deepgram webhook:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      body: req.body,
      duration,
    });

    res.status(500).json({ error: 'Internal server error' });
  }
}

export function generateDeepgramWebhookUrl(callId: string, userId: string) {
  const baseUrl = env.API_BASE_URL
  return `${baseUrl}/api/webhooks/deepgram?callId=${callId}&userId=${userId}`
}