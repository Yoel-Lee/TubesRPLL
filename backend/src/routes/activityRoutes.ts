import { Router } from 'express';
import { getActivities } from '../controllers/activityController.js';
import { verifyToken, verifyAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/', verifyToken, verifyAdmin, getActivities);

export default router;