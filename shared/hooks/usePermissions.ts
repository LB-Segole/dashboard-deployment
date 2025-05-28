/**
 * usePermissions Hook
 * Provides role-based permission checking functionality
 */

import { useAuth } from './useauth';
import { Permissions } from '../constants/permissions';

export const usePermissions = () => {
  const { hasPermission, role } = useAuth();

  const checkPermission = (permission: keyof typeof Permissions) => {
    return hasPermission(Permissions[permission]);
  };

  const checkAnyPermission = (permissions: Array<keyof typeof Permissions>) => {
    return permissions.some(permission => hasPermission(Permissions[permission]));
  };

  const checkAllPermissions = (permissions: Array<keyof typeof Permissions>) => {
    return permissions.every(permission => hasPermission(Permissions[permission]));
  };

  return {
    checkPermission,
    checkAnyPermission,
    checkAllPermissions,
    role,
  };
};