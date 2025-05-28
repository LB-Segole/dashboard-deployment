import React, { useState, useEffect } from 'react';
import { Server, Database, Wifi, Cpu, HardDrive, Memory, Activity, AlertTriangle } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

interface SystemMetric {
  name: string;
  value: number;
  unit: string;
  status: 'healthy' | 'warning' | 'critical';
  icon: React.ReactNode;
  description: string;
  threshold: {
    warning: number;
    critical: number;
  };
}

interface ServiceStatus {
  name: string;
  status: 'online' | 'offline' | 'degraded';
  uptime: number;
  responseTime: number;
  lastIncident?: string;
}

interface SystemStatusProps {
  onMetricClick?: (metric: string) => void;
  autoRefresh?: boolean;
}

export const SystemStatus: React.FC<SystemStatusProps> = ({
  onMetricClick,
  autoRefresh = true
}) => {
  const [metrics, setMetrics] = useState<SystemMetric[]>([]);
  const [services, setServices] = useState<ServiceStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const mockMetrics: SystemMetric[] = [
    {
      name: 'CPU Usage',
      value: 68,
      unit: '%',
      status: 'healthy',
      icon: <Cpu className="h-5 w-5" />,
      description: 'Server CPU utilization',
      threshold: { warning: 80, critical: 90 }
    },
    {
      name: 'Memory Usage',
      value: 82,
      unit: '%',
      status: 'warning',
      icon: <Memory className="h-5 w-5" />,
      description: 'RAM utilization',
      threshold: { warning: 80, critical: 95 }
    },
    {
      name: 'Disk Usage',
      value: 45,
      unit: '%',
      status: 'healthy',
      icon: <HardDrive className="h-5 w-5" />,
      description: 'Storage utilization',
      threshold: { warning: 85, critical: 95 }
    },
    {
      name: 'Network I/O',
      value: 234,
      unit: 'Mbps',
      status: 'healthy',
      icon: <Wifi className="h-5 w-5" />,
      description: 'Network throughput',
      threshold: { warning: 800, critical: 950 }
    }
  ];

  const mockServices: ServiceStatus[] = [
    {
      name: 'API Gateway',
      status: 'online',
      uptime: 99.9,
      responseTime: 145,
      lastIncident: null
    },
    {
      name: 'Database',
      status: 'online',
      uptime: 99.8,
      responseTime: 23,
      lastIncident: null
    },
    {
      name: 'Voice Processing',
      status: 'degraded',
      uptime: 98.2,
      responseTime: 456,
      lastIncident: '2 hours ago'
    },
    {
      name: 'Authentication',
      status: 'online',
      uptime: 100,
      responseTime: 89,
      lastIncident: null
    },
    {
      name: 'File Storage',
      status: 'online',
      uptime: 99.9,
      responseTime: 234,
      lastIncident: null
    }
  ];

  useEffect(() => {
    fetchSystemStatus();
    
    if (autoRefresh) {
      const interval = setInterval(fetchSystemStatus, 30000); // Update every 30 seconds
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const fetchSystemStatus = async () => {
    setIsLoading(true);
    try {
      // Simulate API call to fetch real-time metrics
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Add some random variation to make it feel live
      const updatedMetrics = mockMetrics.map(metric => ({
        ...metric,
        value: metric.value + (Math.random() - 0.5) * 10
      }));
      
      setMetrics(updatedMetrics);
      setServices(mockServices);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to fetch system status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getMetricStatus = (value: number, threshold: { warning: number; critical: number }) => {
    if (value >= threshold.critical) return 'critical';
    if (value >= threshold.warning) return 'warning';
    return 'healthy';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'online':
        return 'text-green-600 bg-green-100';
      case 'warning':
      case 'degraded':
        return 'text-yellow-600 bg-yellow-100';
      case 'critical':
      case 'offline':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getProgressBarColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-500';
      case 'warning':
        return 'bg-yellow-500';
      case 'critical':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const overallSystemHealth = () => {
    const criticalCount = metrics.filter(m => m.status === 'critical').length;
    const warningCount = metrics.filter(m => m.status === 'warning').length;
    const offlineServices = services.filter(s => s.status === 'offline').length;
    
    if (criticalCount > 0 || offlineServices > 0) return 'critical';
    if (warningCount > 0) return 'warning';
    return 'healthy';
  };

  return (
    <div className="space-y-6">
      {/* Overall Status Header */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">System Status</h2>
          <div className="flex items-center space-x-3">
            <Badge className={getStatusColor(overallSystemHealth())}>
              {overallSystemHealth() === 'healthy' && 'All Systems Operational'}
              {overallSystemHealth() === 'warning' && 'Minor Issues Detected'}
              {overallSystemHealth() === 'critical' && 'Critical Issues'}
            </Badge>
            <span className="text-sm text-gray-500">
              Updated: {lastUpdated.toLocaleTimeString()}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchSystemStatus}
              disabled={isLoading}
            >
              {isLoading ? 'Updating...' : 'Refresh'}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-3">
            <Server className="h-8 w-8 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">Server Health</p>
              <p className="font-semibold">Operational</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Activity className="h-8 w-8 text-green-600" />
            <div>
              <p className="text-sm text-gray-600">Average Uptime</p>
              <p className="font-semibold">99.8%</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <AlertTriangle className="h-8 w-8 text-yellow-600" />
            <div>
              <p className="text-sm text-gray-600">Active Alerts</p>
              <p className="font-semibold">2 warnings</p>
            </div>
          </div>
        </div>
      </Card>

      {/* System Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => {
          const actualStatus = getMetricStatus(metric.value, metric.threshold);
          
          return (
            <Card
              key={index}
              className="p-4 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => onMetricClick?.(metric.name)}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <div className={`p-2 rounded-lg ${getStatusColor(actualStatus)}`}>
                    {metric.icon}
                  </div>
                  <span className="font-medium text-gray-900">{metric.name}</span>
                </div>
                <Badge className={getStatusColor(actualStatus)}>
                  {actualStatus}
                </Badge>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">
                    {metric.value.toFixed(1)}{metric.unit}
                  </span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${getProgressBarColor(actualStatus)}`}
                    style={{ width: `${Math.min(metric.value, 100)}%` }}
                  />
                </div>
                
                <p className="text-xs text-gray-600">{metric.description}</p>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Service Status */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Service Status</h3>
        <div className="space-y-4">
          {services.map((service, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className={`w-3 h-3 rounded-full ${
                  service.status === 'online' ? 'bg-green-500' :
                  service.status === 'degraded' ? 'bg-yellow-500' : 'bg-red-500'
                }`} />
                <div>
                  <h4 className="font-medium text-gray-900">{service.name}</h4>
                  <p className="text-sm text-gray-600">
                    Uptime: {service.uptime}% • Response: {service.responseTime}ms
                    {service.lastIncident && (
                      <span className="text-red-600"> • Last incident: {service.lastIncident}</span>
                    )}
                  </p>
                </div>
              </div>
              
              <Badge className={getStatusColor(service.status)}>
                {service.status}
              </Badge>
            </div>
          ))}
        </div>
      </Card>

      {/* Historical Performance */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Performance History (24h)</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Response Times</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Average</span>
                <span className="font-medium">234ms</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>95th Percentile</span>
                <span className="font-medium">456ms</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Peak</span>
                <span className="font-medium">892ms</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Error Rates</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>HTTP 4xx</span>
                <span className="font-medium text-yellow-600">0.2%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>HTTP 5xx</span>
                <span className="font-medium text-red-600">0.01%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Timeouts</span>
                <span className="font-medium text-red-600">0.05%</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Resource Usage</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Peak CPU</span>
                <span className="font-medium">89%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Peak Memory</span>
                <span className="font-medium">94%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Network Peak</span>
                <span className="font-medium">456 Mbps</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};