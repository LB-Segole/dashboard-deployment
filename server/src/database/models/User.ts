import { z } from 'zod'

export const UserRoleSchema = z.enum(['user', 'admin', 'superadmin'])

export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2).max(100).nullable(),
  role: UserRoleSchema.default('user'),
  email_verified: z.boolean().default(false),
  last_login: z.date().nullable(),
  created_at: z.date(),
  updated_at: z.date().nullable(),
})

export type User = z.infer<typeof UserSchema>

export const CreateUserSchema = UserSchema.pick({
  email: true,
  password: true,
  name: true,
}).extend({
  password: z.string().min(8)
})

export type CreateUser = z.infer<typeof CreateUserSchema>

export const UpdateUserSchema = UserSchema.pick({
  email: true,
  name: true,
  role: true,
  email_verified: true,
}).partial()

export type UpdateUser = z.infer<typeof UpdateUserSchema>

export const PublicUserSchema = UserSchema.omit({ 
  password: true 
})

export type PublicUser = z.infer<typeof PublicUserSchema>