import React, { useState } from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../ui/Table';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Eye, Download, Play } from 'lucide-react';

interface Call {
  id: string;
  userId: string;
  userEmail: string;
  agentName: string;
  phoneNumber: string;
  duration: number;
  status: 'completed' | 'failed' | 'in-progress' | 'cancelled';
  callType: 'inbound' | 'outbound';
  startTime: string;
  endTime: string;
  cost: number;
  transcript: boolean;
  recording: boolean;
}

interface CallsTableProps {
  calls: Call[];
  onView?: (call: Call) => void;
  onPlayRecording?: (call: Call) => void;
  onDownloadTranscript?: (call: Call) => void;
}

export const CallsTable: React.FC<CallsTableProps> = ({
  calls,
  onView,
  onPlayRecording,
  onDownloadTranscript
}) => {
  const [sortField, setSortField] = useState<keyof Call>('startTime');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const sortedCalls = [...calls].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const handleSort = (field: keyof Call) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getStatusBadge = (status: Call['status']) => {
    const variants: Record<Call['status'], 'default' | 'success' | 'warning' | 'destructive'> = {
      completed: 'success',
      failed: 'destructive',
      'in-progress': 'warning',
      cancelled: 'default'
    };
    
    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  const getCallTypeBadge = (type: Call['callType']) => {
    return (
      <Badge variant={type === 'inbound' ? 'default' : 'secondary'}>
        {type}
      </Badge>
    );
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Agent</TableHead>
            <TableHead>Phone Number</TableHead>
            <TableHead>Type</TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-gray-100"
              onClick={() => handleSort('startTime')}
            >
              Start Time {sortField === 'startTime' && (sortDirection === 'asc' ? '↑' : '↓')}
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-gray-100"
              onClick={() => handleSort('duration')}
            >
              Duration {sortField === 'duration' && (sortDirection === 'asc' ? '↑' : '↓')}
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-gray-100"
              onClick={() => handleSort('status')}
            >
              Status {sortField === 'status' && (sortDirection === 'asc' ? '↑' : '↓')}
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-gray-100"
              onClick={() => handleSort('cost')}
            >
              Cost {sortField === 'cost' && (sortDirection === 'asc' ? '↑' : '↓')}
            </TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedCalls.map((call) => (
            <TableRow key={call.id}>
              <TableCell>
                <div>
                  <div className="font-medium">{call.userEmail}</div>
                  <div className="text-sm text-gray-500">ID: {call.userId}</div>
                </div>
              </TableCell>
              <TableCell>{call.agentName}</TableCell>
              <TableCell>{call.phoneNumber}</TableCell>
              <TableCell>{getCallTypeBadge(call.callType)}</TableCell>
              <TableCell>
                <div>
                  <div>{new Date(call.startTime).toLocaleString()}</div>
                  {call.endTime && (
                    <div className="text-sm text-gray-500">
                      Ended: {new Date(call.endTime).toLocaleString()}
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>{formatDuration(call.duration)}</TableCell>
              <TableCell>{getStatusBadge(call.status)}</TableCell>
              <TableCell>${call.cost.toFixed(2)}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  {onView && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onView(call)}
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  )}
                  {call.recording && onPlayRecording && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onPlayRecording(call)}
                      title="Play Recording"
                    >
                      <Play className="h-4 w-4" />
                    </Button>
                  )}
                  {call.transcript && onDownloadTranscript && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDownloadTranscript(call)}
                      title="Download Transcript"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      {calls.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No calls found</p>
        </div>
      )}
    </div>
  );
};

export default CallsTable;