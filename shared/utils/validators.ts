/**
 * Validation Utilities
 */

export class Validators {
  static isEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  static isPhone(phone: string): boolean {
    const re = /^\+?[0-9\s\-\(\)]{10,}$/;
    return re.test(phone);
  }

  static isUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  static isStrongPassword(password: string): boolean {
    // At least 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
    return re.test(password);
  }

  static isEmpty(value: string | unknown[] | Record<string, unknown>): boolean {
    if (typeof value === 'string') {
      return value.trim().length === 0;
    } else if (Array.isArray(value)) {
      return value.length === 0;
    } else if (typeof value === 'object' && value !== null) {
      return Object.keys(value).length === 0;
    }
    return true;
  }

  static isDateInFuture(date: Date): boolean {
    return new Date(date) > new Date();
  }

  static isWithinRange(
    value: number,
    min: number,
    max: number,
    inclusive = true
  ): boolean {
    return inclusive
      ? value >= min && value <= max
      : value > min && value < max;
  }
}