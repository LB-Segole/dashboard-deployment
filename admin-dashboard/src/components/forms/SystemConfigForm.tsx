import React, { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Card } from '../ui/Card';
import { Alert } from '../ui/Alert';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/Tabs';
import { useSystemConfig } from '../../hooks/useSystemConfig';

export const SystemConfigForm: React.FC = () => {
  const [config, setConfig] = useState({
    general: {
      siteName: 'AI Voice Agent',
      maxConcurrentCalls: 100,
      callTimeout: 30000,
      recordingEnabled: true,
      analyticsEnabled: true
    },
    api: {
      rateLimit: 1000,
      maxRequestSize: '10mb',
      timeout: 30000,
      retryAttempts: 3
    },
    security: {
      sessionTimeout: 3600,
      maxLoginAttempts: 5,
      passwordMinLength: 8,
      requireTwoFactor: false
    },
    notifications: {
      emailEnabled: true,
      smsEnabled: false,
      webhookEnabled: true,
      adminAlerts: true
    }
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('general');

  const { config: loadedConfig, loading: configLoading, error: configError, isSaving, fetchConfig, saveConfig } = useSystemConfig();

  useEffect(() => {
    if (loadedConfig) setConfig(loadedConfig);
  }, [loadedConfig]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await saveConfig(config);
      setSuccess('Configuration updated successfully');
    } catch (err) {
      setError('Failed to update configuration');
    } finally {
      setLoading(false);
    }
  };

  const updateConfigSection = (section: string, field: string, value: any) => {
    setConfig(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: value
      }
    }));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">System Configuration</h1>

      {error && (
        <Alert variant="destructive" className="mb-6">
          {error}
        </Alert>
      )}

      {success && (
        <Alert variant="default" className="mb-6 border-green-200 bg-green-50 text-green-800">
          {success}
        </Alert>
      )}

      <Card className="p-6">
        <Tabs defaultValue={activeTab} className="w-full">
          <TabsList>
            <TabsTrigger value="general" onClick={() => setActiveTab('general')}>General</TabsTrigger>
            <TabsTrigger value="api" onClick={() => setActiveTab('api')}>API Settings</TabsTrigger>
            <TabsTrigger value="security" onClick={() => setActiveTab('security')}>Security</TabsTrigger>
            <TabsTrigger value="notifications" onClick={() => setActiveTab('notifications')}>Notifications</TabsTrigger>
          </TabsList>
          <TabsContent value="general">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">General Settings</h3>
                <label className="block text-sm font-medium text-gray-700 mb-1">Site Name</label>
                <Input
                  value={config.general.siteName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateConfigSection('general', 'siteName', e.target.value)}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Max Concurrent Calls</label>
                    <Input
                      type="number"
                      value={config.general.maxConcurrentCalls}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateConfigSection('general', 'maxConcurrentCalls', parseInt(e.target.value))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Call Timeout (ms)</label>
                    <Input
                      type="number"
                      value={config.general.callTimeout}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateConfigSection('general', 'callTimeout', parseInt(e.target.value))}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="recordingEnabled"
                      checked={config.general.recordingEnabled}
                      onChange={(e) => updateConfigSection('general', 'recordingEnabled', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="recordingEnabled" className="text-sm font-medium text-gray-700">
                      Enable Call Recording
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="analyticsEnabled"
                      checked={config.general.analyticsEnabled}
                      onChange={(e) => updateConfigSection('general', 'analyticsEnabled', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="analyticsEnabled" className="text-sm font-medium text-gray-700">
                      Enable Analytics
                    </label>
                  </div>
                </div>
              </div>
              <div className="flex justify-end pt-6 border-t">
                <Button type="submit" disabled={loading}>
                  {loading ? 'Saving...' : 'Save Configuration'}
                </Button>
              </div>
            </form>
          </TabsContent>
          <TabsContent value="api">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">API Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Rate Limit (requests/hour)</label>
                    <Input
                      type="number"
                      value={config.api.rateLimit}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateConfigSection('api', 'rateLimit', parseInt(e.target.value))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Max Request Size</label>
                    <Select
                      value={config.api.maxRequestSize}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateConfigSection('api', 'maxRequestSize', e.target.value)}
                      options={[
                        { value: '1mb', label: '1 MB' },
                        { value: '5mb', label: '5 MB' },
                        { value: '10mb', label: '10 MB' },
                        { value: '50mb', label: '50 MB' }
                      ]}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">API Timeout (ms)</label>
                    <Input
                      type="number"
                      value={config.api.timeout}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateConfigSection('api', 'timeout', parseInt(e.target.value))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Retry Attempts</label>
                    <Input
                      type="number"
                      min={0}
                      max={10}
                      value={config.api.retryAttempts}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateConfigSection('api', 'retryAttempts', parseInt(e.target.value))}
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end pt-6 border-t">
                <Button type="submit" disabled={loading}>
                  {loading ? 'Saving...' : 'Save Configuration'}
                </Button>
              </div>
            </form>
          </TabsContent>
          <TabsContent value="security">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Security Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Session Timeout (seconds)</label>
                    <Input
                      type="number"
                      value={config.security.sessionTimeout}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateConfigSection('security', 'sessionTimeout', parseInt(e.target.value))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Max Login Attempts</label>
                    <Input
                      type="number"
                      min={1}
                      max={10}
                      value={config.security.maxLoginAttempts}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateConfigSection('security', 'maxLoginAttempts', parseInt(e.target.value))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password Min Length</label>
                    <Input
                      type="number"
                      min={6}
                      max={20}
                      value={config.security.passwordMinLength}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateConfigSection('security', 'passwordMinLength', parseInt(e.target.value))}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="requireTwoFactor"
                      checked={config.security.requireTwoFactor}
                      onChange={(e) => updateConfigSection('security', 'requireTwoFactor', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="requireTwoFactor" className="text-sm font-medium text-gray-700">
                      Require Two-Factor Authentication
                    </label>
                  </div>
                </div>
              </div>
              <div className="flex justify-end pt-6 border-t">
                <Button type="submit" disabled={loading}>
                  {loading ? 'Saving...' : 'Save Configuration'}
                </Button>
              </div>
            </form>
          </TabsContent>
          <TabsContent value="notifications">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Notification Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="emailEnabled"
                      checked={config.notifications.emailEnabled}
                      onChange={(e) => updateConfigSection('notifications', 'emailEnabled', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="emailEnabled" className="text-sm font-medium text-gray-700">
                      Enable Email Notifications
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="smsEnabled"
                      checked={config.notifications.smsEnabled}
                      onChange={(e) => updateConfigSection('notifications', 'smsEnabled', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="smsEnabled" className="text-sm font-medium text-gray-700">
                      Enable SMS Notifications
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="webhookEnabled"
                      checked={config.notifications.webhookEnabled}
                      onChange={(e) => updateConfigSection('notifications', 'webhookEnabled', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="webhookEnabled" className="text-sm font-medium text-gray-700">
                      Enable Webhook Notifications
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="adminAlerts"
                      checked={config.notifications.adminAlerts}
                      onChange={(e) => updateConfigSection('notifications', 'adminAlerts', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="adminAlerts" className="text-sm font-medium text-gray-700">
                      Enable Admin Alerts
                    </label>
                  </div>
                </div>
              </div>
              <div className="flex justify-end pt-6 border-t">
                <Button type="submit" disabled={loading}>
                  {loading ? 'Saving...' : 'Save Configuration'}
                </Button>
              </div>
            </form>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default SystemConfigForm;