import { Router } from 'express';
import {
  handleCallEvent,
  handleRecordingEvent,
  handleTranscriptEvent,
  listWebhooks,
  createWebhook,
  deleteWebhook
} from '../controllers/webhooks';

const router = Router();

// Incoming webhooks
router.post('/call-events', handleCallEvent);
router.post('/recording-events', handleRecordingEvent);
router.post('/transcript-events', handleTranscriptEvent);

// Webhook management
router.get('/', authenticate, listWebhooks);
router.post('/', authenticate, createWebhook);
router.delete('/:id', authenticate, deleteWebhook);

export default router;