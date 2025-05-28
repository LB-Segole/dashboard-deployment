import { query } from '@/config/database'
import { Call, CreateCall, UpdateCall } from '@/database/models/call'

export class CallRepository {
  async create(callData: CreateCall): Promise<Call> {
    const result = await query(
      `INSERT INTO calls 
       (user_id, agent_id, from_number, to_number, status)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [
        callData.user_id,
        callData.agent_id,
        callData.from_number,
        callData.to_number,
        callData.status,
      ]
    )
    return result.rows[0]
  }

  async findById(id: string): Promise<Call | null> {
    const result = await query('SELECT * FROM calls WHERE id = $1', [id])
    return result.rows[0] || null
  }

  async findByCallSid(callSid: string): Promise<Call | null> {
    const result = await query('SELECT * FROM calls WHERE call_sid = $1', [callSid])
    return result.rows[0] || null
  }

  async findByUserId(userId: string, limit = 20, offset = 0): Promise<Call[]> {
    const result = await query(
      `SELECT * FROM calls 
       WHERE user_id = $1 
       ORDER BY created_at DESC
       LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    )
    return result.rows
  }

  async update(id: string, updates: UpdateCall): Promise<Call> {
    const fields = Object.keys(updates)
    const values = Object.values(updates)

    const setClause = fields
      .map((field, index) => `${field} = $${index + 2}`)
      .join(', ')

    const queryStr = `
      UPDATE calls 
      SET ${setClause}, updated_at = NOW() 
      WHERE id = $1 
      RETURNING *
    `

    const result = await query(queryStr, [id, ...values])
    return result.rows[0]
  }

  async updateByCallSid(callSid: string, updates: UpdateCall): Promise<Call> {
    const fields = Object.keys(updates)
    const values = Object.values(updates)

    const setClause = fields
      .map((field, index) => `${field} = $${index + 2}`)
      .join(', ')

    const queryStr = `
      UPDATE calls 
      SET ${setClause}, updated_at = NOW() 
      WHERE call_sid = $1 
      RETURNING *
    `

    const result = await query(queryStr, [callSid, ...values])
    return result.rows[0]
  }

  async getActiveCallsCount(): Promise<number> {
    const result = await query(
      `SELECT COUNT(*) FROM calls 
       WHERE status IN ('initiating', 'started', 'ringing', 'in-progress')`
    )
    return parseInt(result.rows[0].count)
  }
}