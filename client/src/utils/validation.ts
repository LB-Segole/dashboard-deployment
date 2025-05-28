/**
 * Validation utilities for VoiceAI platform
 */

import type { Result } from '@/types';

// Email validation
export function validateEmail(email: string): Result<string> {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!re.test(email)) {
    return {
      success: false,
      error: {
        message: 'Please enter a valid email address',
        statusCode: 400,
        timestamp: new Date(),
      },
    };
  }
  return { success: true, data: email };
}

// Password validation
export function validatePassword(password: string): Result<string> {
  if (password.length < 8) {
    return {
      success: false,
      error: {
        message: 'Password must be at least 8 characters',
        statusCode: 400,
        timestamp: new Date(),
      },
    };
  }
  return { success: true, data: password };
}

// Phone number validation (basic)
export function validatePhoneNumber(phone: string): Result<string> {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length < 10) {
    return {
      success: false,
      error: {
        message: 'Please enter a valid phone number',
        statusCode: 400,
        timestamp: new Date(),
      },
    };
  }
  return { success: true, data: cleaned };
}

// Form validation helper
export function validateForm<T extends Record<string, any>>(
  values: T,
  validators: Record<keyof T, (value: any) => Result<any>>
): Result<T> {
  const errors: Record<string, string> = {};
  const validatedValues: Record<string, any> = {};

  for (const [key, validator] of Object.entries(validators)) {
    const result = validator(values[key]);
    if (!result.success) {
      errors[key] = result.error.message;
    } else {
      validatedValues[key] = result.data;
    }
  }

  if (Object.keys(errors).length > 0) {
    return {
      success: false,
      error: {
        message: 'Form validation failed',
        statusCode: 400,
        details: errors,
        timestamp: new Date(),
      },
    };
  }

  return { success: true, data: validatedValues as T };
}

// URL validation
export function validateUrl(url: string): Result<string> {
  try {
    new URL(url);
    return { success: true, data: url };
  } catch {
    return {
      success: false,
      error: {
        message: 'Please enter a valid URL',
        statusCode: 400,
        timestamp: new Date(),
      },
    };
  }
}

// Required field validation
export function validateRequired(value: string, fieldName: string): Result<string> {
  if (!value.trim()) {
    return {
      success: false,
      error: {
        message: `${fieldName} is required`,
        statusCode: 400,
        timestamp: new Date(),
      },
    };
  }
  return { success: true, data: value };
}