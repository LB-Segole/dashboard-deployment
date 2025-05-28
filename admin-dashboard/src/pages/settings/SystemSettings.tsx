// components/settings/SystemSettings.tsx
import React, { useState } from 'react';
import { Settings, HardDrive, Cpu, Clock, Save } from 'lucide-react';
import { useToast } from '@/components/ui/Use-toast';

interface SystemSettings {
  maintenanceMode: boolean;
  logRetentionDays: number;
  maxConcurrentCalls: number;
  systemTimezone: string;
  enableAutoUpdates: boolean;
}

const SystemSettings: React.FC = () => {
  const [settings, setSettings] = useState<SystemSettings>({
    maintenanceMode: false,
    logRetentionDays: 30,
    maxConcurrentCalls: 100,
    systemTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    enableAutoUpdates: true
  });
  const [isLoading, setIsLoading] = useState(false);
  const { addToast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      addToast('Your system configuration has been saved successfully.', 'success');
    } catch (error) {
      addToast('Failed to update system settings. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
        <Settings className="w-6 h-6 mr-2 text-blue-600" /> System Settings
      </h2>
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <HardDrive className="w-5 h-5 mr-2" /> System Configuration
            </h3>
            
            <div className="space-y-4 pl-6">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="maintenanceMode"
                  name="maintenanceMode"
                  checked={settings.maintenanceMode}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="maintenanceMode" className="ml-2 block text-sm text-gray-700">
                  Enable Maintenance Mode
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="enableAutoUpdates"
                  name="enableAutoUpdates"
                  checked={settings.enableAutoUpdates}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="enableAutoUpdates" className="ml-2 block text-sm text-gray-700">
                  Enable Automatic Updates
                </label>
              </div>

              <div className="flex flex-col space-y-2">
                <label htmlFor="logRetentionDays" className="text-sm font-medium text-gray-700">
                  Log Retention Period: {settings.logRetentionDays} days
                </label>
                <input
                  type="range"
                  id="logRetentionDays"
                  name="logRetentionDays"
                  min="1"
                  max="365"
                  value={settings.logRetentionDays}
                  onChange={handleChange}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <Cpu className="w-5 h-5 mr-2" /> Performance
            </h3>
            
            <div className="space-y-4 pl-6">
              <div className="flex flex-col space-y-2">
                <label htmlFor="maxConcurrentCalls" className="text-sm font-medium text-gray-700">
                  Maximum Concurrent Calls: {settings.maxConcurrentCalls}
                </label>
                <input
                  type="range"
                  id="maxConcurrentCalls"
                  name="maxConcurrentCalls"
                  min="1"
                  max="500"
                  step="1"
                  value={settings.maxConcurrentCalls}
                  onChange={handleChange}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>1</span>
                  <span>100</span>
                  <span>250</span>
                  <span>500</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <Clock className="w-5 h-5 mr-2" /> Timezone
            </h3>
            
            <div className="pl-6">
              <select
                id="systemTimezone"
                name="systemTimezone"
                value={settings.systemTimezone}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-600 focus:border-blue-600"
              >
                {["UTC", "America/New_York", "Europe/London", "Asia/Tokyo", "Asia/Kolkata", "Australia/Sydney"].map(tz => (
                  <option key={tz} value={tz}>{tz}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Saving...' : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save System Settings
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SystemSettings;