import { Request, Response } from 'express'
import { z } from 'zod'
import { BaseController } from './BaseController'
import { AuthService } from '@/services/authService'
import { AppError } from '@/errors/AppError'
import { AuthenticatedRequest } from '@/types/express'

const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(100),
  name: z.string().min(2).max(100),
})

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

export class AuthController extends BaseController {
  private authService: typeof AuthService

  constructor() {
    super('AuthController')
    this.authService = AuthService

    // Bind methods
    this.register = this.register.bind(this)
    this.login = this.login.bind(this)
    this.refreshToken = this.refreshToken.bind(this)
  }

  public async register(req: Request, res: Response) {
    return this.execute(req, res, async () => {
      const { email, password, name } = RegisterSchema.parse(req.body)

      try {
        const tokens = await this.authService.register(email, password, name)
        return this.created(res, tokens)
      } catch (error) {
        if (error instanceof AppError && error.message === 'Email already in use') {
          return this.conflict(res, 'Email already in use')
        }
        throw error
      }
    })
  }

  public async login(req: Request, res: Response) {
    return this.execute(req, res, async () => {
      const { email, password } = LoginSchema.parse(req.body)

      try {
        const tokens = await this.authService.login(email, password)
        return this.success(res, tokens)
      } catch (error) {
        if (error instanceof AppError && error.message === 'Invalid credentials') {
          return this.unauthorized(res, 'Invalid email or password')
        }
        throw error
      }
    })
  }

  public async refreshToken(req: Request, res: Response) {
    return this.execute(req, res, async () => {
      const { refreshToken } = req.body
      if (!refreshToken) {
        throw new AppError('Refresh token required', 400)
      }

      try {
        const tokens = await this.authService.refreshToken(refreshToken)
        return this.success(res, tokens)
      } catch (error) {
        if (error instanceof AppError && error.message === 'Invalid refresh token') {
          return this.unauthorized(res, 'Invalid refresh token')
        }
        throw error
      }
    })
  }
}