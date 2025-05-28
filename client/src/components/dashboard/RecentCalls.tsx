import { PhoneIncoming, PhoneOutgoing, PhoneMissed, Clock, MoreVertical } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/Badge';

type RecentCall = {
  id: string;
  contact: string;
  type: 'incoming' | 'outgoing' | 'missed';
  date: Date;
  duration: number;
  status: 'completed' | 'failed' | 'no-answer';
};

export function RecentCalls() {
  const calls: RecentCall[] = [
    {
      id: '1',
      contact: 'Alex Johnson',
      type: 'outgoing',
      date: new Date(Date.now() - 1800000), // 30 mins ago
      duration: 142,
      status: 'completed'
    },
    {
      id: '2',
      contact: 'Sales Prospect',
      type: 'incoming',
      date: new Date(Date.now() - 86400000), // 1 day ago
      duration: 236,
      status: 'completed'
    },
    {
      id: '3',
      contact: 'Support Ticket #4521',
      type: 'missed',
      date: new Date(Date.now() - 172800000), // 2 days ago
      duration: 0,
      status: 'no-answer'
    },
    {
      id: '4',
      contact: 'Sarah Williams',
      type: 'outgoing',
      date: new Date(Date.now() - 259200000), // 3 days ago
      duration: 0,
      status: 'failed'
    }
  ];

  const getCallIcon = (type: string) => {
    switch (type) {
      case 'incoming': return <PhoneIncoming className="h-4 w-4" />;
      case 'outgoing': return <PhoneOutgoing className="h-4 w-4" />;
      case 'missed': return <PhoneMissed className="h-4 w-4" />;
      default: return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed': return <Badge variant="outline" className="border-green-200 text-green-600">Completed</Badge>;
      case 'failed': return <Badge variant="outline" className="border-red-200 text-red-600">Failed</Badge>;
      case 'no-answer': return <Badge variant="outline" className="border-orange-200 text-orange-600">No Answer</Badge>;
      default: return null;
    }
  };

  const formatDuration = (seconds: number) => {
    if (seconds === 0) return '--';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - date.getTime()) / 3600000);
    
    if (diffHours < 24) {
      if (diffHours < 1) {
        const mins = Math.floor((now.getTime() - date.getTime()) / 60000);
        return `${mins} min ago`;
      }
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h3 className="font-semibold text-lg">Recent Calls</h3>
        <button className="text-sm text-blue-600 hover:text-blue-800">
          View All
        </button>
      </div>
      
      <div className="divide-y divide-gray-200">
        {calls.map(call => (
          <div key={call.id} className="p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="bg-blue-100 text-blue-600">
                    {call.contact.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{call.contact}</p>
                    <div className="text-gray-500">
                      {getCallIcon(call.type)}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <p className="text-sm text-gray-500">
                      {formatDate(call.date)}
                    </p>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Clock className="h-3 w-3" />
                      <span>{formatDuration(call.duration)}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                {getStatusBadge(call.status)}
                <button className="text-gray-400 hover:text-gray-600">
                  <MoreVertical className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}