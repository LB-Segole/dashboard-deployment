import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import {
  getUserProfile,
  updateUserProfile,
  updateUserPreferences,
  getUserUsage
} from '../controllers/users';

const router = Router();

// User profile
router.get('/profile', authenticate, getUserProfile);
router.patch('/profile', authenticate, updateUserProfile);

// Preferences
router.patch('/preferences', authenticate, updateUserPreferences);

// Usage
router.get('/usage', authenticate, getUserUsage);

export default router;