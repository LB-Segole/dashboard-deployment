import React, { useState } from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../ui/Table';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Eye, Edit, Trash2, Play, Pause } from 'lucide-react';

interface Agent {
  id: string;
  name: string;
  personality: string;
  voice: string;
  language: string;
  status: 'active' | 'inactive' | 'training';
  callsHandled: number;
  successRate: number;
  createdAt: string;
  lastUpdated: string;
}

interface AgentsTableProps {
  agents: Agent[];
  onView?: (agent: Agent) => void;
  onEdit?: (agent: Agent) => void;
  onDelete?: (agent: Agent) => void;
  onToggleStatus?: (agent: Agent) => void;
}

export const AgentsTable: React.FC<AgentsTableProps> = ({
  agents,
  onView,
  onEdit,
  onDelete,
  onToggleStatus
}) => {
  const [sortField, setSortField] = useState<keyof Agent>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const sortedAgents = [...agents].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const handleSort = (field: keyof Agent) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getStatusBadge = (status: Agent['status']) => {
    const variants: Record<Agent['status'], 'default' | 'success' | 'warning' | 'destructive'> = {
      active: 'success',
      inactive: 'default',
      training: 'warning'
    };
    
    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  return (
    <div className="w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead 
              className="cursor-pointer hover:bg-gray-100"
              onClick={() => handleSort('name')}
            >
              Agent Name {sortField === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
            </TableHead>
            <TableHead>Personality</TableHead>
            <TableHead>Voice</TableHead>
            <TableHead>Language</TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-gray-100"
              onClick={() => handleSort('status')}
            >
              Status {sortField === 'status' && (sortDirection === 'asc' ? '↑' : '↓')}
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-gray-100"
              onClick={() => handleSort('callsHandled')}
            >
              Calls Handled {sortField === 'callsHandled' && (sortDirection === 'asc' ? '↑' : '↓')}
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-gray-100"
              onClick={() => handleSort('successRate')}
            >
              Success Rate {sortField === 'successRate' && (sortDirection === 'asc' ? '↑' : '↓')}
            </TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedAgents.map((agent) => (
            <TableRow key={agent.id}>
              <TableCell>
                <div>
                  <div className="font-medium">{agent.name}</div>
                  <div className="text-sm text-gray-500">
                    Updated: {new Date(agent.lastUpdated).toLocaleDateString()}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <span className="capitalize">{agent.personality}</span>
              </TableCell>
              <TableCell>
                <span className="capitalize">{agent.voice}</span>
              </TableCell>
              <TableCell>{agent.language}</TableCell>
              <TableCell>{getStatusBadge(agent.status)}</TableCell>
              <TableCell>{agent.callsHandled.toLocaleString()}</TableCell>
              <TableCell>{agent.successRate}%</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  {onView && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onView(agent)}
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  )}
                  {onEdit && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(agent)}
                      title="Edit Agent"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  )}
                  {onToggleStatus && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onToggleStatus(agent)}
                      title={agent.status === 'active' ? 'Pause Agent' : 'Activate Agent'}
                    >
                      {agent.status === 'active' ? 
                        <Pause className="h-4 w-4" /> : 
                        <Play className="h-4 w-4" />
                      }
                    </Button>
                  )}
                  {onDelete && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(agent)}
                      title="Delete Agent"
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      {agents.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No agents found</p>
        </div>
      )}
    </div>
  );
};

export default AgentsTable;