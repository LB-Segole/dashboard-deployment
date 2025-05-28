import { useState } from 'react';
import { useCalls } from '@/hooks/useCalls';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Icons } from '@/components/Icons';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/Dropdown-menu';
import { formatDuration, formatPhoneNumber } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { DatePicker } from '@/components/ui/Date-picker';
import { useAgentManagement } from '@/hooks/useAgentManagement';

export const CallsOverview = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [agentFilter, setAgentFilter] = useState<string>('all');
  
  const { calls, loading, error, totalCount, refresh } = useCalls({
    page: currentPage,
    search: searchTerm,
    from: dateRange.from,
    to: dateRange.to,
    status: statusFilter === 'all' ? undefined : statusFilter,
    agentId: agentFilter === 'all' ? undefined : agentFilter,
  });

  const { agents } = useAgentManagement();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Call History</h1>
        <Button onClick={refresh} disabled={loading}>
          <Icons.spinner />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-2">
          <Input
            placeholder="Search calls..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div>
          <DatePicker
            mode="range"
            selected={{
              from: dateRange.from,
              to: dateRange.to,
            }}
            onSelect={(range) => {
              setDateRange({
                from: range?.from,
                to: range?.to,
              });
            }}
            placeholder="Date range"
          />
        </div>
        <div className="flex space-x-2">
          <select
            className="w-full rounded-md border border-gray-300 p-2"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
          </select>
          <select
            className="w-full rounded-md border border-gray-300 p-2"
            value={agentFilter}
            onChange={(e) => setAgentFilter(e.target.value)}
          >
            <option value="all">All Agents</option>
            {agents.map((agent) => (
              <option key={agent.id} value={agent.id}>
                {agent.config.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <div className="flex items-center text-red-800">
            <Icons.spinner />
            <h3 className="font-medium">Error loading calls</h3>
          </div>
          <p className="mt-2 text-sm text-red-700">{error}</p>
        </div>
      )}

      <div className="rounded-lg border">
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
            {loading && !calls.length ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  <Icons.spinner />
                </TableCell>
              </TableRow>
            ) : calls.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No calls found
                </TableCell>
              </TableRow>
            ) : (
              calls.map((call) => (
                <TableRow key={call.id}>
                  <TableCell>
                    {new Date(call.startTime).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </TableCell>
                  <TableCell>{formatPhoneNumber(call.from.number)}</TableCell>
                  <TableCell>{formatPhoneNumber(call.to.number)}</TableCell>
                  <TableCell>
                    {agents.find((a) => a.id === call.agentId)?.config.name ||
                      call.agentId}
                  </TableCell>
                  <TableCell>{formatDuration(call.duration)}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        call.status === 'completed'
                          ? 'success'
                          : call.status === 'failed'
                          ? 'destructive'
                          : 'default'
                      }
                    >
                      {call.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <Icons.spinner />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          Download
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Showing {calls.length} of {totalCount} calls
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            disabled={calls.length < 20}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};