import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAgent } from '../hooks/useAgents';
import { Activity, Phone, Users, BarChart2, ArrowUpRight } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useCalls } from '../hooks/useCalls';
import { useAuth } from '../hooks/useAuth';

interface DashboardStats {
  totalCalls: number;
  activeCalls: number;
  averageCallDuration: number;
  successRate: number;
}

const StatCard = ({ icon, title, value, change }: { icon: React.ReactNode; title: string; value: string; change: number }) => {
  const isPositive = change >= 0;

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div className="p-3 rounded-lg bg-blue-50 text-blue-600">
          {icon}
        </div>
        <div className={`flex items-center text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {change}% <ArrowUpRight className={`h-4 w-4 ml-1 ${!isPositive && 'transform rotate-90'}`} />
        </div>
      </div>
      <h3 className="mt-4 text-lg font-semibold text-gray-900">{value}</h3>
      <p className="text-sm text-gray-500">{title}</p>
    </Card>
  );
};

export const Dashboard: React.FC = () => {
  const { config } = useAgent({
    id: 'default',
    websocketUrl: process.env.NEXT_PUBLIC_WS_URL || '',
    apiUrl: process.env.NEXT_PUBLIC_API_URL || '',
    authToken: '',
    voice: 'en-US-Standard-A',
    speakingRate: 1,
    pitch: 0,
    language: 'en-US'
  });

  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const response = await fetch(`${config.apiUrl}/stats`, {
        headers: {
          Authorization: `Bearer ${config.authToken}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard stats');
      }
      return response.json();
    }
  });

  const { callHistory } = useCalls();
  const { state: { user } } = useAuth();

  // Calculate stats
  const totalCalls = callHistory.length;
  const completedCalls = callHistory.filter(call => call.status === 'ended' && call.duration > 0).length;
  const avgDuration = callHistory.reduce((sum, call) => sum + call.duration, 0) / (completedCalls || 1);
  const uniqueContacts = new Set(callHistory.map(call => call.from === 'user-123' ? call.to : call.from)).size;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="rounded-md bg-indigo-500 p-3">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Calls</dt>
                    <dd className="text-lg font-semibold text-gray-900">{stats?.totalCalls ?? 0}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="rounded-md bg-green-500 p-3">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Active Calls</dt>
                    <dd className="text-lg font-semibold text-gray-900">{stats?.activeCalls ?? 0}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="rounded-md bg-yellow-500 p-3">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Average Duration</dt>
                    <dd className="text-lg font-semibold text-gray-900">
                      {stats?.averageCallDuration ? `${Math.round(stats.averageCallDuration / 60)}m` : '0m'}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="rounded-md bg-blue-500 p-3">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Success Rate</dt>
                    <dd className="text-lg font-semibold text-gray-900">
                      {stats?.successRate ? `${Math.round(stats.successRate * 100)}%` : '0%'}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<Phone className="h-5 w-5" />}
            title="Total Calls"
            value={totalCalls.toString()}
            change={12}
          />
          <StatCard
            icon={<Activity className="h-5 w-5" />}
            title="Completed Calls"
            value={completedCalls.toString()}
            change={8}
          />
          <StatCard
            icon={<BarChart2 className="h-5 w-5" />}
            title="Avg. Duration"
            value={`${Math.floor(avgDuration / 60)}m ${Math.floor(avgDuration % 60)}s`}
            change={5}
          />
          <StatCard
            icon={<Users className="h-5 w-5" />}
            title="Unique Contacts"
            value={uniqueContacts.toString()}
            change={15}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-2 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </div>
            
            <div className="space-y-6">
              {callHistory.slice(0, 3).map((call) => (
                <div key={call.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 rounded-full bg-gray-100">
                      <Phone className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {call.from === 'user-123' ? call.to : call.from}
                      </p>
                      <p className="text-sm text-gray-500">
                        {call.from === 'user-123' ? 'Outgoing' : 'Incoming'} • {new Date(call.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-sm font-medium">
                    {Math.floor(call.duration / 60)}m {call.duration % 60}s
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
            <div className="space-y-4">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                <Phone className="mr-2 h-5 w-5" />
                Start New Call
              </Button>
              <Button variant="outline" className="w-full">
                <Users className="mr-2 h-5 w-5" />
                Manage Contacts
              </Button>
              <Button variant="outline" className="w-full">
                <Activity className="mr-2 h-5 w-5" />
                View Analytics
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};