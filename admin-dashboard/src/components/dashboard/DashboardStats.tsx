import React from 'react';
import { TrendingUp, TrendingDown, Phone, Users, Clock, DollarSign, Activity, AlertCircle } from 'lucide-react';
import { Card } from '../ui/Card';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: 'increase' | 'decrease';
  };
  icon: React.ReactNode;
  description?: string;
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red';
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  icon,
  description,
  color = 'blue'
}) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600',
    red: 'bg-red-100 text-red-600'
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {change && (
            <div className="flex items-center mt-2">
              {change.type === 'increase' ? (
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
              )}
              <span className={`text-sm font-medium ${
                change.type === 'increase' ? 'text-green-600' : 'text-red-600'
              }`}>
                {change.value}%
              </span>
              <span className="text-sm text-gray-500 ml-1">vs last period</span>
            </div>
          )}
          {description && (
            <p className="text-sm text-gray-500 mt-1">{description}</p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>
    </Card>
  );
};

interface DashboardStatsProps {
  timeRange?: '24h' | '7d' | '30d' | '90d';
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({
  timeRange = '24h'
}) => {
  // Mock data - in real app, this would come from API based on timeRange
  const stats = {
    totalCalls: {
      value: 1247,
      change: { value: 12.5, type: 'increase' as const }
    },
    activeUsers: {
      value: 89,
      change: { value: 8.2, type: 'increase' as const }
    },
    avgCallDuration: {
      value: '4:32',
      change: { value: 2.1, type: 'decrease' as const }
    },
    successRate: {
      value: '94.8%',
      change: { value: 1.3, type: 'increase' as const }
    },
    revenue: {
      value: '$2,847',
      change: { value: 15.4, type: 'increase' as const }
    },
    apiCalls: {
      value: 45672,
      change: { value: 22.8, type: 'increase' as const }
    },
    activeAgents: {
      value: 24,
      change: { value: 4.2, type: 'increase' as const }
    },
    errorRate: {
      value: '0.3%',
      change: { value: 0.1, type: 'decrease' as const }
    }
  };

  const getTimeRangeLabel = () => {
    switch (timeRange) {
      case '24h': return 'Last 24 Hours';
      case '7d': return 'Last 7 Days';
      case '30d': return 'Last 30 Days';
      case '90d': return 'Last 90 Days';
      default: return 'Last 24 Hours';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
          <p className="text-gray-600">{getTimeRangeLabel()}</p>
        </div>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>

      {/* Primary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Calls"
          value={stats.totalCalls.value.toLocaleString()}
          change={stats.totalCalls.change}
          icon={<Phone className="h-6 w-6" />}
          color="blue"
          description="Inbound and outbound calls"
        />
        
        <StatCard
          title="Active Users"
          value={stats.activeUsers.value}
          change={stats.activeUsers.change}
          icon={<Users className="h-6 w-6" />}
          color="green"
          description="Users with recent activity"
        />
        
        <StatCard
          title="Avg Call Duration"
          value={stats.avgCallDuration.value}
          change={stats.avgCallDuration.change}
          icon={<Clock className="h-6 w-6" />}
          color="purple"
          description="Average call length"
        />
        
        <StatCard
          title="Success Rate"
          value={stats.successRate.value}
          change={stats.successRate.change}
          icon={<Activity className="h-6 w-6" />}
          color="green"
          description="Completed calls ratio"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Revenue"
          value={stats.revenue.value}
          change={stats.revenue.change}
          icon={<DollarSign className="h-6 w-6" />}
          color="green"
          description="Total earnings"
        />
        
        <StatCard
          title="API Calls"
          value={stats.apiCalls.value.toLocaleString()}
          change={stats.apiCalls.change}
          icon={<Activity className="h-6 w-6" />}
          color="blue"
          description="AI service requests"
        />
        
        <StatCard
          title="Active Agents"
          value={stats.activeAgents.value}
          change={stats.activeAgents.change}
          icon={<Users className="h-6 w-6" />}
          color="purple"
          description="AI agents deployed"
        />
        
        <StatCard
          title="Error Rate"
          value={stats.errorRate.value}
          change={stats.errorRate.change}
          icon={<AlertCircle className="h-6 w-6" />}
          color="red"
          description="Failed call percentage"
        />
      </div>

      {/* Performance Indicators */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Call Volume Trend</h3>
            <TrendingUp className="h-5 w-5 text-green-500" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Peak Hours</span>
              <span className="font-medium">9 AM - 11 AM</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Avg per Hour</span>
              <span className="font-medium">52 calls</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Busiest Day</span>
              <span className="font-medium">Tuesday</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">System Health</h3>
            <Activity className="h-5 w-5 text-blue-500" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Uptime</span>
              <span className="font-medium text-green-600">99.9%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Response Time</span>
              <span className="font-medium">234ms</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>CPU Usage</span>
              <span className="font-medium">68%</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Top Performers</h3>
            <Users className="h-5 w-5 text-purple-500" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Best Agent</span>
              <span className="font-medium">Sales Pro v2.1</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Conversion Rate</span>
              <span className="font-medium text-green-600">23.4%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Satisfaction Score</span>
              <span className="font-medium">4.8/5</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};