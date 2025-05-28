import { query } from '@/config/database'
import { UpdateSystemConfig } from '@/database/models/system-config'

export async function seedSystemConfig() {
  console.log('Seeding system configuration...')
  
  const config: UpdateSystemConfig = {
    max_concurrent_calls: 100,
    default_agent_id: null,
    system_maintenance: false,
    call_timeout_seconds: 30,
  }

  await query(
    `INSERT INTO system_config 
     (max_concurrent_calls, default_agent_id, system_maintenance, call_timeout_seconds)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (id) DO NOTHING`,
    [
      config.max_concurrent_calls,
      config.default_agent_id,
      config.system_maintenance,
      config.call_timeout_seconds,
    ]
  )

  console.log('✅ Seeded system configuration')
}