import { Request, Response } from 'express';
import { z } from 'zod';
import { BaseController } from './BaseController';
import { AnalyticsService } from '@/services/analyticsService';
import { CallService } from '@/services/callService';
import { AgentService } from '@/services/agentService';
import { AppError } from '@/errors/AppError';
import { AuthenticatedRequest } from '@/types/express';
import { TimeRange } from '@/types/analytics';

// Validation schemas
const DateRangeSchema = z.object({
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
});

const TimeRangeSchema = z.enum(['day', 'week', 'month', 'year', 'custom']);

const AnalyticsFilterSchema = z.object({
  timeRange: TimeRangeSchema,
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  agentId: z.string().uuid().optional(),
  groupBy: z.enum(['hour', 'day', 'week', 'month']).optional(),
});

export class AnalyticsController extends BaseController {
  private analyticsService: typeof AnalyticsService;
  private callService: typeof CallService;
  private agentService: typeof AgentService;

  constructor() {
    super('AnalyticsController');
    this.analyticsService = AnalyticsService;
    this.callService = CallService;
    this.agentService = AgentService;

    // Bind methods
    this.getCallAnalytics = this.getCallAnalytics.bind(this);
    this.getAgentPerformance = this.getAgentPerformance.bind(this);
    this.getUserMetrics = this.getUserMetrics.bind(this);
    this.getUsageTrends = this.getUsageTrends.bind(this);
    this.getCallQualityMetrics = this.getCallQualityMetrics.bind(this);
    this.exportAnalytics = this.exportAnalytics.bind(this);
  }

  public async getCallAnalytics(req: AuthenticatedRequest, res: Response) {
    return this.execute(req, res, async () => {
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError('Not authenticated', 401);
      }

      const filters = AnalyticsFilterSchema.parse(req.query);

      // Get date range based on timeRange
      const { start, end } = this.analyticsService.getDateRange(filters.timeRange);

      const analytics = await this.analyticsService.getCallAnalytics(userId, {
        ...filters,
        startDate: filters.startDate || start.toISOString(),
        endDate: filters.endDate || end.toISOString(),
      });

      return this.success(res, { analytics });
    });
  }

  public async getAgentPerformance(req: AuthenticatedRequest, res: Response) {
    return this.execute(req, res, async () => {
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError('Not authenticated', 401);
      }

      const { agentId } = req.params;
      const filters = AnalyticsFilterSchema.parse(req.query);

      // Verify agent belongs to user
      const agent = await this.agentService.getAgent(agentId);
      if (!agent || agent.userId !== userId) {
        throw new AppError('Agent not found', 404);
      }

      // Get date range based on timeRange
      const { start, end } = this.analyticsService.getDateRange(filters.timeRange);

      const performance = await this.analyticsService.getAgentAnalytics(userId, agentId, {
        ...filters,
        startDate: filters.startDate || start.toISOString(),
        endDate: filters.endDate || end.toISOString(),
      });

      return this.success(res, { performance });
    });
  }

  public async getUserMetrics(req: AuthenticatedRequest, res: Response) {
    return this.execute(req, res, async () => {
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError('Not authenticated', 401);
      }

      const filters = AnalyticsFilterSchema.parse(req.query);

      // Get date range based on timeRange
      const { start, end } = this.analyticsService.getDateRange(filters.timeRange);

      const metrics = await this.analyticsService.getCallAnalytics(userId, {
        ...filters,
        startDate: filters.startDate || start.toISOString(),
        endDate: filters.endDate || end.toISOString(),
      });

      return this.success(res, { metrics });
    });
  }

  public async getUsageTrends(req: AuthenticatedRequest, res: Response) {
    return this.execute(req, res, async () => {
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError('Not authenticated', 401);
      }

      const filters = AnalyticsFilterSchema.parse(req.query);

      // Get date range based on timeRange
      const { start, end } = this.analyticsService.getDateRange(filters.timeRange);

      const trends = await this.analyticsService.getCallAnalytics(userId, {
        ...filters,
        startDate: filters.startDate || start.toISOString(),
        endDate: filters.endDate || end.toISOString(),
        groupBy: filters.groupBy || 'day',
      });

      return this.success(res, { trends });
    });
  }

  public async getCallQualityMetrics(req: AuthenticatedRequest, res: Response) {
    return this.execute(req, res, async () => {
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError('Not authenticated', 401);
      }

      const { callId } = req.params;

      // Verify call belongs to user
      const call = await this.callService.getCall(callId);
      if (!call || call.userId !== userId) {
        throw new AppError('Call not found', 404);
      }

      const metrics = await this.analyticsService.getCallQualityMetrics(callId);

      return this.success(res, { metrics });
    });
  }

  public async exportAnalytics(req: AuthenticatedRequest, res: Response) {
    return this.execute(req, res, async () => {
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError('Not authenticated', 401);
      }

      const filters = AnalyticsFilterSchema.parse(req.query);
      const { format = 'csv' } = req.query;

      // Get date range based on timeRange
      const { start, end } = this.analyticsService.getDateRange(filters.timeRange);

      const exportData = await this.analyticsService.exportAnalytics(userId, {
        ...filters,
        startDate: filters.startDate || start.toISOString(),
        endDate: filters.endDate || end.toISOString(),
        format: format as 'csv' | 'json' | 'xlsx',
      });

      // Set appropriate headers based on format
      const contentTypes = {
        csv: 'text/csv',
        json: 'application/json',
        xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      };

      const extensions = {
        csv: 'csv',
        json: 'json',
        xlsx: 'xlsx',
      };

      res.setHeader('Content-Type', contentTypes[format as keyof typeof contentTypes]);
      res.setHeader(
        'Content-Disposition',
        `attachment; filename=analytics-${start.toISOString()}-${end.toISOString()}.${
          extensions[format as keyof typeof extensions]
        }`
      );

      return res.send(exportData);
    });
  }
} 