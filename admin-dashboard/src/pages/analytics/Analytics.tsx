import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { CallMetrics } from './CallMetrics';
import { APIUsageMetrics } from './APIUsageMetrics';
import { RevenueAnalysis } from './RevenueAnalysis';
import { UserMetrics } from './UserMetrics';

export const Analytics = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
      </div>

      <Tabs defaultValue="calls" className="w-full">
        <TabsList>
          <TabsTrigger value="calls">Call Metrics</TabsTrigger>
          <TabsTrigger value="api">API Usage</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="users">User Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="calls">
          <CallMetrics />
        </TabsContent>

        <TabsContent value="api">
          <APIUsageMetrics />
        </TabsContent>

        <TabsContent value="revenue">
          <RevenueAnalysis />
        </TabsContent>

        <TabsContent value="users">
          <UserMetrics />
        </TabsContent>
      </Tabs>
    </div>
  );
};