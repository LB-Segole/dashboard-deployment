import { query } from '@/config/database'
import { User, CreateUser, UpdateUser, PublicUser } from '@/database/models/user'
import bcrypt from 'bcryptjs'

export class UserRepository {
  async create(userData: CreateUser): Promise<PublicUser> {
    const hashedPassword = await bcrypt.hash(userData.password, 12)
    const result = await query(
      `INSERT INTO users 
       (email, password, name)
       VALUES ($1, $2, $3)
       RETURNING id, email, name, role, created_at`,
      [userData.email, hashedPassword, userData.name]
    )
    return result.rows[0]
  }

  async findById(id: string): Promise<PublicUser | null> {
    const result = await query(
      'SELECT id, email, name, role, created_at, updated_at FROM users WHERE id = $1',
      [id]
    )
    return result.rows[0] || null
  }

  async findByEmail(email: string): Promise<User | null> {
    const result = await query('SELECT * FROM users WHERE email = $1', [email])
    return result.rows[0] || null
  }

  async update(id: string, updates: UpdateUser): Promise<PublicUser> {
    const fields = Object.keys(updates)
    const values = Object.values(updates)

    const setClause = fields
      .map((field, index) => `${field} = $${index + 2}`)
      .join(', ')

    const queryStr = `
      UPDATE users 
      SET ${setClause}, updated_at = NOW() 
      WHERE id = $1 
      RETURNING id, email, name, role, created_at, updated_at
    `

    const result = await query(queryStr, [id, ...values])
    return result.rows[0]
  }

  async updatePassword(id: string, newPassword: string): Promise<void> {
    const hashedPassword = await bcrypt.hash(newPassword, 12)
    await query('UPDATE users SET password = $1 WHERE id = $2', [
      hashedPassword,
      id,
    ])
  }

  async recordLogin(id: string): Promise<void> {
    await query('UPDATE users SET last_login = NOW() WHERE id = $1', [id])
  }

  async delete(id: string): Promise<void> {
    await query('DELETE FROM users WHERE id = $1', [id])
  }

  async verifyEmail(id: string): Promise<PublicUser> {
    const result = await query(
      `UPDATE users 
       SET email_verified = true 
       WHERE id = $1 
       RETURNING id, email, name, role, created_at`,
      [id]
    )
    return result.rows[0]
  }
}