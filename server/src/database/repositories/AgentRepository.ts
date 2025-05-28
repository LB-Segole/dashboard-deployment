import { query } from '@/config/database'
import { Agent, CreateAgent, UpdateAgent } from '@/database/models/agent'

export class AgentRepository {
  async create(agentData: CreateAgent): Promise<Agent> {
    const result = await query(
      `INSERT INTO agents 
       (user_id, name, voice_id, language, persona, initial_message, interruption_threshold, temperature)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        agentData.user_id,
        agentData.name,
        agentData.voice_id,
        agentData.language,
        agentData.persona,
        agentData.initial_message,
        agentData.interruption_threshold,
        agentData.temperature,
      ]
    )
    return result.rows[0]
  }

  async findById(id: string): Promise<Agent | null> {
    const result = await query('SELECT * FROM agents WHERE id = $1', [id])
    return result.rows[0] || null
  }

  async findByUserId(userId: string): Promise<Agent[]> {
    const result = await query(
      'SELECT * FROM agents WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    )
    return result.rows
  }

  async update(id: string, updates: UpdateAgent): Promise<Agent> {
    const fields = Object.keys(updates)
    const values = Object.values(updates)

    const setClause = fields
      .map((field, index) => `${field} = $${index + 2}`)
      .join(', ')

    const queryStr = `
      UPDATE agents 
      SET ${setClause}, updated_at = NOW() 
      WHERE id = $1 
      RETURNING *
    `

    const result = await query(queryStr, [id, ...values])
    return result.rows[0]
  }

  async delete(id: string): Promise<void> {
    await query('DELETE FROM agents WHERE id = $1', [id])
  }

  async countByUserId(userId: string): Promise<number> {
    const result = await query(
      'SELECT COUNT(*) FROM agents WHERE user_id = $1',
      [userId]
    )
    return parseInt(result.rows[0].count)
  }
}