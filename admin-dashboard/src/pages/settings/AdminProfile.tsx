// components/settings/AdminProfile.tsx
import React, { useState } from 'react';
import { User, Mail, Lock, Save } from 'lucide-react';
import { useToast } from '@/components/ui/Use-toast';

interface AdminProfileData {
  name: string;
  email: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const AdminProfile: React.FC = () => {
  const [profileData, setProfileData] = useState<AdminProfileData>({
    name: 'Admin User',
    email: 'admin@voiceai.com',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { addToast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      addToast('Your profile information has been saved successfully.', 'success');
    } catch (error) {
      addToast('Failed to update profile. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Admin Profile</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div className="flex flex-col space-y-2">
            <label htmlFor="name" className="text-sm font-medium text-gray-700 flex items-center">
              <User className="w-4 h-4 mr-2" /> Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={profileData.name}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-600 focus:border-blue-600"
              required
            />
          </div>

          <div className="flex flex-col space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-gray-700 flex items-center">
              <Mail className="w-4 h-4 mr-2" /> Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={profileData.email}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-600 focus:border-blue-600"
              required
            />
          </div>

          <div className="pt-6 border-t border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Change Password</h3>
            
            <div className="space-y-4">
              <div className="flex flex-col space-y-2">
                <label htmlFor="currentPassword" className="text-sm font-medium text-gray-700 flex items-center">
                  <Lock className="w-4 h-4 mr-2" /> Current Password
                </label>
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  value={profileData.currentPassword}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-600 focus:border-blue-600"
                />
              </div>

              <div className="flex flex-col space-y-2">
                <label htmlFor="newPassword" className="text-sm font-medium text-gray-700 flex items-center">
                  <Lock className="w-4 h-4 mr-2" /> New Password
                </label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={profileData.newPassword}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-600 focus:border-blue-600"
                />
              </div>

              <div className="flex flex-col space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700 flex items-center">
                  <Lock className="w-4 h-4 mr-2" /> Confirm New Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={profileData.confirmPassword}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-600 focus:border-blue-600"
                />
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
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AdminProfile;