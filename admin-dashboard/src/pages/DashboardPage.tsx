import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Users, Phone, BarChart2, Settings } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import CallActivityChart from '@/components/dashboard/CallActivityChart';
import RecentCalls from '@/components/dashboard/RecentCalls';
import AgentPerformance from '@/components/dashboard/AgentPerformance';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const stats = [
    { title: 'Total Calls', value: '1,234', icon: Phone, change: '+12%' },
    { title: 'Active Agents', value: '24', icon: Users, change: '+3' },
    { title: 'Avg. Duration', value: '4:32', icon: Activity, change: '-0:12' },
    { title: 'Satisfaction', value: '92%', icon: BarChart2, change: '+2%' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => navigate('/settings')}>
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-gray-500 mt-1">{stat.change} from last week</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Call Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <CallActivityChart />
            </CardContent>
          </Card>
        </div>
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Agent Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <AgentPerformance />
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Calls</CardTitle>
        </CardHeader>
        <CardContent>
          <RecentCalls />
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;
