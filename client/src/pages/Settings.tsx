import { Settings, User, Mail, Lock, Bell, CreditCard, LogOut } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const SettingsItem = ({ icon, title, description, onClick }: { 
  icon: React.ReactNode; 
  title: string; 
  description: string; 
  onClick?: () => void;
}) => {
  return (
    <button 
      onClick={onClick}
      className="flex items-start space-x-4 p-4 hover:bg-gray-50 rounded-lg transition-colors w-full text-left"
    >
      <div className="p-2 rounded-lg bg-blue-50 text-blue-600 mt-1">
        {icon}
      </div>
      <div className="flex-1">
        <h3 className="font-medium text-gray-900">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
      <ChevronRight className="h-5 w-5 text-gray-400" />
    </button>
  );
};

export const Settings = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/3">
          <Card className="p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Settings className="h-6 w-6 text-blue-600" />
              <h2 className="text-xl font-bold text-gray-900">Settings</h2>
            </div>
            <nav className="space-y-1">
              <button className="w-full text-left px-4 py-2 rounded-md bg-blue-50 text-blue-700 font-medium">
                Account
              </button>
              <button className="w-full text-left px-4 py-2 rounded-md text-gray-700 hover:bg-gray-50">
                Notifications
              </button>
              <button className="w-full text-left px-4 py-2 rounded-md text-gray-700 hover:bg-gray-50">
                Billing
              </button>
              <button className="w-full text-left px-4 py-2 rounded-md text-gray-700 hover:bg-gray-50">
                Security
              </button>
            </nav>
          </Card>
        </div>

        <div className="md:w-2/3">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Account Settings</h3>
            
            <div className="divide-y divide-gray-200">
              <SettingsItem
                icon={<User className="h-5 w-5" />}
                title="Profile Information"
                description="Update your name, email, and other personal details"
                onClick={() => navigate('/profile')}
              />
              <SettingsItem
                icon={<Mail className="h-5 w-5" />}
                title="Email Preferences"
                description="Manage how we communicate with you"
              />
              <SettingsItem
                icon={<Bell className="h-5 w-5" />}
                title="Notifications"
                description="Configure how you receive notifications"
              />
              <SettingsItem
                icon={<Lock className="h-5 w-5" />}
                title="Security"
                description="Change password and security settings"
              />
              <SettingsItem
                icon={<CreditCard className="h-5 w-5" />}
                title="Billing & Plans"
                description="Update payment methods and view invoices"
              />
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <Button
                onClick={logout}
                variant="outline"
                className="text-red-600 border-red-300 hover:bg-red-50 flex items-center"
              >
                <LogOut className="mr-2 h-5 w-5" />
                Sign Out
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};