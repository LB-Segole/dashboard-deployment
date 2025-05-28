import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import {
  createAgent,
  getAgents,
  getAgent,
  updateAgent,
  deleteAgent,
  testAgent
} from '../controllers/agents';

const router = Router();

// Agent management
router.post('/', authenticate, createAgent);
router.get('/', authenticate, getAgents);
router.get('/:id', authenticate, getAgent);
router.patch('/:id', authenticate, updateAgent);
router.delete('/:id', authenticate, deleteAgent);

// Agent testing
router.post('/:id/test', authenticate, testAgent);

export default router;