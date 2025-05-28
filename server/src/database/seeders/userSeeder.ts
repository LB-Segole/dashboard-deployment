import { query } from '@/config/database'
import bcrypt from 'bcryptjs'
import { faker } from '@faker-js/faker'

export async function seedUsers(count = 5) {
  console.log('Seeding users...')
  
  const users = Array.from({ length: count }, (_, i) => ({
    email: i === 0 ? 'admin@voiceai.com' : faker.internet.email(),
    password: i === 0 ? 'admin123' : faker.internet.password(),
    name: i === 0 ? 'Admin' : faker.person.fullName(),
    role: i === 0 ? 'admin' : 'user',
    email_verified: true,
  }))

  const insertedUserIds: string[] = []

  for (const user of users) {
    const hashedPassword = await bcrypt.hash(user.password, 12)
    const result = await query(
      `INSERT INTO users 
       (email, password, name, role, email_verified)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id`,
      [
        user.email,
        hashedPassword,
        user.name,
        user.role,
        user.email_verified,
      ]
    )
    insertedUserIds.push(result.rows[0].id)
  }

  console.log(`✅ Seeded ${users.length} users`)
  return insertedUserIds
}