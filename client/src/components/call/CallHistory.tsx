import React, { useState } from 'react';
import { Phone, PhoneIncoming, PhoneOutgoing, PhoneMissed, Clock, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

type CallHistoryItem = {
  id: string;
  type: 'incoming' | 'outgoing' | 'missed';
  contact: string;
  number: string;
  date: Date;
  duration: number; // seconds
  recordingAvailable?: boolean;
};

export function CallHistory() {
  const [calls, setCalls] = useState<CallHistoryItem[]>([
    {
      id: '1',
      type: 'outgoing',
      contact: 'Customer Support',
      number: '+1 (555) 123-4567',
      date: new Date(Date.now() - 3600000),
      duration: 142,
      recordingAvailable: true
    },
    {
      id: '2',
      type: 'incoming',
      contact: 'Sales Lead',
      number: '+1 (555) 987-6543',
      date: new Date(Date.now() - 86400000),
      duration: 236,
      recordingAvailable: false
    },
    {
      id: '3',
      type: 'missed',
      contact: 'Unknown',
      number: 'Private Number',
      date: new Date(Date.now() - 172800000),
      duration: 0
    }
  ]);

  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const formatDuration = (seconds: number) => {
    if (seconds === 0) return '';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const getCallIcon = (type: string) => {
    switch (type) {
      case 'incoming': return <PhoneIncoming className="h-5 w-5 text-blue-500" />;
      case 'outgoing': return <PhoneOutgoing className="h-5 w-5 text-green-500" />;
      case 'missed': return <PhoneMissed className="h-5 w-5 text-red-500" />;
      default: return <Phone className="h-5 w-5" />;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-semibold text-lg">Call History</h3>
      </div>
      
      <div className="divide-y divide-gray-200">
        {calls.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No call history available
          </div>
        ) : (
          calls.map(call => (
            <div key={call.id} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-gray-100">
                    {getCallIcon(call.type)}
                  </div>
                  <div>
                    <p className="font-medium">{call.contact}</p>
                    <p className="text-sm text-gray-500">{call.number}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {formatDate(call.date)}
                    </p>
                    {call.duration > 0 && (
                      <p className="text-xs text-gray-500 flex items-center gap-1 justify-end">
                        <Clock className="h-3 w-3" />
                        {formatDuration(call.duration)}
                      </p>
                    )}
                  </div>
                  
                  {call.recordingAvailable && (
                    <Badge variant="outline" className="border-blue-200 text-blue-600">
                      Recording
                    </Badge>
                  )}
                  
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      {calls.length > 0 && (
        <div className="p-4 border-t border-gray-200 text-center">
          <button className="text-sm font-medium text-blue-600 hover:text-blue-800">
            View all call history
          </button>
        </div>
      )}
    </div>
  );
}