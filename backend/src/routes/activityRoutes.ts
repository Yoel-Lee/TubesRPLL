import { Router } from 'express';
import { getActivities } from '../controllers/activityController.js';
import { verifyToken, verifyAdmin } from '../middleware/auth.js';

const router = Router();

// Endpoint ini akan diproteksi, hanya role ADMIN yang bisa akses
router.get('/', verifyToken, verifyAdmin, getActivities);

export default router;