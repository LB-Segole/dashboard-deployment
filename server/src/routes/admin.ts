import { Router } from 'express';
import { authenticateAdmin } from '../middleware/auth';
import {
  getSystemMetrics,
  updateSystemConfig,
  getAuditLogs,
  manageUsers
} from '../controllers/admin';

const router = Router();

// Admin dashboard routes
router.get('/metrics', authenticateAdmin, getSystemMetrics);
router.patch('/config', authenticateAdmin, updateSystemConfig);
router.get('/audit-logs', authenticateAdmin, getAuditLogs);

// User management
router.get('/users', authenticateAdmin, manageUsers.getAllUsers);
router.get('/users/:id', authenticateAdmin, manageUsers.getUser);
router.patch('/users/:id', authenticateAdmin, manageUsers.updateUser);
router.delete('/users/:id', authenticateAdmin, manageUsers.deleteUser);

export default router;