// components/settings/OpenAIConfig.tsx
import React, { useState } from 'react';
import { Key, BrainCircuit, Save, TestTube2 } from 'lucide-react';
import { useToast } from '@/components/ui/Use-toast';

interface OpenAIConfig {
  apiKey: string;
  model: string;
  temperature: number;
  maxTokens: number;
  enableMemory: boolean;
}

const OpenAIConfig: React.FC = () => {
  const [config, setConfig] = useState<OpenAIConfig>({
    apiKey: 'sk_****************',
    model: 'gpt-4-turbo',
    temperature: 0.7,
    maxTokens: 1000,
    enableMemory: true
  });
  const [isLoading, setIsLoading] = useState(false);
  const { addToast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
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
      addToast('OpenAI settings updated successfully.', 'success');
    } catch (error) {
      addToast('Failed to save OpenAI configuration.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const testConnection = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      addToast('Successfully connected to OpenAI API.', 'success');
    } catch (error) {
      addToast('Could not connect to OpenAI API. Check your API key.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
        <BrainCircuit className="w-6 h-6 mr-2 text-blue-600" /> OpenAI Configuration
      </h2>
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div className="flex flex-col space-y-2">
            <label htmlFor="apiKey" className="text-sm font-medium text-gray-700 flex items-center">
              <Key className="w-4 h-4 mr-2" /> API Key
            </label>
            <input
              type="password"
              id="apiKey"
              name="apiKey"
              value={config.apiKey}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-600 focus:border-blue-600"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col space-y-2">
              <label htmlFor="model" className="text-sm font-medium text-gray-700">
                Model
              </label>
              <select
                id="model"
                name="model"
                value={config.model}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-600 focus:border-blue-600"
              >
                <option value="gpt-4-turbo">GPT-4 Turbo</option>
                <option value="gpt-4">GPT-4</option>
                <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
              </select>
            </div>

            <div className="flex flex-col space-y-2">
              <label htmlFor="temperature" className="text-sm font-medium text-gray-700">
                Temperature: {config.temperature}
              </label>
              <input
                type="range"
                id="temperature"
                name="temperature"
                min="0"
                max="1"
                step="0.1"
                value={config.temperature}
                onChange={handleChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Precise</span>
                <span>Balanced</span>
                <span>Creative</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col space-y-2">
            <label htmlFor="maxTokens" className="text-sm font-medium text-gray-700">
              Max Tokens
            </label>
            <input
              type="number"
              id="maxTokens"
              name="maxTokens"
              min="100"
              max="4000"
              step="100"
              value={config.maxTokens}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-600 focus:border-blue-600 w-32"
            />
          </div>

          <div className="flex items-center pt-2">
            <input
              type="checkbox"
              id="enableMemory"
              name="enableMemory"
              checked={config.enableMemory}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="enableMemory" className="ml-2 block text-sm text-gray-700">
              Enable Conversation Memory
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

export default OpenAIConfig;