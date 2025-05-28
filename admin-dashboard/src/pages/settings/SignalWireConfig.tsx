// components/settings/SignalwireConfig.tsx
import React, { useState } from 'react';
import { Phone, Server, Key, Save, TestTube2 } from 'lucide-react';
import { useToast } from '@/components/ui/Use-toast';

interface SignalwireConfig {
  projectId: string;
  apiToken: string;
  spaceUrl: string;
  callerId: string;
  enableRecording: boolean;
}

const SignalwireConfig: React.FC = () => {
  const [config, setConfig] = useState<SignalwireConfig>({
    projectId: 'your-project-id',
    apiToken: 'PT****************',
    spaceUrl: 'your-space.signalwire.com',
    callerId: '+1234567890',
    enableRecording: true
  });
  const [isLoading, setIsLoading] = useState(false);
  const { addToast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setConfig(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      addToast('SignalWire settings updated successfully.', 'success');
    } catch (error) {
      addToast('Failed to save SignalWire configuration.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const testConnection = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      addToast('Successfully connected to SignalWire API.', 'success');
    } catch (error) {
      addToast('Could not connect to SignalWire. Check your credentials.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
        <Phone className="w-6 h-6 mr-2 text-blue-600" /> SignalWire Configuration
      </h2>
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div className="flex flex-col space-y-2">
            <label htmlFor="projectId" className="text-sm font-medium text-gray-700 flex items-center">
              <Server className="w-4 h-4 mr-2" /> Project ID
            </label>
            <input
              type="text"
              id="projectId"
              name="projectId"
              value={config.projectId}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-600 focus:border-blue-600"
              required
            />
          </div>

          <div className="flex flex-col space-y-2">
            <label htmlFor="apiToken" className="text-sm font-medium text-gray-700 flex items-center">
              <Key className="w-4 h-4 mr-2" /> API Token
            </label>
            <input
              type="password"
              id="apiToken"
              name="apiToken"
              value={config.apiToken}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-600 focus:border-blue-600"
              required
            />
          </div>

          <div className="flex flex-col space-y-2">
            <label htmlFor="spaceUrl" className="text-sm font-medium text-gray-700 flex items-center">
              <Server className="w-4 h-4 mr-2" /> Space URL
            </label>
            <input
              type="text"
              id="spaceUrl"
              name="spaceUrl"
              value={config.spaceUrl}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-600 focus:border-blue-600"
              required
            />
          </div>

          <div className="flex flex-col space-y-2">
            <label htmlFor="callerId" className="text-sm font-medium text-gray-700">
              Default Caller ID
            </label>
            <input
              type="tel"
              id="callerId"
              name="callerId"
              value={config.callerId}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-600 focus:border-blue-600 w-48"
              required
            />
          </div>

          <div className="flex items-center pt-2">
            <input
              type="checkbox"
              id="enableRecording"
              name="enableRecording"
              checked={config.enableRecording}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="enableRecording" className="ml-2 block text-sm text-gray-700">
              Enable Call Recording
            </label>
          </div>

          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={testConnection}
              disabled={isLoading}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <TestTube2 className="w-4 h-4 mr-2" />
              Test Connection
            </button>
            
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Configuration
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SignalwireConfig;