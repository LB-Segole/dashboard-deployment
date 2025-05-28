import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { Overview } from './Overview';
import { CallsOverview } from '../calls/CallsOverview';
import { AgentsList } from '../agents/AgentsList';
import { Analytics } from '../analytics/Analytics';
import { useAdminAuth } from '@/hooks/useAdminAuth';

export const AdminDashboard = () => {
  const { admin } = useAdminAuth();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">
          Welcome back, {admin?.name || 'Admin'}
        </h1>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="calls">Calls</TabsTrigger>
          <TabsTrigger value="agents">Agents</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Overview />
        </TabsContent>

        <TabsContent value="calls">
          <CallsOverview />
        </TabsContent>

        <TabsContent value="agents">
          <AgentsList />
        </TabsContent>

        <TabsContent value="analytics">
          <Analytics />
        </TabsContent>
      </Tabs>
    </div>
  );
};