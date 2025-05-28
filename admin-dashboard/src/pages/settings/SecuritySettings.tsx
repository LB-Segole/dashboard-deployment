// components/settings/SecuritySettings.tsx
import React, { useState } from 'react';
import { Lock, Shield, Users, Save, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/components/ui/Use-toast';

interface SecuritySettings {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  twoFactorEnabled: boolean;
  sessionTimeout: number;
  showPassword: boolean;
}

const SecuritySettings: React.FC = () => {
  const [settings, setSettings] = useState<SecuritySettings>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorEnabled: true,
    sessionTimeout: 30,
    showPassword: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const { addToast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const toggleShowPassword = () => {
    setSettings(prev => ({ ...prev, showPassword: !prev.showPassword }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (settings.newPassword !== settings.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      addToast('Your security preferences have been saved successfully.', 'success');
    } catch (error) {
      addToast(error instanceof Error ? error.message : 'Failed to update security settings.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
        <Shield className="w-6 h-6 mr-2 text-blue-600" /> Security Settings
      </h2>
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <Lock className="w-5 h-5 mr-2" /> Password Settings
            </h3>
            
            <div className="space-y-4 pl-6">
              <div className="flex flex-col space-y-2">
                <label htmlFor="currentPassword" className="text-sm font-medium text-gray-700">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={settings.showPassword ? "text" : "password"}
                    id="currentPassword"
                    name="currentPassword"
                    value={settings.currentPassword}
                    onChange={handleChange}
                    className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-600 focus:border-blue-600 w-full pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={toggleShowPassword}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {settings.showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex flex-col space-y-2">
                <label htmlFor="newPassword" className="text-sm font-medium text-gray-700">
                  New Password
                </label>
                <input
                  type={settings.showPassword ? "text" : "password"}
                  id="newPassword"
                  name="newPassword"
                  value={settings.newPassword}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-600 focus:border-blue-600"
                  required
                />
              </div>

              <div className="flex flex-col space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                  Confirm New Password
                </label>
                <input
                  type={settings.showPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={settings.confirmPassword}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-600 focus:border-blue-600"
                  required
                />
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <Shield className="w-5 h-5 mr-2" /> Account Protection
            </h3>
            
            <div className="space-y-4 pl-6">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="twoFactorEnabled"
                  name="twoFactorEnabled"
                  checked={settings.twoFactorEnabled}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="twoFactorEnabled" className="ml-2 block text-sm text-gray-700">
                  Enable Two-Factor Authentication
                </label>
              </div>

              <div className="flex flex-col space-y-2">
                <label htmlFor="sessionTimeout" className="text-sm font-medium text-gray-700">
                  Session Timeout: {settings.sessionTimeout} minutes
                </label>
                <input
                  type="range"
                  id="sessionTimeout"
                  name="sessionTimeout"
                  min="5"
                  max="120"
                  step="5"
                  value={settings.sessionTimeout}
                  onChange={handleChange}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>5 min</span>
                  <span>30 min</span>
                  <span>60 min</span>
                  <span>120 min</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <Users className="w-5 h-5 mr-2" /> Active Sessions
            </h3>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="font-medium">Chrome on Windows</p>
                  <p className="text-sm text-gray-500">192.168.1.1 - Last active 2 hours ago</p>
                </div>
                <button className="text-sm text-red-600 hover:text-red-800">Revoke</button>
              </div>
              
              <div className="flex items-center justify-between py-2 border-t border-gray-200">
                <div>
                  <p className="font-medium">Safari on Mac</p>
                  <p className="text-sm text-gray-500">192.168.1.2 - Last active 1 day ago</p>
                </div>
                <button className="text-sm text-red-600 hover:text-red-800">Revoke</button>
              </div>
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
                  Save Security Settings
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SecuritySettings;