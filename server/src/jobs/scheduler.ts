import { logger } from '@/lib/logger'
import { processConversationAnalytics } from './analytics'
import { cleanupStaleCalls } from './callcleanup'
import { processPendingRecordings } from './processor'
import { processTranscriptSummaries } from './transcriptprocessor'

const JOBS = [
  { name: 'analytics', fn: processConversationAnalytics, interval: 3600000 }, // 1 hour
  { name: 'callCleanup', fn: cleanupStaleCalls, interval: 1800000 }, // 30 mins
  { name: 'recordingProcessor', fn: processPendingRecordings, interval: 900000 }, // 15 mins
  { name: 'transcriptProcessor', fn: processTranscriptSummaries, interval: 3600000 }, // 1 hour
]

export function startScheduler() {
  logger.info('Starting job scheduler')

  for (const job of JOBS) {
    setInterval(async () => {
      try {
        logger.info(`Starting ${job.name} job`)
        await job.fn()
        logger.info(`Completed ${job.name} job`)
      } catch (error) {
        logger.error(`Error in ${job.name} job:`, error)
      }
    }, job.interval)

    // Run immediately on startup
    job.fn().catch(error => {
      logger.error(`Initial ${job.name} job failed:`, error)
    })
  }
}