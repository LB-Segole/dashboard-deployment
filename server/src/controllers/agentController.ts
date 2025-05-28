import { Request, Response } from 'express'
import { z } from 'zod'
import { BaseController } from './BaseController'
import { AgentService } from '@/services/agentService'
import { AppError } from '@/errors/AppError'
import { AuthenticatedRequest } from '@/types/express'

const CreateAgentSchema = z.object({
  name: z.string().min(2).max(100),
  description: z.string().min(10).max(500),
  voiceModel: z.enum(['NEURAL', 'STANDARD']),
  persona: z.enum(['FRIENDLY', 'PROFESSIONAL', 'CASUAL']),
  voiceSettings: z.record(z.any()).optional(),
  initialMessage: z.string().min(10).max(500).optional(),
})

const UpdateAgentSchema = CreateAgentSchema.partial()

const TestAgentSchema = z.object({
  input: z.string().min(1).max(1000),
  conversationId: z.string().uuid().optional(),
})

export class AgentController extends BaseController {
  private agentService: typeof AgentService

  constructor() {
    super('AgentController')
    this.agentService = AgentService

    // Bind methods
    this.createAgent = this.createAgent.bind(this)
    this.getAgents = this.getAgents.bind(this)
    this.getAgent = this.getAgent.bind(this)
    this.updateAgent = this.updateAgent.bind(this)
    this.deleteAgent = this.deleteAgent.bind(this)
    this.testAgent = this.testAgent.bind(this)
  }

  public async createAgent(req: AuthenticatedRequest, res: Response) {
    return this.execute(req, res, async () => {
      const userId = req.user?.id
      if (!userId) {
        throw new AppError('Not authenticated', 401)
      }

      const data = CreateAgentSchema.parse(req.body)
      const agent = await this.agentService.createAgent(userId, data)
      return this.created(res, { agent })
    })
  }

  public async getAgents(req: AuthenticatedRequest, res: Response) {
    return this.execute(req, res, async () => {
      const userId = req.user?.id
      if (!userId) {
        throw new AppError('Not authenticated', 401)
      }

      const agents = await this.agentService.getAgents(userId)
      return this.success(res, { agents })
    })
  }

  public async getAgent(req: AuthenticatedRequest, res: Response) {
    return this.execute(req, res, async () => {
      const userId = req.user?.id
      if (!userId) {
        throw new AppError('Not authenticated', 401)
      }

      const { id } = req.params
      const agent = await this.agentService.getAgent(userId, id)
      return this.success(res, { agent })
    })
  }

  public async updateAgent(req: AuthenticatedRequest, res: Response) {
    return this.execute(req, res, async () => {
      const userId = req.user?.id
      if (!userId) {
        throw new AppError('Not authenticated', 401)
      }

      const { id } = req.params
      const data = UpdateAgentSchema.parse(req.body)
      const agent = await this.agentService.updateAgent(userId, id, data)
      return this.success(res, { agent })
    })
  }

  public async deleteAgent(req: AuthenticatedRequest, res: Response) {
    return this.execute(req, res, async () => {
      const userId = req.user?.id
      if (!userId) {
        throw new AppError('Not authenticated', 401)
      }

      const { id } = req.params
      await this.agentService.deleteAgent(userId, id)
      return this.noContent(res)
    })
  }

  public async testAgent(req: AuthenticatedRequest, res: Response) {
    return this.execute(req, res, async () => {
      const userId = req.user?.id
      if (!userId) {
        throw new AppError('Not authenticated', 401)
      }

      const { id } = req.params
      const { input } = z.object({ input: z.string().min(1) }).parse(req.body)

      const result = await this.agentService.testAgent(id, input)
      return this.success(res, result)
    })
  }
}