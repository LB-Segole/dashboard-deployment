import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma';
import { AppError } from '../errors/AppError';
import { EmailService } from './email-service';
import { config } from '../config';

export const AuthService = {
  async register(email: string, password: string, name: string) {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) throw new AppError('Email already in use', 400);

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { email, password: hashedPassword, name }
    });

    await EmailService.sendVerificationEmail(user.email, user.id);

    return this.generateTokens(user.id);
  },

  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new AppError('Invalid credentials', 401);

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) throw new AppError('Invalid credentials', 401);

    return this.generateTokens(user.id);
  },

  async refreshToken(refreshToken: string) {
    try {
      const payload = jwt.verify(refreshToken, config.jwt.refreshSecret) as { userId: string };
      return this.generateTokens(payload.userId);
    } catch (error) {
      throw new AppError('Invalid refresh token', 401);
    }
  },

  generateTokens(userId: string) {
    const accessToken = jwt.sign({ userId }, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn
    });

    const refreshToken = jwt.sign({ userId }, config.jwt.refreshSecret, {
      expiresIn: config.jwt.refreshExpiresIn
    });

    return { accessToken, refreshToken };
  },

  async verifyEmail(userId: string) {
    await prisma.user.update({
      where: { id: userId },
      data: { emailVerified: new Date() }
    });
  },

  async resetPassword(email: string, newPassword: string, token: string) {
    // Implementation for password reset
  }
};