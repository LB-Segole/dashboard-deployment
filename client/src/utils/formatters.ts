/**
 * Formatting utilities for VoiceAI platform
 */

import type { CallSession } from '@/types/client';

// Format duration in seconds to HH:MM:SS
export function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);

  return [h, m, s]
    .map(v => v.toString().padStart(2, '0'))
    .filter((v, i) => v !== '00' || i > 0)
    .join(':');
}

// Format date to relative time (e.g., "2 minutes ago")
export function formatRelativeTime(date: Date | string): string {
  const now = new Date();
  const then = typeof date === 'string' ? new Date(date) : date;
  const diffInSeconds = Math.floor((now.getTime() - then.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  
  return then.toLocaleDateString();
}

// Format phone number for display
export function formatPhoneNumber(phoneNumber: string): string {
  // US numbers only for now
  const cleaned = phoneNumber.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  return match ? `(${match[1]}) ${match[2]}-${match[3]}` : phoneNumber;
}

// Format call status for display
export function formatCallStatus(status: CallSession['status']): string {
  const statusMap = {
    initiating: 'Connecting...',
    ringing: 'Ringing',
    active: 'In Progress',
    ended: 'Completed',
    failed: 'Failed',
  };
  return statusMap[status] || status;
}

// Format file size in bytes to human readable
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1073741824) return `${(bytes / 1048576).toFixed(1)} MB`;
  return `${(bytes / 1073741824).toFixed(1)} GB`;
}

// Format confidence score to percentage
export function formatConfidence(score: number): string {
  return `${Math.round(score * 100)}%`;
}