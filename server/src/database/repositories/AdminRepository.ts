import { query } from '@/config/database'
import { SystemConfig, UpdateSystemConfig } from '@/database/models/system-config'
import { ApiUsage, ApiUsageRecord } from '@/database/models/api-usage'

export class AdminRepository {
  async getSystemConfig(): Promise<SystemConfig> {
    const result = await query(
      'SELECT * FROM system_config WHERE id = 1 LIMIT 1'
    )
    return result.rows[0]
  }

  async updateSystemConfig(updates: UpdateSystemConfig): Promise<SystemConfig> {
    const fields = Object.keys(updates)
    const values = Object.values(updates)

    const setClause = fields
      .map((field, index) => `${field} = $${index + 1}`)
      .join(', ')

    const queryStr = `
      UPDATE system_config 
      SET ${setClause}, updated_at = NOW() 
      WHERE id = 1 
      RETURNING *
    `

    const result = await query(queryStr, values)
    return result.rows[0]
  }

  async recordApiUsage(record: ApiUsageRecord): Promise<ApiUsage> {
    const result = await query(
      `INSERT INTO api_usage (user_id, endpoint, method, count, last_used)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (user_id, endpoint, method) 
       DO UPDATE SET 
         count = api_usage.count + 1,
         last_used = EXCLUDED.last_used
       RETURNING *`,
      [record.user_id, record.endpoint, record.method, 1, new Date()]
    )
    return result.rows[0]
  }

  async getApiUsage(userId: string): Promise<ApiUsage[]> {
    const result = await query(
      'SELECT * FROM api_usage WHERE user_id = $1 ORDER BY last_used DESC',
      [userId]
    )
    return result.rows
  }

  async getSystemStats(): Promise<{
    total_users: number
    total_calls: number
    total_minutes: number
    total_agents: number
  }> {
    const result = await query(`
      SELECT 
        (SELECT COUNT(*) FROM users) as total_users,
        (SELECT COUNT(*) FROM calls) as total_calls,
        (SELECT SUM(duration) FROM calls) as total_minutes,
        (SELECT COUNT(*) FROM agents) as total_agents
    `)
    return result.rows[0]
  }
}