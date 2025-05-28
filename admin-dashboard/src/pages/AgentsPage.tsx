import React from 'react';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { AgentsList } from '@/pages/agents/AgentsList';

const AgentsPage: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Agents</h1>
        <Button asChild>
          <Link to="/agents/new" className="flex items-center">
            <Plus className="w-4 h-4 mr-2" />
            Add Agent
          </Link>
        </Button>
      </div>
      <AgentsList />
    </div>
  );
};

export default AgentsPage;
