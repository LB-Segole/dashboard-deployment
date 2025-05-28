import { useState } from 'react';
import { Phone, Home, Settings, Users, Activity, HelpCircle, LogOut } from 'lucide-react';
import { Button } from './Button';
import { useNavigate } from 'react-router-dom';

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

const SidebarItem = ({ icon, label, active, onClick }: SidebarItemProps) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${
        active
          ? 'bg-blue-50 text-blue-600'
          : 'text-gray-600 hover:bg-gray-50'
      }`}
    >
      <span className="mr-3">{icon}</span>
      <span className="font-medium">{label}</span>
    </button>
  );
};

export const Sidebar = () => {
  const [activeItem, setActiveItem] = useState('dashboard');
  const navigate = useNavigate();

  const items = [
    { id: 'dashboard', icon: <Home className="h-5 w-5" />, label: 'Dashboard' },
    { id: 'calls', icon: <Phone className="h-5 w-5" />, label: 'Call History' },
    { id: 'contacts', icon: <Users className="h-5 w-5" />, label: 'Contacts' },
    { id: 'analytics', icon: <Activity className="h-5 w-5" />, label: 'Analytics' },
    { id: 'settings', icon: <Settings className="h-5 w-5" />, label: 'Settings' },
    { id: 'support', icon: <HelpCircle className="h-5 w-5" />, label: 'Support' },
  ];

  return (
    <div className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64 border-r border-gray-200 bg-white">
        <div className="flex items-center h-16 px-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <Phone className="h-6 w-6 text-blue-600" />
            <span className="text-xl font-bold text-slate-900">VoiceAI</span>
          </div>
        </div>
        <div className="flex flex-col flex-grow p-4 overflow-y-auto">
          <nav className="flex-1 space-y-2">
            {items.map((item) => (
              <SidebarItem
                key={item.id}
                icon={item.icon}
                label={item.label}
                active={activeItem === item.id}
                onClick={() => setActiveItem(item.id)}
              />
            ))}
          </nav>
          <div className="mt-auto pt-4">
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-600 hover:text-red-600"
              onClick={() => navigate('/login')}
            >
              <LogOut className="h-5 w-5 mr-3" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};