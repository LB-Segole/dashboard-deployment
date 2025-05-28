import React, { useState } from 'react';
import { Plus, Phone, Users, Settings, Download, Upload, RefreshCw, AlertTriangle } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Modal } from '../ui/Modal';
import { Badge } from '../ui/Badge';

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'purple' | 'orange' | 'red';
  action: () => void;
  badge?: string;
  disabled?: boolean;
}

interface QuickActionsProps {
  onActionClick?: (actionId: string) => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  onActionClick
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState<QuickAction | null>(null);

  const handleCreateAgent = () => {
    setSelectedAction({
      id: 'create-agent',
      title: 'Create New Agent',
      description: 'Set up a new AI voice agent with custom configuration',
      icon: <Plus className="h-5 w-5" />,
      color: 'blue',
      action: () => {}
    });
    setIsModalOpen(true);
  };

  const handleStartCall = () => {
    setSelectedAction({
      id: 'start-call',
      title: 'Start Test Call',
      description: 'Initiate a test call to verify agent functionality',
      icon: <Phone className="h-5 w-5" />,
      color: 'green',
      action: () => {}
    });
    setIsModalOpen(true);
  };

  const quickActions: QuickAction[] = [
    {
      id: 'create-agent',
      title: 'Create New Agent',
      description: 'Set up a new AI voice agent',
      icon: <Plus className="h-5 w-5" />,
      color: 'blue',
      action: handleCreateAgent
    },
    {
      id: 'start-call',
      title: 'Start Test Call',
      description: 'Test agent with a quick call',
      icon: <Phone className="h-5 w-5" />,
      color: 'green',
      action: handleStartCall
    },
    {
      id: 'manage-users',
      title: 'Manage Users',
      description: 'Add or edit user accounts',
      icon: <Users className="h-5 w-5" />,
      color: 'purple',
      action: () => onActionClick?.('manage-users'),
      badge: '12 pending'
    },
    {
      id: 'system-settings',
      title: 'System Settings',
      description: 'Configure global settings',
      icon: <Settings className="h-5 w-5" />,
      color: 'orange',
      action: () => onActionClick?.('system-settings')
    },
    {
      id: 'export-data',
      title: 'Export Data',
      description: 'Download call logs and reports',
      icon: <Download className="h-5 w-5" />,
      color: 'blue',
      action: () => onActionClick?.('export-data')
    },
    {
      id: 'import-contacts',
      title: 'Import Contacts',
      description: 'Upload contact lists for campaigns',
      icon: <Upload className="h-5 w-5" />,
      color: 'green',
      action: () => onActionClick?.('import-contacts')
    },
    {
      id: 'sync-integrations',
      title: 'Sync Integrations',
      description: 'Refresh CRM and API connections',
      icon: <RefreshCw className="h-5 w-5" />,
      color: 'purple',
      action: () => onActionClick?.('sync-integrations')
    },
    {
      id: 'review-alerts',
      title: 'Review Alerts',
      description: 'Check system alerts and warnings',
      icon: <AlertTriangle className="h-5 w-5" />,
      color: 'red',
      action: () => onActionClick?.('review-alerts'),
      badge: '3 critical'
    }
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue':
        return {
          bg: 'bg-blue-100 hover:bg-blue-200',
          text: 'text-blue-600',
          border: 'border-blue-200 hover:border-blue-300'
        };
      case 'green':
        return {
          bg: 'bg-green-100 hover:bg-green-200',
          text: 'text-green-600',
          border: 'border-green-200 hover:border-green-300'
        };
      case 'purple':
        return {
          bg: 'bg-purple-100 hover:bg-purple-200',
          text: 'text-purple-600',
          border: 'border-purple-200 hover:border-purple-300'
        };
      case 'orange':
        return {
          bg: 'bg-orange-100 hover:bg-orange-200',
          text: 'text-orange-600',
          border: 'border-orange-200 hover:border-orange-300'
        };
      case 'red':
        return {
          bg: 'bg-red-100 hover:bg-red-200',
          text: 'text-red-600',
          border: 'border-red-200 hover:border-red-300'
        };
      default:
        return {
          bg: 'bg-gray-100 hover:bg-gray-200',
          text: 'text-gray-600',
          border: 'border-gray-200 hover:border-gray-300'
        };
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
        <Button variant="outline" size="sm">
          Customize
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickActions.map((action) => {
          const colors = getColorClasses(action.color);
          
          return (
            <Card
              key={action.id}
              className={`p-4 cursor-pointer transition-all duration-200 border-2 ${colors.border} hover:shadow-md ${
                action.disabled ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              onClick={() => !action.disabled && action.action()}
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`p-2 rounded-lg ${colors.bg}`}>
                  <div className={colors.text}>
                    {action.icon}
                  </div>
                </div>
                {action.badge && (
                  <Badge variant="secondary" className="text-xs">
                    {action.badge}
                  </Badge>
                )}
              </div>
              
              <h3 className="font-semibold text-gray-900 mb-1">{action.title}</h3>
              <p className="text-sm text-gray-600">{action.description}</p>
            </Card>
          );
        })}
      </div>

      {/* Recent Actions */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Actions</h3>
        <div className="space-y-3">
          {[
            {
              action: 'Created new agent "Customer Support Bot"',
              user: 'Admin',
              time: '2 minutes ago',
              status: 'success'
            },
            {
              action: 'Exported call data for October 2024',
              user: 'John Doe',
              time: '15 minutes ago',
              status: 'success'
            },
            {
              action: 'Updated system settings',
              user: 'Admin',
              time: '1 hour ago',
              status: 'success'
            },
            {
              action: 'Failed to sync CRM integration',
              user: 'System',
              time: '2 hours ago',
              status: 'error'
            }
          ].map((item, index) => (
            <div key={index} className="flex items-center space-x-3 py-2">
              <div className={`w-2 h-2 rounded-full ${
                item.status === 'success' ? 'bg-green-500' : 'bg-red-500'
              }`} />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{item.action}</p>
                <p className="text-xs text-gray-500">by {item.user} • {item.time}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Action Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedAction?.title || ''}
      >
        <div className="space-y-4">
          <p className="text-gray-600">{selectedAction?.description}</p>
          
          {selectedAction?.id === 'create-agent' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Agent Name
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter agent name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Agent Type
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Sales Agent</option>
                  <option>Customer Support</option>
                  <option>Lead Qualification</option>
                  <option>Appointment Booking</option>
                </select>
              </div>
            </div>
          )}

          {selectedAction?.id === 'start-call' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Test Phone Number
                </label>
                <input
                  type="tel"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Agent
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Sales Pro v2.1</option>
                  <option>Support Helper v1.3</option>
                  <option>Lead Qualifier v1.0</option>
                </select>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsModalOpen(false)}>
              {selectedAction?.id === 'create-agent' ? 'Create Agent' : 
               selectedAction?.id === 'start-call' ? 'Start Call' : 'Execute'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};