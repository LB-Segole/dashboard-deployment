import { query } from '@/config/database'
import { CreateAgent } from '@/database/models/agent'
import { faker } from '@faker-js/faker'

export async function seedAgents(userIds: string[], count = 10) {
  console.log('Seeding agents...')
  
  const agents: CreateAgent[] = Array.from({ length: count }, () => {
    const voiceOptions = ['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer']
    const languageOptions = ['en-US', 'en-GB', 'es-ES', 'fr-FR', 'de-DE']
    
    return {
      user_id: faker.helpers.arrayElement(userIds),
      name: `Agent ${faker.person.firstName()}`,
      voice_id: faker.helpers.arrayElement(voiceOptions),
      language: faker.helpers.arrayElement(languageOptions),
      persona: faker.lorem.paragraph(),
      initial_message: faker.lorem.sentence(),
      interruption_threshold: faker.number.float({ min: 0.2, max: 0.8 }),
      temperature: faker.number.float({ min: 0.3, max: 0.9 }),
    }
  })

  for (const agent of agents) {
    await query(
      `INSERT INTO agents 
       (user_id, name, voice_id, language, persona, initial_message, interruption_threshold, temperature)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        agent.user_id,
        agent.name,
        agent.voice_id,
        agent.language,
        agent.persona,
        agent.initial_message,
        agent.interruption_threshold,
        agent.temperature,
      ]
    )
  }

  console.log(`✅ Seeded ${agents.length} agents`)
}