import { query } from '@/config/database'
import { getSignalWireClient } from '@/integrations/signalwire/client'
import { logger } from '@/lib/logger'
import { CallStatus } from '@/database/models/call'

export async function cleanupStaleCalls() {
  try {
    logger.info('Starting stale call cleanup')

    // Find calls that are stuck in active status for too long
    const staleCalls = await query(
      `SELECT id, call_sid, status 
       FROM calls 
       WHERE status IN ('initiating', 'started', 'ringing', 'in-progress')
       AND created_at < NOW() - INTERVAL '1 hour'
       LIMIT 100`
    )

    if (staleCalls.rows.length === 0) {
      logger.info('No stale calls to cleanup')
      return
    }

    const client = getSignalWireClient()

    for (const call of staleCalls.rows) {
      try {
        // Attempt to end the call in SignalWire
        if (call.call_sid) {
          await client.calls(call.call_sid).update({ status: 'completed' })
        }

        // Update database record
        await query(
          `UPDATE calls SET 
           status = $1,
           ended_at = NOW(),
           updated_at = NOW()
           WHERE id = $2`,
          [CallStatus.enum.failed, call.id]
        )

        logger.info(`Cleaned up stale call ${call.id}`)
      } catch (error) {
        logger.error(`Error cleaning up call ${call.id}:`, error)
      }
    }

    logger.info(`Completed cleanup of ${staleCalls.rows.length} stale calls`)
  } catch (error) {
    logger.error('Error in call cleanup process:', error)
    throw error
  }
}