/**
 * Permission Utilities
 */

import { Permissions, Roles } from '../constants';

export class PermissionUtils {
  static hasPermission(
    userPermissions: string[],
    requiredPermission: string
  ): boolean {
    return userPermissions.includes(requiredPermission);
  }

  static hasAnyPermission(
    userPermissions: string[],
    requiredPermissions: string[]
  ): boolean {
    return requiredPermissions.some((perm) => userPermissions.includes(perm));
  }

  static hasAllPermissions(
    userPermissions: string[],
    requiredPermissions: string[]
  ): boolean {
    return requiredPermissions.every((perm) => userPermissions.includes(perm));
  }

  static getRolePermissions(role: string): string[] {
    return Roles[role as keyof typeof Roles] || [];
  }

  static isHigherRole(userRole: string, targetRole: string): boolean {
    const hierarchy = {
      [Roles.SUPER_ADMIN]: 4,
      [Roles.ADMIN]: 3,
      [Roles.MANAGER]: 2,
      [Roles.USER]: 1,
      [Roles.GUEST]: 0,
    };

    return hierarchy[userRole as keyof typeof hierarchy] > hierarchy[targetRole as keyof typeof hierarchy];
  }
}