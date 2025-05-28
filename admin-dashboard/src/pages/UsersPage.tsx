import React from 'react';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import UserManagement from '@/components/users/UserManagement';

const UsersPage: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">User Management</h1>
        <Button asChild>
          <Link to="/users/new" className="flex items-center">
            <Plus className="w-4 h-4 mr-2" />
            Add User
          </Link>
        </Button>
      </div>
      <UserManagement />
    </div>
  );
};

export default UsersPage;
