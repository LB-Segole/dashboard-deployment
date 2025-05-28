import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import {
  getTranscript,
  getTranscripts,
  deleteTranscript,
  analyzeTranscript,
  exportTranscript
} from '../controllers/transcripts';

const router = Router();

// Transcript management
router.get('/', authenticate, getTranscripts);
router.get('/:id', authenticate, getTranscript);
router.delete('/:id', authenticate, deleteTranscript);

// Transcript analysis
router.get('/:id/analyze', authenticate, analyzeTranscript);

// Export
router.get('/:id/export', authenticate, exportTranscript);

export default router;