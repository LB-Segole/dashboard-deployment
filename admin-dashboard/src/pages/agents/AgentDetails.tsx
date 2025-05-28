import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAgentManagement } from '@/hooks/useAgentManagement';
import { AgentConfig } from './AgentConfig';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { Icons } from '@/components/Icons';
import { Button } from '@/components/ui/Button';
import { Agent } from '@/types/agentTypes';

export const AgentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { selectedAgent, loading, error, getAgent } = useAgentManagement();

  useEffect(() => {
    if (id && typeof id === 'string') {
      getAgent(id);
    }
  }, [id, getAgent]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Icons.spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4">
        <div className="flex items-center text-red-800">
          <Icons.spinner />
          <h3 className="font-medium">Error loading agent</h3>
        </div>
        <p className="mt-2 text-sm text-red-700">{error}</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => navigate('/agents')}
        >
          Back to Agents
        </Button>
      </div>
    );
  }

  if (!selectedAgent) {
    return (
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
        <div className="flex items-center text-gray-800">
          <Icons.spinner />
          <h3 className="font-medium">Agent not found</h3>
        </div>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => navigate('/agents')}
        >
          Back to Agents
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{selectedAgent.name}</h1>
          <p className="text-gray-600 mt-1">
            ID: {selectedAgent.id}
          </p>
        </div>
      </div>

      <Tabs defaultValue="configuration" className="w-full">
        <TabsList>
          <TabsTrigger value="configuration">Configuration</TabsTrigger>
          <TabsTrigger value="call-history">Call History</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="configuration">
          <AgentConfig agentId={selectedAgent.id} />
        </TabsContent>

        <TabsContent value="call-history">
          <div className="rounded-lg border p-4">
            <h3 className="font-medium">Call History</h3>
            <p className="text-sm text-gray-500 mt-1">Coming soon - call history dashboard</p>
          </div>
        </TabsContent>

        <TabsContent value="performance">
          <div className="rounded-lg border p-4">
            <h3 className="font-medium">Performance Metrics</h3>
            <p className="text-sm text-gray-500 mt-1">
              Coming soon - agent performance dashboard
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};