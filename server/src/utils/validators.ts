import validator from 'validator';
import { AGENT_PERSONAS, VOICE_MODELS } from './Constants';

export class Validators {
  static isEmail(email: string): boolean {
    return validator.isEmail(email);
  }

  static isPhoneNumber(phone: string): boolean {
    return validator.isMobilePhone(phone, 'any', { strictMode: true });
  }

  static isStrongPassword(password: string): boolean {
    return (
      validator.isLength(password, { min: 8 }) &&
      /\d/.test(password) &&
      /[A-Z]/.test(password) &&
      /[^A-Za-z0-9]/.test(password)
    );
  }

  static isValidPersona(persona: string): boolean {
    return AGENT_PERSONAS.includes(persona as any);
  }

  static isValidVoiceModel(model: string): boolean {
    return VOICE_MODELS.includes(model as any);
  }
}