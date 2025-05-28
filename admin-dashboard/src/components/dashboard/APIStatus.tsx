import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Clock, Zap, Database, Mic, MessageSquare } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

interface APIService {
  name: string;
  status: 'healthy' | 'degraded' | 'down';
  responseTime: number;
  uptime: number;
  lastChecked: Date;
  icon: React.ReactNode;
  description: string;
  endpoint: string;
}

interface APIStatusProps {
  onRefresh?: () => void;
  autoRefresh?: boolean;
}

export const APIStatus: React.FC<APIStatusProps> = ({
  onRefresh,
  autoRefresh = true
}) => {
  const [services, setServices] = useState<APIService[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const mockServices: APIService[] = [
    {
      name: 'OpenAI API',
      status: 'healthy',
      responseTime: 245,
      uptime: 99.9,
      lastChecked: new Date(),
      icon: <MessageSquare className="h-5 w-5" />,
      description: 'Large Language Model processing',
      endpoint: 'https://api.openai.com'
    },
    {
      name: 'Deepgram API',
      status: 'healthy',
      responseTime: 156,
      uptime: 99.8,
      lastChecked: new Date(),
      icon: <Mic className="h-5 w-5" />,
      description: 'Speech-to-Text processing',
      endpoint: 'https://api.deepgram.com'
    },
    {
      name: 'SignalWire API',
      status: 'degraded',
      responseTime: 892,
      uptime: 98.5,
      lastChecked: new Date(),
      icon: <Zap className="h-5 w-5" />,
      description: 'Voice calling infrastructure',
      endpoint: 'https://api.signalwire.com'
    },
    {
      name: 'MongoDB',
      status: 'healthy',
      responseTime: 45,
      uptime: 99.95,
      lastChecked: new Date(),
      icon: <Database className="h-5 w-5" />,
      description: 'Database operations',
      endpoint: 'mongodb://cluster'
    }
  ];

  useEffect(() => {
    fetchAPIStatus();
    
    if (autoRefresh) {
      const interval = setInterval(fetchAPIStatus, 60000); // Refresh every minute
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const fetchAPIStatus = async () => {
    setIsLoading(true);
    try {
      // Simulate API call to check service status
      await new Promise(resolve => setTimeout(resolve, 1000));
      setServices(mockServices);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to fetch API status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'degraded':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'down':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-100 text-green-800';
      case 'degraded':
        return 'bg-yellow-100 text-yellow-800';
      case 'down':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getResponseTimeColor = (responseTime: number) => {
    if (responseTime < 200) return 'text-green-600';
    if (responseTime < 500) return 'text-yellow-600';
    return 'text-red-600';
  };

  const overallStatus = services.every(s => s.status === 'healthy') 
    ? 'healthy' 
    : services.some(s => s.status === 'down') 
    ? 'down' 
    : 'degraded';

  const averageResponseTime = services.length > 0 
    ? Math.round(services.reduce((sum, s) => sum + s.responseTime, 0) / services.length)
    : 0;

  const averageUptime = services.length > 0
    ? (services.reduce((sum, s) => sum + s.uptime, 0) / services.length).toFixed(2)
    : '0';

  return (
    <div className="space-y-6">
      {/* Overall Status Summary */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">API Services Status</h2>
          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-500">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                fetchAPIStatus();
                onRefresh?.();
              }}
              disabled={isLoading}
            >
              {isLoading ? 'Refreshing...' : 'Refresh'}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="flex items-center space-x-3">
            {getStatusIcon(overallStatus)}
            <div>
              <p className="text-sm font-medium text-gray-600">Overall Status</p>
              <Badge className={getStatusColor(overallStatus)}>
                {overallStatus.charAt(0).toUpperCase() + overallStatus.slice(1)}
              </Badge>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Clock className="h-5 w-5 text-blue-500" />
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Response Time</p>
              <p className={`text-lg font-semibold ${getResponseTimeColor(averageResponseTime)}`}>
                {averageResponseTime}ms
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Uptime</p>
              <p className="text-lg font-semibold text-green-600">{averageUptime}%</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Individual Service Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.map((service, index) => (
          <Card key={index} className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${
                  service.status === 'healthy' ? 'bg-green-100' :
                  service.status === 'degraded' ? 'bg-yellow-100' : 'bg-red-100'
                }`}>
                  {service.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{service.name}</h3>
                  <p className="text-sm text-gray-600">{service.description}</p>
                </div>
              </div>
              {getStatusIcon(service.status)}
            </div>

            <div className="grid grid-cols-2 gap-4 mb-3">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Response Time</p>
                <p className={`text-lg font-semibold ${getResponseTimeColor(service.responseTime)}`}>
                  {service.responseTime}ms
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Uptime</p>
                <p className="text-lg font-semibold text-green-600">{service.uptime}%</p>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>{service.endpoint}</span>
              <span>Last checked: {service.lastChecked.toLocaleTimeString()}</span>
            </div>

            <div className="mt-3">
              <Badge className={getStatusColor(service.status)}>
                {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
              </Badge>
            </div>
          </Card>
        ))}
      </div>

      {/* Service Health Indicators */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Service Health Timeline</h3>
        <div className="space-y-3">
          {services.map((service, index) => (
            <div key={index} className="flex items-center space-x-4">
              <div className="w-24 text-sm font-medium truncate">{service.name}</div>
              <div className="flex-1 flex items-center space-x-1">
                {[...Array(24)].map((_, i) => (
                  <div
                    key={i}
                    className={`h-3 w-3 rounded-sm ${
                      Math.random() > 0.1 
                        ? service.status === 'healthy' 
                          ? 'bg-green-500' 
                          : service.status === 'degraded' 
                          ? 'bg-yellow-500' 
                          : 'bg-red-500'
                        : 'bg-red-500'
                    }`}
                    title={`${24 - i} hours ago`}
                  />
                ))}
              </div>
              <div className="text-sm text-gray-500 w-16 text-right">
                {service.uptime}%
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between mt-4 text-xs text-gray-500">
          <span>24 hours ago</span>
          <span>Now</span>
        </div>
      </Card>
    </div>
  );
};