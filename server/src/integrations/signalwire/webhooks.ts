import { query } from '@/config/database'
import { CallStatus } from '@/database/models/call'
import { getSignalWireClient } from './client'

export async function handleCallStatusWebhook(req: any, res: any) {
  const { CallSid, CallStatus, CallDuration, RecordingUrl } = req.body

  try {
    // Update call in database
    await query(
      `UPDATE calls SET 
       status = $1,
       duration = $2,
       recording_url = $3,
       updated_at = NOW()
       WHERE call_sid = $4`,
      [CallStatus, CallDuration, RecordingUrl, CallSid]
    )

    res.status(200).send('Webhook processed')
  } catch (error) {
    console.error('Call status webhook error:', error)
    res.status(500).send('Internal server error')
  }
}

export async function generateCallConnectTwiML(
  callId: string,
  agentId?: string
) {
  // Get agent details if available
  let sayCommand = ''
  if (agentId) {
    const agentResult = await query(
      `SELECT initial_message, voice_id FROM agents WHERE id = $1`,
      [agentId]
    )
    if (agentResult.rows.length > 0) {
      const { initial_message, voice_id } = agentResult.rows[0]
      sayCommand = `<Say voice="${voice_id}">${initial_message}</Say>`
    }
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
    <Response>
      <Connect>
        <Stream url="${env.API_BASE_URL}/api/signalwire/stream/${callId}" />
        ${sayCommand}
      </Connect>
    </Response>`
}

export async function handleStreamWebhook(req: any, res: any) {
  const { callId } = req.params
  const { event, streamSid } = req.body

  try {
    switch (event) {
      case 'connected':
        await query(
          `UPDATE calls SET stream_sid = $1 WHERE id = $2`,
          [streamSid, callId]
        )
        break
      case 'stop':
        await query(
          `UPDATE calls SET stream_sid = NULL WHERE id = $1`,
          [callId]
        )
        break
    }

    res.status(200).send('Stream event processed')
  } catch (error) {
    console.error('Stream webhook error:', error)
    res.status(500).send('Internal server error')
  }
}