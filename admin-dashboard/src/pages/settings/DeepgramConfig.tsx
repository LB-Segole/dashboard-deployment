// components/settings/DeepgramConfig.tsx
import React, { useState } from 'react';
import { Key, Mic, Save, TestTube2 } from 'lucide-react';
import { useToast } from '@/components/ui/Use-toast';

interface DeepgramConfig {
  apiKey: string;
  model: string;
  language: string;
  enableTranscription: boolean;
  enableSentimentAnalysis: boolean;
}

const DeepgramConfig: React.FC = () => {
  const [config, setConfig] = useState<DeepgramConfig>({
    apiKey: 'dg_****************',
    model: 'nova-2',
    language: 'en-US',
    enableTranscription: true,
    enableSentimentAnalysis: true
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
      addToast('Deepgram settings updated successfully.', 'success');
    } catch (error) {
      addToast('Failed to save Deepgram configuration.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const testConnection = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      addToast('Successfully connected to Deepgram API.', 'success');
    } catch (error) {
      addToast('Could not connect to Deepgram API. Check your API key.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
        <Mic className="w-6 h-6 mr-2 text-blue-600" /> Deepgram Configuration
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
                <option value="nova-2">Nova-2 (Latest)</option>
                <option value="nova">Nova</option>
                <option value="enhanced">Enhanced</option>
                <option value="base">Base</option>
              </select>
            </div>

            <div className="flex flex-col space-y-2">
              <label htmlFor="language" className="text-sm font-medium text-gray-700">
                Language
              </label>
              <select
                id="language"
                name="language"
                value={config.language}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-600 focus:border-blue-600"
              >
                <option value="en-US">English (US)</option>
                <option value="en-GB">English (UK)</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
                <option value="ja">Japanese</option>
              </select>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="enableTranscription"
                name="enableTranscription"
                checked={config.enableTranscription}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="enableTranscription" className="ml-2 block text-sm text-gray-700">
                Enable Real-time Transcription
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="enableSentimentAnalysis"
                name="enableSentimentAnalysis"
                checked={config.enableSentimentAnalysis}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="enableSentimentAnalysis" className="ml-2 block text-sm text-gray-700">
                Enable Sentiment Analysis
              </label>
            </div>
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

export default DeepgramConfig;