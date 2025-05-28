import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  path?: string;
}

export const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  
  const getBreadcrumbs = (): BreadcrumbItem[] => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [];

    // Always start with Admin Dashboard
    breadcrumbs.push({ label: 'Dashboard', path: '/admin' });

    // Map path segments to readable labels
    const segmentLabels: Record<string, string> = {
      'admin': 'Admin',
      'users': 'Users',
      'calls': 'Calls',
      'agents': 'Agents',
      'analytics': 'Analytics',
      'settings': 'Settings',
      'create': 'Create',
      'edit': 'Edit',
      'details': 'Details'
    };

    let currentPath = '';
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      
      // Skip the admin segment as it's already added
      if (segment === 'admin') return;
      
      const label = segmentLabels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
      
      // Don't add path for the last segment (current page)
      const isLast = index === pathSegments.length - 1;
      breadcrumbs.push({
        label,
        path: isLast ? undefined : currentPath
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <nav className="flex items-center space-x-1 text-sm text-gray-600">
      <Home className="h-4 w-4" />
      
      {breadcrumbs.map((breadcrumb, index) => (
        <React.Fragment key={index}>
          <ChevronRight className="h-4 w-4 text-gray-400" />
          
          {breadcrumb.path ? (
            <Link
              to={breadcrumb.path}
              className="hover:text-blue-600 transition-colors duration-200"
            >
              {breadcrumb.label}
            </Link>
          ) : (
            <span className="text-gray-900 font-medium">
              {breadcrumb.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumbs;