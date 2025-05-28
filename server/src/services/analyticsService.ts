import { prisma } from '../lib/prisma';
import { TimeRange } from '../schemas/analytics';

export const AnalyticsService = {
  async getCallAnalytics(userId: string, range: TimeRange = '7d') {
    const dateRange = this.getDateRange(range);
    
    const [totalCalls, callDuration, callsByStatus] = await Promise.all([
      prisma.call.count({ where: { userId, createdAt: { gte: dateRange.start } } }),
      prisma.call.aggregate({
        where: { userId, createdAt: { gte: dateRange.start } },
        _avg: { duration: true },
        _sum: { duration: true }
      }),
      prisma.call.groupBy({
        where: { userId, createdAt: { gte: dateRange.start } },
        by: ['status'],
        _count: { _all: true }
      })
    ]);

    return {
      totalCalls,
      averageDuration: callDuration._avg.duration || 0,
      totalDuration: callDuration._sum.duration || 0,
      callsByStatus: callsByStatus.reduce((acc, curr) => {
        acc[curr.status] = curr._count._all;
        return acc;
      }, {} as Record<string, number>)
    };
  },

  async getAgentAnalytics(userId: string, agentId: string) {
    // Similar implementation for agent-specific analytics
  },

  private getDateRange(range: TimeRange) {
    const now = new Date();
    let start = new Date();

    switch (range) {
      case '24h': start.setHours(now.getHours() - 24); break;
      case '7d': start.setDate(now.getDate() - 7); break;
      case '30d': start.setDate(now.getDate() - 30); break;
      case '90d': start.setDate(now.getDate() - 90); break;
    }

    return { start, end: now };
  }
};