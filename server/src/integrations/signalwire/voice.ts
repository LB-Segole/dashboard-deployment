import { getSignalWireClient } from './client'
import { query } from '@/config/database'
import { CallStatus } from '@/database/models/call'

export async function initiateCall(
  from: string,
  to: string,
  callOptions: {
    callId?: string
    userId?: string
    agentId?: string
  } = {}
) {
  const client = getSignalWireClient()

  try {
    const call = await client.calls.create({
      from,
      to,
      timeout: 30,
      url: `${env.API_BASE_URL}/api/signalwire/call/connect/${callOptions.callId}`,
    })

    // Store call in database if callId was provided
    if (callOptions.callId) {
      await query(
        `UPDATE calls SET 
         call_sid = $1, 
         status = $2
         WHERE id = $3`,
        [call.sid, CallStatus.enum.started, callOptions.callId]
      )
    }

    return call.sid
  } catch (error) {
    console.error('SignalWire call error:', error)
    throw new Error('Failed to initiate call')
  }
}

export async function endCall(callSid: string) {
  const client = getSignalWireClient()

  try {
    await client.calls(callSid).update({ status: 'completed' })

    // Update call status in database
    await query(
      `UPDATE calls SET 
       status = $1,
       ended_at = NOW()
       WHERE call_sid = $2`,
      [CallStatus.enum.completed, callSid]
    )

    return true
  } catch (error) {
    console.error('SignalWire end call error:', error)
    throw new Error('Failed to end call')
  }
}

export async function getCallDetails(callSid: string) {
  const client = getSignalWireClient()
  const call = await client.calls(callSid).fetch()
  return {
    sid: call.sid,
    status: call.status,
    from: call.from,
    to: call.to,
    duration: call.duration,
    startTime: call.startTime,
    endTime: call.endTime,
  }
}