// utils/adminHelpers.ts
import { ROLES, STATUS_OPTIONS } from './adminConstants';
import type { User, UserRole, AdminUser } from '@/types/admin';

export const hasAdminAccess = (user: User | AdminUser): boolean => {
  return user.role === ROLES.SUPERADMIN || user.role === ROLES.ADMIN;
};

export const formatUserRole = (role: UserRole): string => {
  const roleMap: Record<UserRole, string> = {
    superadmin: 'Super Admin',
    admin: 'Admin',
    manager: 'Manager',
    agent: 'Agent',
    user: 'User',
  };
  return roleMap[role] || role;
};

export const formatStatus = (status: string): string => {
  const found = STATUS_OPTIONS.find(opt => opt.value === status);
  return found ? found.label : status;
};

export const formatDate = (dateString: string, format: string = 'human'): string => {
  const date = new Date(dateString);
  
  if (format === 'human') {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  }
  
  return new Intl.DateTimeFormat('en-US').format(date);
};

export const formatDuration = (seconds: number): string => {
  if (seconds < 60) return `${seconds}s`;
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  if (minutes < 60) return `${minutes}m ${remainingSeconds}s`;
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  return `${hours}h ${remainingMinutes}m`;
};

export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const formatPhoneNumber = (phone: string): string => {
  // Simple formatting - would use a library like libphonenumber in production
  const cleaned = phone.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{1})(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `+${match[1]} (${match[2]}) ${match[3]}-${match[4]}`;
  }
  return phone;
};