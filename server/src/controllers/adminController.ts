import { Request, Response } from 'express'
import { query } from '@/config/database'
import { cacheGet, cacheSet } from '@/config/redis'
import { z } from 'zod'
import { BaseController } from './BaseController'
import { AdminService } from '@/services/adminService'
import { UserService } from '@/services/userService'
import { AnalyticsService } from '@/services/analyticsService'
import { AppError } from '@/errors/AppError'
import { AuthenticatedRequest } from '@/types/express'

const AdminStatsSchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
})

const SystemConfigSchema = z.object({
  maxCallsPerUser: z.number().min(1).max(1000).optional(),
  maxCallDuration: z.number().min(60).max(3600).optional(),
  allowedPhoneNumbers: z.array(z.string()).optional(),
  blacklistedPhoneNumbers: z.array(z.string()).optional(),
  openaiRateLimit: z.number().min(1).max(1000).optional(),
  signalwireRateLimit: z.number().min(1).max(1000).optional(),
  transcriptionEnabled: z.boolean().optional(),
  recordingEnabled: z.boolean().optional(),
  maintenanceMode: z.boolean().optional(),
})

const UserManagementSchema = z.object({
  status: z.enum(['active', 'suspended', 'banned']),
  role: z.enum(['user', 'admin', 'superadmin']).optional(),
  callLimit: z.number().min(0).optional(),
  notes: z.string().max(1000).optional(),
})

const DateRangeSchema = z.object({
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
})

export class AdminController extends BaseController {
  private adminService: AdminService
  private userService: UserService
  private analyticsService: AnalyticsService

  constructor() {
    super('AdminController')
    this.adminService = new AdminService()
    this.userService = new UserService()
    this.analyticsService = new AnalyticsService()

    // Bind methods
    this.getSystemMetrics = this.getSystemMetrics.bind(this)
    this.updateSystemConfig = this.updateSystemConfig.bind(this)
    this.getAuditLogs = this.getAuditLogs.bind(this)
    this.manageUser = this.manageUser.bind(this)
    this.listUsers = this.listUsers.bind(this)
    this.getSystemHealth = this.getSystemHealth.bind(this)
    this.getApiUsage = this.getApiUsage.bind(this)
  }

  public async getSystemMetrics(req: AuthenticatedRequest, res: Response) {
    return this.execute(req, res, async () => {
      const { startDate, endDate } = DateRangeSchema.parse(req.query)

      const [
        callMetrics,
        userMetrics,
        agentMetrics,
        apiUsage,
      ] = await Promise.all([
        this.analyticsService.getCallMetrics(startDate, endDate),
        this.analyticsService.getUserMetrics(startDate, endDate),
        this.analyticsService.getAgentMetrics(startDate, endDate),
        this.analyticsService.getApiUsageMetrics(startDate, endDate),
      ])

      return this.success(res, {
        calls: callMetrics,
        users: userMetrics,
        agents: agentMetrics,
        api: apiUsage,
      })
    })
  }

  public async updateSystemConfig(req: AuthenticatedRequest, res: Response) {
    return this.execute(req, res, async () => {
      const updates = SystemConfigSchema.parse(req.body)

      const config = await this.adminService.updateSystemConfig(updates)
      await this.adminService.logConfigChange(req.user!.id, updates)

      return this.success(res, { config })
    })
  }

  public async getAuditLogs(req: AuthenticatedRequest, res: Response) {
    return this.execute(req, res, async () => {
      const { startDate, endDate } = DateRangeSchema.parse(req.query)
      const { page = 1, limit = 50, type, userId } = req.query

      const [logs, total] = await Promise.all([
        this.adminService.getAuditLogs({
          startDate,
          endDate,
          type: type as string,
          userId: userId as string,
          page: Number(page),
          limit: Number(limit),
        }),
        this.adminService.countAuditLogs({
          startDate,
          endDate,
          type: type as string,
          userId: userId as string,
        }),
      ])

      return this.success(res, {
        logs,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit)),
        },
      })
    })
  }

  public async manageUser(req: AuthenticatedRequest, res: Response) {
    return this.execute(req, res, async () => {
      const { userId } = req.params
      const updates = UserManagementSchema.parse(req.body)

      // Check if target user exists
      const targetUser = await this.userService.findById(userId)
      if (!targetUser) {
        throw new AppError('User not found', 404)
      }

      // Prevent superadmin modification unless by another superadmin
      if (targetUser.role === 'superadmin' && req.user!.role !== 'superadmin') {
        throw new AppError('Not authorized to modify superadmin', 403)
      }

      const updatedUser = await this.adminService.updateUserStatus(userId, updates)
      await this.adminService.logUserManagement(req.user!.id, userId, updates)

      return this.success(res, { user: updatedUser })
    })
  }

  public async listUsers(req: AuthenticatedRequest, res: Response) {
    return this.execute(req, res, async () => {
      const {
        page = 1,
        limit = 20,
        status,
        role,
        search,
        sortBy = 'createdAt',
        sortOrder = 'desc',
      } = req.query

      const [users, total] = await Promise.all([
        this.userService.listUsers({
          status: status as string,
          role: role as string,
          search: search as string,
          sortBy: sortBy as string,
          sortOrder: sortOrder as 'asc' | 'desc',
          page: Number(page),
          limit: Number(limit),
        }),
        this.userService.countUsers({
          status: status as string,
          role: role as string,
          search: search as string,
        }),
      ])

      return this.success(res, {
        users,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit)),
        },
      })
    })
  }

  public async getSystemHealth(req: AuthenticatedRequest, res: Response) {
    return this.execute(req, res, async () => {
      const health = await this.adminService.checkSystemHealth()
      return this.success(res, { health })
    })
  }

  public async getApiUsage(req: AuthenticatedRequest, res: Response) {
    return this.execute(req, res, async () => {
      const { startDate, endDate } = DateRangeSchema.parse(req.query)
      const { service } = req.query

      const usage = await this.analyticsService.getDetailedApiUsage(
        startDate,
        endDate,
        service as string
      )

      return this.success(res, { usage })
    })
  }
}