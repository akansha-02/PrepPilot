import { Router } from 'express';
import sessionRoutes from './sessionRoutes.js';

const router = Router();

router.use('/sessions', sessionRoutes);

export default router;