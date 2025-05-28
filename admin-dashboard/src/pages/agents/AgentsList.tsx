import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAgentManagement } from '@/hooks/useAgentManagement';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/Dropdown-menu';
import { Icons } from '@/components/Icons';
import { Badge } from '@/components/ui/Badge';

export const AgentsList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const {
    agents,
    loading,
    error,
    fetchAgents,
    removeAgent,
  } = useAgentManagement();

  useEffect(() => {
    fetchAgents(currentPage, 10);
  }, [currentPage, searchTerm]);

  const handleDelete = async (agentId: string) => {
    if (confirm('Are you sure you want to delete this agent?')) {
      await removeAgent(agentId);
      fetchAgents(currentPage, 10);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">AI Agents</h1>
        <Button onClick={() => navigate('/agents/create')}>
          <span className="h-4 w-4 mr-2"><Icons.spinner /></span>
          Create Agent
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <Input
          placeholder="Search agents..."
          className="max-w-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <span className="h-4 w-4 mr-2"><Icons.spinner /></span>
            Refresh
          </Button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <div className="flex items-center text-red-800">
            <span className="h-5 w-5 mr-2"><Icons.spinner /></span>
            <h3 className="font-medium">Error loading agents</h3>
          </div>
          <p className="mt-2 text-sm text-red-700">{error}</p>
        </div>
      )}

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && !agents.length ? (
              <TableRow>
                <TableCell colSpan={2} className="h-24 text-center">
                  <span className="h-6 w-6 animate-spin mx-auto"><Icons.spinner /></span>
                </TableCell>
              </TableRow>
            ) : agents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={2} className="h-24 text-center">
                  No agents found
                </TableCell>
              </TableRow>
            ) : (
              agents.map((agent) => (
                <TableRow key={agent.id}>
                  <TableCell className="font-medium">
                    {agent.name}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <span className="h-4 w-4"><Icons.spinner /></span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => navigate(`/agents/${agent.id}`)}
                        >
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(agent.id)}
                        >
                          Delete
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
    </div>
  );
};