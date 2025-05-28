import React from 'react';
import { Button } from '../ui/Button';
import { Bell, Settings, User, LogOut, Menu } from 'lucide-react';
import { useAdminAuth } from '../../hooks/useAdminAuth';

interface AdminHeaderProps {
  onMenuToggle?: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ onMenuToggle }) => {
  const { user, logout } = useAdminAuth();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuToggle}
            className="lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-sm text-gray-600">AI Voice Calling Agent</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              3
            </span>
          </Button>

          <Button variant="ghost" size="sm">
            <Settings className="h-5 w-5" />
          </Button>

          <div className="flex items-center space-x-2 pl-4 border-l border-gray-200">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-gray-900">
                  {user?.name || 'Admin User'}
                </p>
                <p className="text-xs text-gray-600">{user?.email}</p>
              </div>
            </div>

            <Button variant="ghost" size="sm" onClick={logout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;