import { Router } from 'express';
import {
  register,
  login,
  logout,
  forgotPassword,
  resetPassword,
  verifyEmail,
  refreshToken,
  getCurrentUser
} from '../controllers/auth';

const router = Router();

// Authentication routes
router.post('/register', register);
router.post('/login', login);
router.post('/logout', authenticate, logout);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/verify-email', verifyEmail);
router.post('/refresh-token', refreshToken);

// Current user
router.get('/me', authenticate, getCurrentUser);

export default router;