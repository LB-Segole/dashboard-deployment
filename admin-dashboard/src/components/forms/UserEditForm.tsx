import React, { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Card } from '../ui/Card';
import { Alert } from '../ui/Alert';
import { useUserManagement } from '../../hooks/useUserManagement';

interface UserEditFormProps {
  userId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const UserEditForm: React.FC<UserEditFormProps> = ({
  userId,
  onSuccess,
  onCancel
}) => {
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    role: 'user',
    status: 'active',
    creditLimit: 1000,
    subscriptionPlan: 'basic'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { getUser, updateUser, createUser } = useUserManagement();

  useEffect(() => {
    if (userId) {
      loadUser();
    }
  }, [userId]);

  const loadUser = async () => {
    try {
      const user = await getUser(userId!);
      setFormData(user);
    } catch (err) {
      setError('Failed to load user data');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (userId) {
        await updateUser(userId, formData);
      } else {
        await createUser(formData);
      }
      onSuccess?.();
    } catch (err) {
      setError('Failed to save user');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-6">
        {userId ? 'Edit User' : 'Create New User'}
      </h2>

      {error && (
        <Alert variant="destructive" className="mb-6">
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <Input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
            <Input
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
            <Input
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <Select
              value={formData.role}
              onValueChange={(value) => handleInputChange('role', value)}
              options={[
                { value: 'user', label: 'User' },
                { value: 'admin', label: 'Admin' },
                { value: 'moderator', label: 'Moderator' }
              ]}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <Select
              value={formData.status}
              onValueChange={(value) => handleInputChange('status', value)}
              options={[
                { value: 'active', label: 'Active' },
                { value: 'inactive', label: 'Inactive' },
                { value: 'suspended', label: 'Suspended' },
                { value: 'banned', label: 'Banned' }
              ]}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Credit Limit</label>
            <Input
              type="number"
              min="0"
              value={formData.creditLimit}
              onChange={(e) => handleInputChange('creditLimit', parseInt(e.target.value))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subscription Plan</label>
            <Select
              value={formData.subscriptionPlan}
              onValueChange={(value) => handleInputChange('subscriptionPlan', value)}
              options={[
                { value: 'basic', label: 'Basic' },
                { value: 'pro', label: 'Pro' },
                { value: 'enterprise', label: 'Enterprise' }
              ]}
            />
          </div>
        </div>

        <div className="flex justify-end space-x-4 pt-6">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : (userId ? 'Update User' : 'Create User')}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default UserEditForm;