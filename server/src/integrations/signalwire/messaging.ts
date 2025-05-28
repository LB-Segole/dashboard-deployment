import { getSignalWireClient } from './client'
import { query } from '@/config/database'

export async function sendSMS(
  to: string,
  from: string,
  body: string,
  mediaUrl?: string
) {
  const client = getSignalWireClient()

  try {
    const result = await client.messages.create({
      to,
      from,
      body,
      mediaUrl,
    })

    // Log message
    await query(
      `INSERT INTO sms_messages 
       (message_sid, to_number, from_number, body, status)
       VALUES ($1, $2, $3, $4, $5)`,
      [result.sid, to, from, body, 'sent']
    )

    return result.sid
  } catch (error) {
    console.error('SignalWire SMS error:', error)
    throw new Error('Failed to send SMS')
  }
}

export async function sendMMS(
  to: string,
  from: string,
  mediaUrl: string,
  body?: string
) {
  return sendSMS(to, from, body || '', mediaUrl)
}

export async function getMessageStatus(messageSid: string) {
  const client = getSignalWireClient()
  const message = await client.messages(messageSid).fetch()
  return message.status
}