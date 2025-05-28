import { useRevenueAnalytics } from '@/hooks/useRevenueAnalytics';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import { Icons } from '@/components/Icons';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';

export const RevenueAnalysis = () => {
  const { data, loading, error, timeRange, setTimeRange, refresh } =
    useRevenueAnalytics();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Revenue Analysis</h2>
        <div className="flex items-center space-x-2">
          <Select
            value={timeRange}
            onChange={e => setTimeRange(e.target.value)}
            options={[
              { value: '7d', label: 'Last 7 Days' },
              { value: '30d', label: 'Last 30 Days' },
              { value: '90d', label: 'Last 90 Days' },
            ]}
          />
          <Button variant="outline" size="sm" onClick={refresh}>
            <span className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`}><Icons.spinner /></span>
            Refresh
          </Button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <div className="flex items-center text-red-800">
            <span className="h-5 w-5 mr-2"><Icons.spinner /></span>
            <h3 className="font-medium">Error loading revenue data</h3>
          </div>
          <p className="mt-2 text-sm text-red-700">{error}</p>
        </div>
      )}

      {loading && !data ? (
        <div className="flex justify-center items-center h-64">
          <span className="h-8 w-8 animate-spin"><Icons.spinner /></span>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <h3 className="font-medium mb-4">Daily Revenue</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data?.dailyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="amount"
                    stroke="#2563eb"
                    fill="#3b82f6"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg border shadow-sm">
              <h3 className="font-medium mb-4">Revenue by Plan</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data?.revenueByPlan}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="plan" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="amount" fill="#2563eb" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border shadow-sm">
              <h3 className="font-medium mb-4">MRR Growth</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data?.mrrGrowth}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="mrr"
                      stroke="#2563eb"
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};