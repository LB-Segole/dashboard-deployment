/**
 * RoleBasedAccess Component
 * Controls component visibility based on user roles
 */

import { ReactNode } from 'react';
import { useAuth } from '../hooks/useAuth';

interface RoleBasedAccessProps {
  children: ReactNode;
  allowedRoles: string[];
  fallback?: ReactNode;
}

export const RoleBasedAccess = ({
  children,
  allowedRoles,
  fallback = null,
}: RoleBasedAccessProps) => {
  const { user } = useAuth();

  if (!user) {
    return fallback;
  }

  const hasAccess = allowedRoles.includes(user.role);

  return hasAccess ? <>{children}</> : <>{fallback}</>;
};