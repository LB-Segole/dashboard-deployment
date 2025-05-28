// utils/permissions.ts
import { ROLES } from './adminConstants';
import type { User, AdminUser } from '@/types/admin';

type Permission = 
  | 'view_dashboard'
  | 'manage_users'
  | 'manage_agents'
  | 'view_calls'
  | 'manage_call_recordings'
  | 'view_analytics'
  | 'manage_system_settings'
  | 'perform_admin_actions';

const ROLE_PERMISSIONS: Record<string, Permission[]> = {
  [ROLES.SUPERADMIN]: [
    'view_dashboard',
    'manage_users',
    'manage_agents',
    'view_calls',
    'manage_call_recordings',
    'view_analytics',
    'manage_system_settings',
    'perform_admin_actions',
  ],
  [ROLES.ADMIN]: [
    'view_dashboard',
    'manage_users',
    'manage_agents',
    'view_calls',
    'manage_call_recordings',
    'view_analytics',
    'manage_system_settings',
  ],
  [ROLES.MANAGER]: [
    'view_dashboard',
    'view_calls',
    'manage_call_recordings',
    'view_analytics',
  ],
  [ROLES.AGENT]: [
    'view_dashboard',
    'view_calls',
  ],
  [ROLES.USER]: [],
};

export const hasPermission = (user: User | AdminUser, permission: Permission): boolean => {
  return ROLE_PERMISSIONS[user.role]?.includes(permission) || false;
};

export const checkPermissions = (
  user: User | AdminUser,
  requiredPermissions: Permission[],
  requireAll: boolean = true
): boolean => {
  if (!requiredPermissions.length) return true;
  
  const userPermissions = ROLE_PERMISSIONS[user.role] || [];
  
  if (requireAll) {
    return requiredPermissions.every(perm => userPermissions.includes(perm));
  }
  
  return requiredPermissions.some(perm => userPermissions.includes(perm));
};

export const getAvailableRoutes = (user: User | AdminUser): string[] => {
  const baseRoutes = ['/dashboard'];
  
  if (hasPermission(user, 'manage_users')) baseRoutes.push('/users');
  if (hasPermission(user, 'manage_agents')) baseRoutes.push('/agents');
  if (hasPermission(user, 'view_calls')) baseRoutes.push('/calls');
  if (hasPermission(user, 'view_analytics')) baseRoutes.push('/analytics');
  if (hasPermission(user, 'manage_system_settings')) baseRoutes.push('/settings');
  
  return baseRoutes;
};