import crypto from 'crypto';
import { config } from '../config';

export class Encryption {
  private static algorithm = 'aes-256-cbc';
  private static ivLength = 16;

  static encrypt(text: string): string {
    const iv = crypto.randomBytes(this.ivLength);
    const cipher = crypto.createCipheriv(
      this.algorithm,
      Buffer.from(config.encryptionKey),
      iv
    );
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
  }

  static decrypt(text: string): string {
    const parts = text.split(':');
    const iv = Buffer.from(parts.shift()!, 'hex');
    const encryptedText = Buffer.from(parts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv(
      this.algorithm,
      Buffer.from(config.encryptionKey),
      iv
    );
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  }

  static hash(text: string): string {
    return crypto
      .createHash('sha256')
      .update(text + config.hashSalt)
      .digest('hex');
  }
}