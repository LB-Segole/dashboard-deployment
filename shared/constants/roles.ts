/**
 * User Roles and Permission Mapping
 * Defines application roles and their associated permissions
 */

import { Permissions } from './permissions';

export const Roles = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  MANAGER: 'manager',
  AGENT: 'agent',
  USER: 'user',
  GUEST: 'guest',
} as const;

export type Role = typeof Roles[keyof typeof Roles];

export const RolePermissions: Record<Role, Array<typeof Permissions[keyof typeof Permissions]>> = {
  [Roles.SUPER_ADMIN]: Object.values(Permissions),
  [Roles.ADMIN]: [
    Permissions.VOICE_AGENT_CREATE,
    Permissions.VOICE_AGENT_READ,
    Permissions.VOICE_AGENT_UPDATE,
    Permissions.VOICE_AGENT_DEPLOY,
    Permissions.CALL_INITIATE,
    Permissions.CALL_RECORD,
    Permissions.CALL_TRANSCRIBE,
    Permissions.CALL_ANALYZE,
    Permissions.USER_READ,
    Permissions.USER_UPDATE,
    Permissions.ADMIN_ACCESS,
    Permissions.BILLING_READ,
  ],
  [Roles.MANAGER]: [
    Permissions.VOICE_AGENT_READ,
    Permissions.VOICE_AGENT_UPDATE,
    Permissions.CALL_INITIATE,
    Permissions.CALL_RECORD,
    Permissions.CALL_TRANSCRIBE,
    Permissions.USER_READ,
  ],
  [Roles.AGENT]: [
    Permissions.VOICE_AGENT_READ,
    Permissions.CALL_INITIATE,
    Permissions.CALL_RECORD,
  ],
  [Roles.USER]: [
    Permissions.VOICE_AGENT_READ,
    Permissions.CALL_INITIATE,
  ],
  [Roles.GUEST]: [],
};

export const RoleHierarchy: Record<Role, number> = {
  [Roles.SUPER_ADMIN]: 5,
  [Roles.ADMIN]: 4,
  [Roles.MANAGER]: 3,
  [Roles.AGENT]: 2,
  [Roles.USER]: 1,
  [Roles.GUEST]: 0,
};