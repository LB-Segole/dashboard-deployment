import { useDashboardOverview } from '@/hooks/useDashboardOverview';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/Card';
import { Icons } from '@/components/Icons';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { formatDuration } from '@/lib/utils';
import { DatePicker } from '@/components/ui/Date-picker';

export const Overview = () => {
  const { data, loading, error } = useDashboardOverview();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Icons.spinner className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4">
        <div className="flex items-center text-red-800">
          <Icons.alertCircle className="h-5 w-5 mr-2" />
          <h3 className="font-medium">Error loading dashboard data</h3>
        </div>
        <p className="mt-2 text-sm text-red-700">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Calls</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{data?.totalCalls}</div>
            <p className="text-sm text-gray-500 mt-1">
              {data?.callChangePercentage >= 0 ? (
                <span className="text-green-600">
                  <Icons.arrowUp className="h-4 w-4 inline" />{' '}
                  {data?.callChangePercentage}% from last period
                </span>
              ) : (
                <span className="text-red-600">
                  <Icons.arrowDown className="h-4 w-4 inline" />{' '}
                  {Math.abs(data?.callChangePercentage || 0)}% from last period
                </span>
              )}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Agents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{data?.activeAgents}</div>
            <p className="text-sm text-gray-500 mt-1">
              {data?.agentChangePercentage >= 0 ? (
                <span className="text-green-600">
                  <Icons.arrowUp className="h-4 w-4 inline" />{' '}
                  {data?.agentChangePercentage}% from last period
                </span>
              ) : (
                <span className="text-red-600">
                  <Icons.arrowDown className="h-4 w-4 inline" />{' '}
                  {Math.abs(data?.agentChangePercentage || 0)}% from last period
                </span>
              )}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Avg. Call Duration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {formatDuration(data?.avgCallDuration || 0)}
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {data?.durationChangePercentage >= 0 ? (
                <span className="text-green-600">
                  <Icons.arrowUp className="h-4 w-4 inline" />{' '}
                  {data?.durationChangePercentage}% from last period
                </span>
              ) : (
                <span className="text-red-600">
                  <Icons.arrowDown className="h-4 w-4 inline" />{' '}
                  {Math.abs(data?.durationChangePercentage || 0)}% from last period
                </span>
              )}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Success Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{data?.successRate}%</div>
            <p className="text-sm text-gray-500 mt-1">
              {data?.successRateChangePercentage >= 0 ? (
                <span className="text-green-600">
                  <Icons.arrowUp className="h-4 w-4 inline" />{' '}
                  {data?.successRateChangePercentage}% from last period
                </span>
              ) : (
                <span className="text-red-600">
                  <Icons.arrowDown className="h-4 w-4 inline" />{' '}
                  {Math.abs(data?.successRateChangePercentage || 0)}% from last period
                </span>
              )}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Call Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data?.callActivity}>
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="calls" fill="#2563eb" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Call Duration Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data?.durationTrend}>
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="duration"
                    stroke="#2563eb"
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};