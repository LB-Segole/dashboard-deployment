import { Router } from 'express';
import authRoutes from './auth';
import callsRoutes from './calls';
import agentsRoutes from './agents';
import transcriptsRoutes from './transcripts';
import usersRoutes from './users';
import webhooksRoutes from './webhooks';
import adminRoutes from './admin';

const router = Router();

// API routes
router.use('/auth', authRoutes);
router.use('/calls', callsRoutes);
router.use('/agents', agentsRoutes);
router.use('/transcripts', transcriptsRoutes);
router.use('/users', usersRoutes);
router.use('/webhooks', webhooksRoutes);
router.use('/admin', adminRoutes);

// Health check
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

export default router;