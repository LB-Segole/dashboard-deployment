import { Request, Response } from 'express'
import { query } from '@/config/database'
import { cacheGet, cacheSet, cacheDelete } from '@/config/redis'
import { z } from 'zod'
import bcrypt from 'bcryptjs'

const UserUpdateSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  currentPassword: z.string().min(8).optional(),
  newPassword: z.string().min(8).optional(),
})

export const getUserProfile = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' })
    }

    const cacheKey = `user:profile:${req.user.id}`
    const cachedProfile = await cacheGet(cacheKey)

    if (cachedProfile) {
      return res.status(200).json(cachedProfile)
    }

    const result = await query(
      `SELECT id, email, name, created_at, updated_at 
       FROM users WHERE id = $1`,
      [req.user.id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' })
    }

    const profile = result.rows[0]
    await cacheSet(cacheKey, profile, 3600) // Cache for 1 hour

    res.status(200).json(profile)
  } catch (error) {
    console.error('Get user profile error:', error)
    res.status(500).json({ error: 'Failed to get user profile' })
  }
}

export const updateUserProfile = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' })
    }

    const { name, email, currentPassword, newPassword } = UserUpdateSchema.parse(req.body)

    // Validate password change if requested
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ error: 'Current password is required to change password' })
      }

      const userResult = await query('SELECT password FROM users WHERE id = $1', [req.user.id])
      if (userResult.rows.length === 0) {
        return res.status(404).json({ error: 'User not found' })
      }

      const isMatch = await bcrypt.compare(currentPassword, userResult.rows[0].password)
      if (!isMatch) {
        return res.status(401).json({ error: 'Current password is incorrect' })
      }
    }

    // Build update query
    const updates: Record<string, any> = {}
    if (name) updates.name = name
    if (email) updates.email = email
    if (newPassword) updates.password = await bcrypt.hash(newPassword, 12)

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'No valid fields provided for update' })
    }

    const setClause = Object.keys(updates)
      .map((key, i) => `${key} = $${i + 2}`)
      .join(', ')

    const values = Object.values(updates)
    const queryStr = `UPDATE users SET ${setClause}, updated_at = NOW() WHERE id = $1 RETURNING id, email, name, created_at`

    const result = await query(queryStr, [req.user.id, ...values])
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' })
    }

    // Clear relevant caches
    await cacheDelete(`user:${req.user.id}`)
    await cacheDelete(`user:profile:${req.user.id}`)

    res.status(200).json(result.rows[0])
  } catch (error) {
    console.error('Update user profile error:', error)
    res.status(400).json({ error: 'Failed to update profile' })
  }
}

export const getUserAgents = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' })
    }

    const cacheKey = `user:agents:${req.user.id}`
    const cachedAgents = await cacheGet(cacheKey)

    if (cachedAgents) {
      return res.status(200).json(cachedAgents)
    }

    const result = await query(
      `SELECT id, name, voice_id, language, created_at 
       FROM agents WHERE user_id = $1 ORDER BY created_at DESC`,
      [req.user.id]
    )

    const agents = result.rows
    await cacheSet(cacheKey, agents, 1800) // Cache for 30 minutes

    res.status(200).json(agents)
  } catch (error) {
    console.error('Get user agents error:', error)
    res.status(500).json({ error: 'Failed to get user agents' })
  }
}

export const getUserCalls = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' })
    }

    const { limit = 20, offset = 0 } = req.query
    const cacheKey = `user:calls:${req.user.id}:${limit}:${offset}`

    const cachedCalls = await cacheGet(cacheKey)
    if (cachedCalls) {
      return res.status(200).json(cachedCalls)
    }

    const result = await query(
      `SELECT 
         c.id, c.call_sid, c.from_number, c.to_number, c.status, 
         c.duration, c.created_at, c.ended_at,
         a.name as agent_name
       FROM calls c
       LEFT JOIN agents a ON c.agent_id = a.id
       WHERE c.user_id = $1
       ORDER BY c.created_at DESC
       LIMIT $2 OFFSET $3`,
      [req.user.id, limit, offset]
    )

    const calls = result.rows
    await cacheSet(cacheKey, calls, 300) // Cache for 5 minutes

    res.status(200).json(calls)
  } catch (error) {
    console.error('Get user calls error:', error)
    res.status(500).json({ error: 'Failed to get user calls' })
  }
}

export const deleteUserAccount = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' })
    }

    const { password } = req.body

    // Verify password
    const userResult = await query('SELECT password FROM users WHERE id = $1', [req.user.id])
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' })
    }

    const isMatch = await bcrypt.compare(password, userResult.rows[0].password)
    if (!isMatch) {
      return res.status(401).json({ error: 'Password is incorrect' })
    }

    // Begin transaction
    await query('BEGIN')

    try {
      // Delete user's agents
      await query('DELETE FROM agents WHERE user_id = $1', [req.user.id])

      // End all active calls
      const activeCalls = await query(
        `SELECT call_sid FROM calls 
         WHERE user_id = $1 AND status NOT IN ('completed', 'failed')`,
        [req.user.id]
      )

      for (const call of activeCalls.rows) {
        try {
          await endCall(call.call_sid)
        } catch (error) {
          console.error('Error ending call:', call.call_sid, error)
        }
      }

      // Mark calls as deleted
      await query(
        `UPDATE calls SET status = 'deleted' WHERE user_id = $1`,
        [req.user.id]
      )

      // Finally delete user
      await query('DELETE FROM users WHERE id = $1', [req.user.id])

      await query('COMMIT')

      // Clear all user-related caches
      await cacheDelete(`user:${req.user.id}`)
      await cacheDelete(`user:profile:${req.user.id}`)
      await cacheDelete(`user:agents:${req.user.id}`)
      await cacheDelete(new RegExp(`user:calls:${req.user.id}:.*`))

      res.status(200).json({ message: 'Account deleted successfully' })
    } catch (error) {
      await query('ROLLBACK')
      throw error
    }
  } catch (error) {
    console.error('Delete user account error:', error)
    res.status(500).json({ error: 'Failed to delete account' })
  }
}