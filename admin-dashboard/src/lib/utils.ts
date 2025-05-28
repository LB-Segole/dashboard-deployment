import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function capitalize(str: string) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function formatDuration(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function formatPhoneNumber(phone: string) {
  // Simple US phone formatting
  return phone.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
}

export function parseCallTranscript(transcript: string) {
  // Dummy parser: split by lines, expect 'Speaker: text' format
  return transcript.split('\n').map(line => {
    const [speaker, ...text] = line.split(': ');
    return { speaker, text: text.join(': ') };
  });
}
