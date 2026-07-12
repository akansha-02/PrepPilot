import { Router } from 'express';
import {
  createSession,
  deleteSession,
  generateQuestions,
  getSession,
  listSessions
} from '../controllers/sessionController.js';
import { submitAnswer } from '../controllers/interviewController.js';
import { uploadSingleResume } from '../middleware/upload.js';

const router = Router();

router.get('/', listSessions);
router.post('/', uploadSingleResume, createSession);
router.get('/:sessionId', getSession);
router.delete('/:sessionId', deleteSession);
router.post('/:sessionId/generate', generateQuestions);
router.post('/:sessionId/answer', submitAnswer);

export default router;