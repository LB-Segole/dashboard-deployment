import nodemailer from 'nodemailer';
import { config } from '../config';

const transporter = nodemailer.createTransport({
  host: config.email.host,
  port: config.email.port,
  secure: config.email.secure,
  auth: {
    user: config.email.user,
    pass: config.email.password
  }
});

export const EmailService = {
  async sendVerificationEmail(email: string, userId: string) {
    const verificationLink = `${config.app.url}/verify-email?token=${userId}`;
    
    await transporter.sendMail({
      from: `VoiceAI <${config.email.from}>`,
      to: email,
      subject: 'Verify Your Email Address',
      html: `Click <a href="${verificationLink}">here</a> to verify your email.`
    });
  },

  async sendPasswordResetEmail(email: string, token: string) {
    // Implementation for password reset email
  }
};