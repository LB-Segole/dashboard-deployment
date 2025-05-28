/**
 * Application Permissions
 * Fine-grained permission system for role-based access control
 */

export const Permissions = {
  // Voice Agent Permissions
  VOICE_AGENT_CREATE: 'voice_agent:create',
  VOICE_AGENT_READ: 'voice_agent:read',
  VOICE_AGENT_UPDATE: 'voice_agent:update',
  VOICE_AGENT_DELETE: 'voice_agent:delete',
  VOICE_AGENT_DEPLOY: 'voice_agent:deploy',

  // Call Permissions
  CALL_INITIATE: 'call:initiate',
  CALL_RECORD: 'call:record',
  CALL_TRANSCRIBE: 'call:transcribe',
  CALL_ANALYZE: 'call:analyze',

  // User Management
  USER_READ: 'user:read',
  USER_UPDATE: 'user:update',
  USER_DELETE: 'user:delete',

  // Admin Permissions
  ADMIN_ACCESS: 'admin:access',
  BILLING_READ: 'billing:read',
  BILLING_UPDATE: 'billing:update',
} as const;

export type Permission = typeof Permissions[keyof typeof Permissions];

export const PermissionDescriptions: Record<Permission, string> = {
  [Permissions.VOICE_AGENT_CREATE]: 'Create new voice agents',
  [Permissions.VOICE_AGENT_READ]: 'View voice agents',
  [Permissions.VOICE_AGENT_UPDATE]: 'Modify voice agents',
  [Permissions.VOICE_AGENT_DELETE]: 'Delete voice agents',
  [Permissions.VOICE_AGENT_DEPLOY]: 'Deploy voice agents',
  
  [Permissions.CALL_INITIATE]: 'Initiate calls',
  [Permissions.CALL_RECORD]: 'Record calls',
  [Permissions.CALL_TRANSCRIBE]: 'Transcribe calls',
  [Permissions.CALL_ANALYZE]: 'Analyze call data',
  
  [Permissions.USER_READ]: 'View user profiles',
  [Permissions.USER_UPDATE]: 'Update user profiles',
  [Permissions.USER_DELETE]: 'Delete users',
  
  [Permissions.ADMIN_ACCESS]: 'Access admin dashboard',
  [Permissions.BILLING_READ]: 'View billing information',
  [Permissions.BILLING_UPDATE]: 'Update billing information',
};