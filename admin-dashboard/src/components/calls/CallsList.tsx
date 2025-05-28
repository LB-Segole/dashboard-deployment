import React from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow, format } from 'date-fns';
import { Call } from '@/types/callTypes';
import { Agent } from '@/types/admin';
import { Icons } from '@/components/ui/Icons';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';

interface CallsListProps {
  calls: Call[];
  agents: Agent[];
  loading: boolean;
  error: string | null;
}

const formatPhoneNumber = (number: string) => {
  const cleaned = ('' + number).replace(/\D/g, '');
  const match = cleaned.match(/^(\d{1})(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `+${match[1]} (${match[2]}) ${match[3]}-${match[4]}`;
  }
  return number;
};

const formatDuration = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m ${remainingSeconds}s`;
  }
  if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`;
  }
  return `${remainingSeconds}s`;
};

export const CallsList: React.FC<CallsListProps> = ({
  calls,
  agents,
  loading,
  error,
}) => {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-[200px] flex items-center justify-center">
        <Icons.spinner className="h-8 w-8" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[200px] flex items-center justify-center text-red-500">
        <Icons.alertCircle className="h-5 w-5 mr-2" />
        {error}
      </div>
    );
  }

  if (!calls.length) {
    return (
      <div className="min-h-[200px] flex items-center justify-center text-gray-500">
        No calls found
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Time</TableHead>
          <TableHead>From</TableHead>
          <TableHead>To</TableHead>
          <TableHead>Agent</TableHead>
          <TableHead>Duration</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {calls.map((call) => {
          const agent = agents.find((a) => a.id === call.agentId);
          return (
            <TableRow key={call.id}>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-medium">
                    {format(new Date(call.startTime), 'HH:mm')}
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(call.startTime), { addSuffix: true })}
                  </span>
                </div>
              </TableCell>
              <TableCell>{formatPhoneNumber(call.from.number)}</TableCell>
              <TableCell>{formatPhoneNumber(call.to.number)}</TableCell>
              <TableCell>{agent?.name || call.agentId}</TableCell>
              <TableCell>{formatDuration(call.duration)}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    call.status === 'completed'
                      ? 'positive'
                      : call.status === 'failed'
                      ? 'negative'
                      : 'neutral'
                  }
                >
                  {call.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(`/calls/${call.id}`)}
                >
                  View Details
                </Button>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}; 