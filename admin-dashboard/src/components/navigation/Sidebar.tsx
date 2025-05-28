import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Icons } from '@/components/ui/Icons';

interface SidebarProps {
  className?: string;
}

interface NavItem {
  title: string;
  href: string;
  icon: keyof typeof Icons;
}

const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: 'refreshCw',
  },
  {
    title: 'Users',
    href: '/users',
    icon: 'shield',
  },
  {
    title: 'Agents',
    href: '/agents',
    icon: 'info',
  },
  {
    title: 'Calls',
    href: '/calls',
    icon: 'search',
  },
  {
    title: 'Analytics',
    href: '/analytics',
    icon: 'arrowUp',
  },
  {
    title: 'Settings',
    href: '/settings',
    icon: 'alertCircle',
  },
];

export function Sidebar({ className }: SidebarProps) {
  const location = useLocation();

  return (
    <div className={cn('pb-12', className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Admin Portal
          </h2>
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = Icons[item.icon];
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    'flex items-center rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground',
                    location.pathname === item.href ? 'bg-accent text-accent-foreground' : 'transparent'
                  )}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {item.title}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
} 