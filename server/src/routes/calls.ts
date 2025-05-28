import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import {
  initiateCall,
  getCall,
  getCalls,
  endCall,
  callRecording,
  callAnalytics
} from '../controllers/calls';

const router = Router();

// Call management
router.post('/', authenticate, initiateCall);
router.get('/', authenticate, getCalls);
router.get('/:id', authenticate, getCall);
router.post('/:id/end', authenticate, endCall);

// Call recordings
router.get('/:id/recording', authenticate, callRecording.getRecording);
router.delete('/:id/recording', authenticate, callRecording.deleteRecording);

// Analytics
router.get('/:id/analytics', authenticate, callAnalytics);

export default router;