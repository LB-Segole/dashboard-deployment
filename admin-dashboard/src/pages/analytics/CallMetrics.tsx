import { useCallAnalytics } from '@/hooks/useCallAnalytics';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Icons } from '@/components/Icons';
import { Button } from '@/components/ui/Button';
import { DatePicker } from '@/components/ui/Date-picker';
import { useAgentManagement } from '@/hooks/useAgentManagement';

export const CallMetrics = () => {
  const { data, loading, error, params, updateParams, refresh } = useCallAnalytics();
  const { agents } = useAgentManagement();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Call Analytics</h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={refresh}>
            <Icons.refreshCw
              className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`}
            />
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Date Range</label>
          <DatePicker
            mode="range"
            selected={{
              from: params.dateRange?.start,
              to: params.dateRange?.end,
            }}
            onSelect={(range) => {
              if (range?.from && range.to) {
                updateParams({
                  dateRange: {
                    start: range.from,
                    end: range.to,
                  },
                });
              }
            }}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Agent</label>
          <select
            className="w-full rounded-md border border-gray-300 p-2"
            value={params.agentId || ''}
            onChange={(e) =>
              updateParams({
                agentId: e.target.value || undefined,
              })
            }
          >
            <option value="">All Agents</option>
            {agents.map((agent) => (
              <option key={agent.id} value={agent.id}>
                {agent.config.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select
            className="w-full rounded-md border border-gray-300 p-2"
            value={params.status || 'all'}
            onChange={(e) =>
              updateParams({
                status: e.target.value === 'all' ? undefined : (e.target.value as any),
              })
            }
          >
            <option value="all">All Statuses</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <div className="flex items-center text-red-800">
            <Icons.alertCircle className="h-5 w-5 mr-2" />
            <h3 className="font-medium">Error loading analytics</h3>
          </div>
          <p className="mt-2 text-sm text-red-700">{error}</p>
        </div>
      )}

      {loading && !data ? (
        <div className="flex justify-center items-center h-64">
          <Icons.spinner className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <h3 className="font-medium mb-4">Call Volume</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data?.callVolume}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#2563eb"
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg border shadow-sm">
              <h3 className="font-medium mb-4">Call Duration (seconds)</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data?.callDuration}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="range" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#2563eb" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border shadow-sm">
              <h3 className="font-medium mb-4">Call Outcomes</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data?.callOutcomes}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="outcome" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#2563eb" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};