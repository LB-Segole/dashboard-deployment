// components/users/UserDetails.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Shield, Save, ArrowLeft, Lock, BadgeCheck, Ban } from 'lucide-react';
import { useToast } from '@/components/ui/Use-toast';
import { Button } from '@/components/ui/Button';

interface UserData {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'manager' | 'agent';
  status: 'active' | 'suspended';
  lastLogin: string;
  createdAt: string;
}

const UserDetails: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        setUser({
          id: userId || '1',
          name: 'John Doe',
          email: 'john.doe@voiceai.com',
          phone: '+1 (555) 123-4567',
          role: 'manager',
          status: 'active',
          lastLogin: '2023-11-15T14:30:00Z',
          createdAt: '2023-01-10T09:15:00Z'
        });
      } catch (error) {
        addToast('Failed to load user data', 'error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [userId, addToast]);

  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      addToast('User details have been saved successfully', 'success');
    } catch (error) {
      addToast('Failed to update user', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 text-center py-12">
        <p className="text-gray-600">User not found</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Users
          </button>
          <div className="flex space-x-3">
            <Button
              variant={user.status === 'active' ? 'destructive' : 'default'}
              size="sm"
              className="flex items-center"
            >
              {user.status === 'active' ? (
                <>
                  <Ban className="w-4 h-4 mr-2" />
                  Suspend
                </>
              ) : (
                <>
                  <BadgeCheck className="w-4 h-4 mr-2" />
                  Activate
                </>
              )}
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center"
            >
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mt-4">User Details</h2>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">{user.name}</h3>
                <p className="text-sm text-gray-500 capitalize">
                  {user.role} • <span className={user.status === 'active' ? 'text-green-600' : 'text-red-600'}>
                    {user.status}
                  </span>
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start">
                <Mail className="w-5 h-5 text-gray-400 mt-0.5 mr-3" />
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    value={user.email}
                    onChange={(e) => setUser({ ...user, email: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>

              <div className="flex items-start">
                <Phone className="w-5 h-5 text-gray-400 mt-0.5 mr-3" />
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <input
                    type="tel"
                    value={user.phone}
                    onChange={(e) => setUser({ ...user, phone: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                <Shield className="w-4 h-4 mr-2" /> Permissions
              </h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    id="call-management"
                    name="call-management"
                    type="checkbox"
                    checked={user.role === 'admin' || user.role === 'manager'}
                    onChange={() => {}}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="call-management" className="ml-2 block text-sm text-gray-700">
                    Call Management
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="user-management"
                    name="user-management"
                    type="checkbox"
                    checked={user.role === 'admin'}
                    onChange={() => {}}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="user-management" className="ml-2 block text-sm text-gray-700">
                    User Management
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="settings-access"
                    name="settings-access"
                    type="checkbox"
                    checked={user.role === 'admin'}
                    onChange={() => {}}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="settings-access" className="ml-2 block text-sm text-gray-700">
                    System Settings Access
                  </label>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Last Login</p>
                <p className="font-medium text-gray-900">
                  {new Date(user.lastLogin).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Account Created</p>
                <p className="font-medium text-gray-900">
                  {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Role</p>
                <select
                  value={user.role}
                  onChange={(e) => setUser({ ...user, role: e.target.value as any })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm capitalize"
                >
                  <option value="admin">Admin</option>
                  <option value="manager">Manager</option>
                  <option value="agent">Agent</option>
                </select>
              </div>
              <div className="flex items-end">
                <button className="text-sm text-blue-600 hover:text-blue-800 flex items-center">
                  <Lock className="w-4 h-4 mr-1" />
                  Reset Password
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;