import React from 'react';
import { 
  Home, 
  Users, 
  Phone, 
  Bot, 
  BarChart3, 
  Settings,
  Shield,
  HelpCircle
} from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
  children?: SidebarItem[];
}

const sidebarItems: SidebarItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: Home,
    path: '/admin'
  },
  {
    id: 'users',
    label: 'User Management',
    icon: Users,
    path: '/admin/users'
  },
  {
    id: 'calls',
    label: 'Call Management',
    icon: Phone,
    path: '/admin/calls'
  },
  {
    id: 'agents',
    label: 'AI Agents',
    icon: Bot,
    path: '/admin/agents'
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: BarChart3,
    path: '/admin/analytics'
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    path: '/admin/settings'
  }
];

interface AdminSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ 
  isOpen = true, 
  onClose 
}) => {
  const location = useLocation();

  const isActiveRoute = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="px-6 py-8 border-b border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Bot className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold">VoiceAI</h2>
                <p className="text-xs text-gray-400">Admin Panel</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = isActiveRoute(item.path);

              return (
                <Link
                  key={item.id}
                  to={item.path}
                  onClick={onClose}
                  className={`
                    flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200
                    ${isActive 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    }
                  `}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="px-4 py-6 border-t border-gray-700">
            <div className="flex items-center space-x-3 text-gray-400 text-sm">
              <HelpCircle className="h-4 w-4" />
              <span>Help & Support</span>
            </div>
            <div className="mt-4 text-xs text-gray-500">
              Version 1.0.0
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;