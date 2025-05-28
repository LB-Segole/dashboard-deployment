import React, { useState, useEffect } from 'react';
import { Phone, User, Bot, Clock, CheckCircle, XCircle, AlertTriangle, MessageSquare } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

interface ActivityItem {
  id: string;
  type: 'call' | 'user' | 'agent' | 'system' | 'error';
  title: string;
  description: string;
  timestamp: Date;
  status: 'success' | 'error' | 'warning' | 'info';
  metadata?: {
    duration?: string;
    phoneNumber?: string;
    agentName?: string;
    userName?: string;
  };
}

interface RecentActivityProps {
  limit?: number;
  showFilters?: boolean;
  autoRefresh?: boolean;
}

export const RecentActivity: React.FC<RecentActivityProps> = ({
  limit = 20,
  showFilters = true,
  autoRefresh = true
}) => {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<ActivityItem[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>(['call', 'user', 'agent', 'system', 'error']);
  const [isLoading, setIsLoading] = useState(true);

  // Mock activity data
  const mockActivities: ActivityItem[] = [
    {
      id: '1',
      type: 'call',
      title: 'Outbound call completed',
      description: 'Sales agent successfully contacted lead and scheduled demo',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      status: 'success',
      metadata: {
        duration: '4:32',
        phoneNumber: '+1 (555) 123-4567',
        agentName: 'Sales Pro v2.1'
      }
    },
    {
      id: '2',
      type: 'user',
      title: 'New user registered',
      description: 'John Smith completed account setup and verified email',
      timestamp: new Date(Date.now() - 12 * 60 * 1000),
      status: 'success',
      metadata: {
        userName: 'John Smith'
      }
    },
    {
      id: '3',
      type: 'agent',
      title: 'Agent updated',
      description: 'Customer Support Bot v1.3 configuration updated with new responses',
      timestamp: new Date(Date.now() - 18 * 60 * 1000),
      status: 'info',
      metadata: {
        agentName: 'Customer Support Bot v1.3'
      }
    },
    {
      id: '4',
      type: 'error',
      title: 'Call failed',
      description: 'Unable to connect to customer - number unreachable',
      timestamp: new Date(Date.now() - 25 * 60 * 1000),
      status: 'error',
      metadata: {
        phoneNumber: '+1 (555) 987-6543',
        agentName: 'Lead Qualifier v1.0'
      }
    },
    {
      id: '5',
      type: 'system',
      title: 'Scheduled maintenance completed',
      description: 'API endpoints updated and system performance optimized',
      timestamp: new Date(Date.now() - 45 * 60 * 1000),
      status: 'success'
    },
    {
      id: '6',
      type: 'call',
      title: 'Inbound call received',
      description: 'Customer inquiry handled by support agent',
      timestamp: new Date(Date.now() - 52 * 60 * 1000),
      status: 'success',
      metadata: {
        duration: '2:15',
        phoneNumber: '+1 (555) 456-7890',
        agentName: 'Support Helper v1.3'
      }
    },
    {
      id: '7',
      type: 'user',
      title: 'User settings updated',
      description: 'Sarah Johnson updated notification preferences and timezone',
      timestamp: new Date(Date.now() - 67 * 60 * 1000),
      status: 'info',
      metadata: {
        userName: 'Sarah Johnson'
      }
    },
    {
      id: '8',
      type: 'agent',
      title: 'New agent deployed',
      description: 'Appointment Scheduler v2.0 successfully deployed and activated',
      timestamp: new Date(Date.now() - 78 * 60 * 1000),
      status: 'success',
      metadata: {
        agentName: 'Appointment Scheduler v2.0'
      }
    }
  ];

  useEffect(() => {
    fetchActivities();
    
    if (autoRefresh) {
      const interval = setInterval(fetchActivities, 30000); // Refresh every 30 seconds
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  useEffect(() => {
    const filtered = activities.filter(activity => 
      selectedTypes.includes(activity.type)
    ).slice(0, limit);
    
    setFilteredActivities(filtered);
  }, [activities, selectedTypes, limit]);

  const fetchActivities = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setActivities(mockActivities);
    } catch (error) {
      console.error('Failed to fetch activities:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getActivityIcon = (type: string, status: string) => {
    const iconClass = status === 'error' ? 'text-red-500' : 
                     status === 'warning' ? 'text-yellow-500' : 
                     status === 'success' ? 'text-green-500' : 'text-blue-500';

    switch (type) {
      case 'call':
        return <Phone className={`h-4 w-4 ${iconClass}`} />;
      case 'user':
        return <User className={`h-4 w-4 ${iconClass}`} />;
      case 'agent':
        return <Bot className={`h-4 w-4 ${iconClass}`} />;
      case 'system':
        return <AlertTriangle className={`h-4 w-4 ${iconClass}`} />;
      case 'error':
        return <XCircle className={`h-4 w-4 ${iconClass}`} />;
      default:
        return <MessageSquare className={`h-4 w-4 ${iconClass}`} />;
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      success: { color: 'bg-green-100 text-green-800', label: 'Success' },
      error: { color: 'bg-red-100 text-red-800', label: 'Error' },
      warning: { color: 'bg-yellow-100 text-yellow-800', label: 'Warning' },
      info: { color: 'bg-blue-100 text-blue-800', label: 'Info' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.info;
    
    return (
      <Badge className={config.color}>
        {config.label}
      </Badge>
    );
  };

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - timestamp.getTime()) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  const toggleTypeFilter = (type: string) => {
    setSelectedTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const typeFilters = [
    { key: 'call', label: 'Calls', icon: <Phone className="h-4 w-4" /> },
    { key: 'user', label: 'Users', icon: <User className="h-4 w-4" /> },
    { key: 'agent', label: 'Agents', icon: <Bot className="h-4 w-4" /> },
    { key: 'system', label: 'System', icon: <AlertTriangle className="h-4 w-4" /> },
    { key: 'error', label: 'Errors', icon: <XCircle className="h-4 w-4" /> }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
        <Button variant="outline" size="sm" onClick={fetchActivities} disabled={isLoading}>
          {isLoading ? 'Refreshing...' : 'Refresh'}
        </Button>
      </div>

      {showFilters && (
        <div className="flex flex-wrap gap-2">
          {typeFilters.map(filter => (
            <Button
              key={filter.key}
              variant={selectedTypes.includes(filter.key) ? "default" : "outline"}
              size="sm"
              onClick={() => toggleTypeFilter(filter.key)}
              className="flex items-center space-x-2"
            >
              {filter.icon}
              <span>{filter.label}</span>
            </Button>
          ))}
        </div>
      )}

      <Card className="divide-y divide-gray-100">
        {isLoading ? (
          <div className="p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading activities...</p>
          </div>
        ) : filteredActivities.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No activities match the selected filters.
          </div>
        ) : (
          filteredActivities.map((activity) => (
            <div key={activity.id} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">
                  {getActivityIcon(activity.type, activity.status)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {activity.title}
                    </h3>
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(activity.status)}
                      <span className="text-xs text-gray-500">
                        {formatTimeAgo(activity.timestamp)}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-2">{activity.description}</p>
                  
                  {activity.metadata && (
                    <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                      {activity.metadata.phoneNumber && (
                        <span className="bg-gray-100 px-2 py-1 rounded">
                          📞 {activity.metadata.phoneNumber}
                        </span>
                      )}
                      {activity.metadata.duration && (
                        <span className="bg-gray-100 px-2 py-1 rounded">
                          ⏱️ {activity.metadata.duration}
                        </span>
                      )}
                      {activity.metadata.agentName && (
                        <span className="bg-gray-100 px-2 py-1 rounded">
                          🤖 {activity.metadata.agentName}
                        </span>
                      )}
                      {activity.metadata.userName && (
                        <span className="bg-gray-100 px-2 py-1 rounded">
                          👤 {activity.metadata.userName}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </Card>

      {filteredActivities.length > 0 && (
        <div className="text-center">
          <Button variant="outline" size="sm">
            View All Activities
          </Button>
        </div>
      )}
    </div>
  );
};