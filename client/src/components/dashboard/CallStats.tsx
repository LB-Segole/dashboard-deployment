import { Phone, Clock, TrendingUp, User, BarChart2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const stats = [
  { title: 'Total Calls', value: '1,248', change: '+12%', icon: Phone },
  { title: 'Avg Duration', value: '4m 32s', change: '+5%', icon: Clock },
  { title: 'Success Rate', value: '89%', change: '+3%', icon: TrendingUp },
  { title: 'New Contacts', value: '84', change: '+18%', icon: User }
];

export function CallStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card key={index} className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {stat.title}
            </CardTitle>
            <stat.icon className="h-5 w-5 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-gray-500 mt-1">
              <span className={stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}>
                {stat.change}
              </span>{' '}
              vs last week
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}