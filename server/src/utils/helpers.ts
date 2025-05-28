import { TimeRange } from '../types/api';

export class Helpers {
  static formatPhoneNumber(phone: string): string {
    return phone.replace(/\D/g, '').replace(/^(\d{1})(\d{3})(\d{3})(\d{4})$/, '+$1 ($2) $3-$4');
  }

  static generateRandomDigits(length: number): string {
    return Array.from({ length }, () => Math.floor(Math.random() * 10)).join('');
  }

  static getDateRange(range: TimeRange): { start: Date; end: Date } {
    const end = new Date();
    const start = new Date();

    switch (range) {
      case '24h':
        start.setHours(end.getHours() - 24);
        break;
      case '7d':
        start.setDate(end.getDate() - 7);
        break;
      case '30d':
        start.setDate(end.getDate() - 30);
        break;
      case '90d':
        start.setDate(end.getDate() - 90);
        break;
    }

    return { start, end };
  }

  static capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }
}