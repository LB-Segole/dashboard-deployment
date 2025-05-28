// components/settings/APISettings.tsx
import React, { useState } from 'react';
import { Key, Server, Save, TestTube2 } from 'lucide-react';
import { useToast } from '@/components/ui/Use-toast';

interface ApiSettings {
  apiBaseUrl: string;
  apiKey: string;
  webhookUrl: string;
  rateLimit: number;
}

const APISettings: React.FC = () => {
  const [apiSettings, setApiSettings] = useState<ApiSettings>({
    apiBaseUrl: 'https://api.voiceai.com/v1',
    apiKey: 'sk_****************',
    webhookUrl: 'https://yourdomain.com/webhook',
    rateLimit: 100
  });
  const [isLoading, setIsLoading] = useState(false);
  const { addToast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setApiSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      addToast('Your API configuration has been saved successfully.', 'success');
    } catch (error) {
      addToast('Failed to update API settings. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const testApiConnection = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      addToast('API connection test completed successfully.', 'success');
    } catch (error) {
      addToast('Unable to connect to the API with current settings.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">API Settings</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div className="flex flex-col space-y-2">
            <label htmlFor="apiBaseUrl" className="text-sm font-medium text-gray-700 flex items-center">
              <Server className="w-4 h-4 mr-2" /> API Base URL
            </label>
            <input
              type="url"
              id="apiBaseUrl"
              name="apiBaseUrl"
              value={apiSettings.apiBaseUrl}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-600 focus:border-blue-600"
              required
            />
          </div>

          <div className="flex flex-col space-y-2">
            <label htmlFor="apiKey" className="text-sm font-medium text-gray-700 flex items-center">
              <Key className="w-4 h-4 mr-2" /> API Key
            </label>
            <input
              type="password"
              id="apiKey"
              name="apiKey"
              value={apiSettings.apiKey}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-600 focus:border-blue-600"
              required
            />
          </div>

          <div className="flex flex-col space-y-2">
            <label htmlFor="webhookUrl" className="text-sm font-medium text-gray-700 flex items-center">
              <Server className="w-4 h-4 mr-2" /> Webhook URL
            </label>
            <input
              type="url"
              id="webhookUrl"
              name="webhookUrl"
              value={apiSettings.webhookUrl}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-600 focus:border-blue-600"
            />
          </div>

          <div className="flex flex-col space-y-2">
            <label htmlFor="rateLimit" className="text-sm font-medium text-gray-700">
              Rate Limit (requests/minute)
            </label>
            <input
              type="number"
              id="rateLimit"
              name="rateLimit"
              min="1"
              max="1000"
              value={apiSettings.rateLimit}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-600 focus:border-blue-600 w-32"
            />
          </div>

          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={testApiConnection}
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
              Save Settings
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default APISettings;